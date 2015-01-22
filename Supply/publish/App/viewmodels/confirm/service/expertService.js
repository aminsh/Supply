      
define(['services/logger',
  'services/common',
  'durandal/app',
  'plugins/router',
  'services/viewController'],
function (logger, com, app, router, viewController) {

    var activate = function () {
        firstpager(new helper.pager(context, firstRequests));

        var views = [];
        var view = viewController.createViewObject('firstRequests', 'درخواستهای اولیه');
        view.css = 'btn-danger';
        view.loadStatus = ko.observable('notLoad');
        view.loadFunc = loadFirstRequests;
        views.push(view);

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
    var viewAttached = function () {
    };

    var firstRequests = ko.observableArray();
    
    var init = function () {
        return loadFirstRequests();
        //var q = context.query('Entitys');

        //var navigarions = [
        //    ""
        //];

        //q = q.expand(navigarions);

        //Entitypager().setQuery(q);
        //Entitypager().changeAllData(false);
        //return Entitypager().load();
    };

    var loadFirstRequests = function(callback) {
        var q = context.query('RequestServicesExpert');
        q = q.orderByDesc('ID');
        var navigarions = [
            'Section',
            'Section.Parent',
            'ConsumerSection',
            'Person'
        ];

        q = q.expand(navigarions);

        firstpager().setCallback(function (data) {
            var results = data.results;
            results.foreach(function (item) {
                item.loadStatus = ko.observable('notLoad');
                item.isCompletedForPurchase = ko.computed(function() {
                    if (!item.RequestDetailServices.any())
                        return false;
                    return !item.RequestDetailServices.any(function (rdg) {
                        return isNullOrEmpty(rdg.ItemService()) && rdg.IsOrder();
                    });
                });
                
            });
            firstRequests(results);
            if (callback) callback();   
        });
        firstpager().setQuery(q);
        firstpager().changeAllData(false);
        return firstpager().load();
    };
    
    var save = function () {
        if (hasChanges())
            context.saveChanges();
    };
    
    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var firstpager = ko.observable();

    var changeShowStatus = function (item) {
        if (item.loadStatus() == 'loaded') {
            item.ShowDetail(!item.ShowDetail());
            return;
        }
        
        item.loadStatus('loading');

        var q = context.query('RequestDetailServices');
        var preds = [];
        preds.push(context.predicate('RequestServiceID', '==', item.ID()));
        preds.push(context.predicate('IsCancel', '==', false));
        q = q.where(breeze.Predicate.and(preds));
        
        var navigarions = [
            'ItemService'
        ];

        q = q.expand(navigarions);
        
        context.executeQuery(q).then(function(data) {
            var results = data.results;
            results.foreach(function(rdg) {
                rdg.isSelected = ko.observable(false);
                rdg.IsOrder(true);
                //if (rdg.ItemService().No() == '0') {
                //    rdg.ItemService(null);
                //    rdg.ItemServiceID(null);
                //}
            });
            item.loadStatus('loaded');
        });
        item.ShowDetail(!item.ShowDetail());
    };
   
    var itemServiceAfterUpdate = function (item) {
        if (isNullOrEmpty(item.ItemServiceID()))
            return;
        if (item.ItemServiceID() == 0)
            return;
        item.ScaleID(item.ItemService().ScaleID());
        item.Scale(item.ItemService().Scale());
    };
    
    var saveRequest = function (item, callbackAfterUpdate) {
        var items = [];
        if (!item.entityAspect.entityState.isUnchanged())
            items.push(item);
        item.RequestDetailServices.foreach(function (rdg) {
            if (!rdg.entityAspect.entityState.isUnchanged())
                items.push(rdg);
        });

        context.manager.saveChanges(items)
            .then(function() {
                helper.note.successDefault();
                callbackAfterUpdate();
            });
    };

    var saveOnly = function(item) {
        saveRequest(item, function() {});
    };
    
    var goToOrder = function (item) {
        if (!item.isCompletedForPurchase())
            return;
        
        item.HasOrder(true);
        item.Status('Order');
        
        saveRequest(item, function () {
            helper.note.success('درخواست کالای مورد نظر به درخواست خرید تبدیل شد');
            
            if (!item.RequestDetailServices().any(function(rdg) {
                return !rdg.IsOrder();
            }))
                firstRequests.remove(item);
        });
    };

    var changeView = function(view) {
        if (view.loadStatus() === 'notLoad') {
            view.loadStatus('loading');
            view.loadFunc(function() {
                view.loadStatus('loaded');
            });
        }
            
        viewController.selectView(view);
    };

    var getViewCss = function (view) {
        var obj = {};
        obj[view.css] = true;
        return obj;
    };
    
    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: '',
        hasChanges: hasChanges,
        firstRequests: firstRequests,
        firstpager: firstpager,
        init: init,
        save: save,
        saveRequest: saveRequest,
        saveOnly: saveOnly,
        viewController: viewController,
        changeView: changeView,
        getViewCss: getViewCss,
        loadFirstRequests: loadFirstRequests,
        changeShowStatus: changeShowStatus,
        itemServiceAfterUpdate: itemServiceAfterUpdate,
        goToOrder: goToOrder
    };


});
   
