      
define(['services/logger',
  'services/common',
  'durandal/app',
  'plugins/router',
  'services/viewController'],
function (logger, com, app, router, viewController) {

    var activate = function () {
        pager(new helper.pager(context, requests));
       
        var views = [];
        var view = viewController.createViewObject('firstRequests', 'درخواستهای اولیه');
        view.css = 'btn-danger';
        view.loadStatus = ko.observable('notLoad');
        //view.loadFunc = loadFirstRequests;
        views.push(view);

        //view = viewController.createViewObject('doneOrders', 'درخواستهای خرید شده');
        //view.css = 'btn-success';
        //view.loadStatus = ko.observable('notLoad');
        //view.loadFunc = loadDoneOrder;
        //views.push(view);

        //view = viewController.createViewObject('inputRequests', 'درخواستهای رسید شده');
        //view.css = 'btn-primary';
        //view.loadStatus = ko.observable('notLoad');
        //view.loadFunc = loadInput;
        //views.push(view);
        
        viewController.rebuild(views);
        changeView(views.first());
        
        return init();
    };
    var canDeactivate = function () {
        if (hasChanges()) {
            var title = 'آیا مایل به ادامه عملیات هستید ؟';

            var msg = 'ترک صفحه و لغو تغییرات';

            return app.showMessage(title, msg, ['Yes', 'No'])
                .then(checkAnswer);
        }
        return true;

        function checkAnswer(selectedOption) {
            if (selectedOption === 'Yes') {
                
            }
            return selectedOption;
        }
    };

    var deactivate = function () {
        com.deactivate();
    };
    var attached = function () {
    };

    var requests = ko.observableArray();
    
    var init = function () {
        load();
    };

    var load = function (callback) {
        var navigarions = [
            'Section',
            'Section.Parent',
            'ConsumerSection',
            'Person'
        ];
        
        var queries = [];
        queries.push(context.query('RequestGoods').expand(navigarions));
        queries.push(context.query('RequestServices').expand(navigarions));
        queries.push(context.query('RequestFoods').expand(navigarions));
        queries.push(context.query('RequestTickets').expand(navigarions));
        queries.push(context.query('RequestVehicles').expand(navigarions));
        
        

        queries.foreach(function(q) {
            q = q.expand(navigarions);
        });
        
        pager().setQueries(queries);
        pager().setCallbackBeforeLoad(function () {
            requests.removeAll();
        });
        
        pager().setCallback(function (data) {
            var results = data.results;
            results.foreach(function (item) {
                item.RequestType = ko.observable(item.entityType.shortName.replaceAll('Request', ''));
                
                item.loadStatus = ko.observable('notLoad');
                item.isCompletedForPurchase = ko.computed(function() {
                    if (!item['RequestDetail'+ item.RequestType() +'s'].any())
                        return false;
                    return !item['RequestDetail'+ item.RequestType() +'s'].any(function(rdg) {
                        return isNullOrEmpty(rdg['Item' + item.RequestType()]()) && rdg.IsOrder();
                    });
                });
                item.isCompletedForOutput = ko.computed(function () {
                    if (item.RequestType() != 'Good')
                        return false;
                    
                    if (!item.RequestDetailGoods.any())
                        return false;
                    return !item.RequestDetailGoods.any(function (rdg) {
                        return isNullOrEmpty(rdg.ItemGood()) && rdg.InventoryQty() >= rdg.Qty();
                    });
                });

                requests.push(item);
            });
            requests.sort(function (left, right) {
                return left.ID() == right.ID() ? 0 : (left.ID() > right.ID() ? -1 : 1);
            });
            
            if (callback) callback();   
        });
        pager().changeAllData(false);
        return pager().load();
    };

    var loadDetail = function(item) {
        var q = context.query('RequestDetail' + item.RequestType() + 's');
        var preds = [];
        preds.push(context.predicate('Request' + item.RequestType() + 'ID', '==', item.ID()));
        preds.push(context.predicate('IsCancel', '==', false));
        q = q.where(breeze.Predicate.and(preds));

        var navigarions = [
        ];

        if (['Good', 'Food', 'Service', 'Vehicle'].contains(item.RequestType())) {
            navigarions.push('Item' + item.RequestType());
        }

        if (item.RequestType() === 'Good') {
            navigarions.push('InputDetail');
            navigarions.push('InputDetail.Input');
        }

        if (item.RequestType() === 'Ticket') {
            navigarions.push('Passenger');
        }

        q = q.expand(navigarions);

        context.executeQuery(q).then(function(data) {
            var results = data.results;

            results.foreach(function(rdg) {
                rdg.orgianlIsOrder = ko.observable(rdg.IsOrder());
                rdg.isSelected = ko.observable(false);
                //rdg.IsOrder(true);
                rdg.RequestType = ko.observable(item.RequestType());
                if (item.RequestType() === 'Good') {
                    if (rdg.ItemGood().No() == '0') {
                        rdg.ItemGood(null);
                        rdg.ItemGoodID(null);
                    }
                }
            });
            item.loadStatus('loaded');
        });
    };
    
    var save = function () {
        if (hasChanges())
            context.saveChanges();
    };
    
    var saveOnly = function (item) {
        saveRequest(item, function () { });
    };

    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var pager = ko.observable();

    var changeShowStatus = function (item) {
        if (item.loadStatus() == 'loaded') {
            item.ShowDetail(!item.ShowDetail());
            return;
        }
        
        item.loadStatus('loading');

        loadDetail(item);
     
        item.ShowDetail(!item.ShowDetail());
    };
    var getInventoryQty = function(item) {
        if (isNullOrEmpty(item.ItemGood().ID())) {
            helper.note.warning('ابتدا کالای قطعی را انتخاب کنید');
            return;
        }
            
        item.InventoryQty(-2);

        var q = context.query('GetInventrory');
        q = q.withParameters({ itemGoodId: item.ItemGood().ID() });

        context.executeQuery(q)
            .then(function(data) {
                item.InventoryQty(data.results[0]);
            });
    };
    
    var itemAfterUpdate = function (item) {
        if (item.RequestType() == 'Good') {
            if (isNullOrEmpty(item.ItemGoodID()))
                return;

            if (item.ItemGoodID() == 0)
                return;

            if (item.InventoryQty() <= 0)
                getInventoryQty(item);
        } else {
            item.Scale(item['Item' + item.RequestType()]());
            item.ScaleID(item['Item' + item.RequestType()]().ID());
        }
    };
    
    var saveRequest = function (item, callbackAfterUpdate) {
        var items = [];
        if (!item.entityAspect.entityState.isUnchanged())
            items.push(item);
        item.RequestDetailGoods.foreach(function (rdg) {
            if (!rdg.entityAspect.entityState.isUnchanged())
                items.push(rdg);
        });

        context.manager.saveChanges(items)
            .then(function() {
                helper.note.successDefault();
                callbackAfterUpdate();
            });
    };
    
    var goToOrder = function (item) {
        if (!item.isCompleted())
            return;
        
        item.HasOrder(true);
        item.Status('Order');
        
        saveRequest(item, function () {
            helper.note.success('درخواست کالای مورد نظر به درخواست خرید تبدیل شد');
        });
    };

    var createInput = function(item) {
        var q = context.query('CreateNewInput');
        q = q.withParameters({ requestGoodId: item.ID() });

        context.executeQuery(q)
            .then(function (data) {
                var d = data;
            });
    };
    
    var createOutput = function (item) {
        var q = context.query('CreateNewOutput');
        q = q.withParameters({ requestGoodId: item.ID() });

        context.executeQuery(q)
            .then(function (data) {
                var d = data;
            });
    };
    
    var changeView = function(view) {
        if (view.loadStatus() === 'notLoad') {
            view.loadStatus('loading');
            //view.loadFunc(function() {
            //    view.loadStatus('loaded');
            //});
        }
            
        viewController.selectView(view);
    };

    var getViewCss = function (view) {
        var obj = {};
        obj[view.css] = true;
        return obj;
    };
    
    var getRequestIcon = function (type) {
        var className = 'icon-' + type.toLowerCase();
        var obj = {};
        obj[className] = true;
        return obj;
    };

    var collapse = function() {
        requests.foreach(function(item) {
            item.ShowDetail(false);
        });
    };
    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        attached: attached,
        title: '',
        hasChanges: hasChanges,
        requests: requests, 
        pager: pager,
        init: init,
        loadDetail: loadDetail,
        save: save,
        saveOnly:saveOnly,
        viewController: viewController,
        changeView: changeView,
        getViewCss: getViewCss,
        getRequestIcon: getRequestIcon,
        changeShowStatus: changeShowStatus,
        getInventoryQty: getInventoryQty,
        itemAfterUpdate: itemAfterUpdate,
        goToOrder: goToOrder,
        createInput: createInput,
        createOutput: createOutput,
        collapse: collapse
    };


});
   
