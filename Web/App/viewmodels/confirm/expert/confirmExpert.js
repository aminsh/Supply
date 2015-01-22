      
define(['services/logger',
  'services/common',
  'durandal/app',
  'plugins/router',
  'services/viewController',
  'modal/createInput',
  'modal/createOutput'
    ],//createInputDialog
function (logger, com, app, router, viewController, createInputDialog, createOutputDialog) {

    var activate = function (id) {
        pager(new helper.pager(context, requests));

        requestType = id;
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

    var requestType = '';
    var requests = ko.observableArray();
    
    var init = function () {
        var navigarions = [
           'Section',
           'Section.Parent',
           'ConsumerSection',
           'Person'
        ];

        var queries = [];
        var params = search.getParamter();
        
        if (isNullOrEmpty(requestType)) {
            queries.push(context.query('RequestGoodsAdv')
                .orderByDesc('ID')
                .expand(navigarions)
                .withParameters({ filter: ko.toJSON(params) })
            );
            queries.push(context.query('RequestServicesAdv')
                .orderByDesc('ID')
                .expand(navigarions)
                .withParameters({ filter: ko.toJSON(params) })
            );
            queries.push(context.query('RequestFoodsAdv')
                .orderByDesc('ID')
                .expand(navigarions)
                .withParameters({ filter: ko.toJSON(params) })
            );
            queries.push(context.query('RequestTicketsAdv')
                .orderByDesc('ID')
                .expand(navigarions)
                .withParameters({ filter: ko.toJSON(params) })
            );
            queries.push(context.query('RequestVehiclesAdv')
                .orderByDesc('ID')
                .expand(navigarions)
                .withParameters({ filter: ko.toJSON(params) })
            );
        } else {
            queries.push(context.query('Request' + requestType + 'sAdv')
                .orderByDesc('ID')
                .expand(navigarions)
                .withParameters({ filter: ko.toJSON(params) })
            );
        }

        pager().setQueries(queries);
        pager().setCallbackBeforeLoad(function () {
            requests.removeAll();
        });

        pager().setCallback(function (data) {
            var results = data.results;
            results.foreach(function (item) {
                item.RequestType = ko.observable(item.entityType.shortName.replaceAll('Request', ''));

                item.loadStatus = ko.observable('notLoad');
                item.isCompletedForPurchase = ko.computed(function () {
                    if (item.RequestType() == 'Ticket') {
                        return item['RequestDetail' + item.RequestType() + 's'].any(function (rdg) {
                            return rdg.IsOrder();
                                
                        });
                    }
                    return item['RequestDetail' + item.RequestType() + 's'].any(function (rdg) {
                        return !isNullOrEmpty(rdg['Item' + item.RequestType()]()) && rdg.IsOrder();
                       
                            
                    });
                });
                item.isCompletedForInput = ko.computed(function() {
                    if (item.RequestType() != 'Good')
                        return false;
                    return item.RequestDetailGoods.any(function (rdg) {
                        return rdg.IsOrder() && !isNullOrEmpty(rdg.DoneDate()) && isNullOrEmpty(rdg.InputDetailID());
                    });
                });
                item.isCompletedForOutput = ko.computed(function () {
                    if (item.RequestType() != 'Good')
                        return false;
                    return item.RequestDetailGoods.any(function (rdg) {
                        return !isNullOrEmpty(rdg.ItemGood()) && rdg.InventoryQty() >= rdg.Qty() && isNullOrEmpty(rdg.OutputDetailID());
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

    var loadDetail = function(item,callback) {
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

        if (['Food', 'Service', 'Vehicle'].contains(item.RequestType())) {
            navigarions.push('Scale');
        }
        
        if (item.RequestType() === 'Good') {
            navigarions.push('InputDetail');
            navigarions.push('InputDetail.Input');
            navigarions.push('OutputDetail');
            navigarions.push('OutputDetail.Output');
            navigarions.push('ItemGood.Scale');
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
                
                if (item.Status() == 'Expert') {
                    rdg.IsOrder(true);
                }

                rdg.RequestType = ko.observable(item.RequestType());
                if (item.RequestType() === 'Good') {
                    rdg.InventoryQty(-1);
                    
                    if (item.Status() != 'Expert') {
                        getInventoryQty(rdg);
                    }
                    
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
    
    var callbackAfterItemUpdate = function (item) {
        if (item.RequestType() == 'Good') {
            if (isNullOrEmpty(item.ItemGoodID()))
                return;

            if (item.ItemGoodID() == 0)
                return;

            if (item.InventoryQty() <= 0)
                getInventoryQty(item);
        } else {
            if (isNullOrEmpty(item.ScaleID())) {
                item.Scale(item['Item' + item.RequestType()]().Scale());
                item.ScaleID(item['Item' + item.RequestType()]().Scale().ID());
            }
        }
    };
    
    var saveRequest = function (item, callbackAfterUpdate) {
        var items = [];
        if (!item.entityAspect.entityState.isUnchanged())
            items.push(item);

        item['RequestDetail' + item.RequestType() + 's'].foreach(function(rd) {
            if (!rd.entityAspect.entityState.isUnchanged())
                items.push(rd);
        });
        //item.RequestDetailGoods.foreach(function (rdg) {
        //    if (!rdg.entityAspect.entityState.isUnchanged())
        //        items.push(rdg);
        //});

        context.manager.saveChanges(items)
            .then(function() {
                helper.note.successDefault();
                callbackAfterUpdate();
            });
    };
    
    var goToOrder = function (item) {
        if (!item.isCompletedForPurchase())
            return;
        
        item.HasOrder(true);
        item.Status('Order');
        
        saveRequest(item, function () {
            helper.note.success('درخواست کالای مورد نظر به درخواست خرید تبدیل شد');
        });
    };

    var createInput = function (item) {
        if (!item.RequestDetailGoods.any(function(rdg) {
            return rdg.IsOrder() && !isNullOrEmpty(rdg.DoneDate()) && isNullOrEmpty(rdg.InputDetailID());
        })) {
            helper.note.warning('ردیفی جهت صدور رسید وجود ندارد');
            return;
        }
            
        createInputDialog.show(item);
    };
    
    var createOutput = function (item) {
        if (!item.RequestDetailGoods.any(function (rdg) {
            return !isNullOrEmpty(rdg.ItemGood()) && rdg.InventoryQty() >= rdg.Qty() && isNullOrEmpty(rdg.OutputDetailID());
        })) {
            helper.note.warning('ردیفی جهت صدور حواله وجود ندارد');
            return;
        }

        createOutputDialog.show(item);
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
    
    var search = {
        periodIncluded: ko.observable(false),
        id: ko.observable(null),
        no: ko.observable(null),
        noHandy: ko.observable(null),
        letterNo: ko.observable(null),
        letterDate: ko.observable(null),
        section: ko.observable(null)
    };
    
    search.getParamter = function () {
        var params = [];
        if (!isNullOrEmpty(search.id())) {
            params.push({ FieldName: 'ID', Value: search.id() });
        }
        if (!search.periodIncluded()) {
            params.push({ FieldName: 'PeriodID', Value: helper.defaults.currentPeriod().ID });
        }
        if (!isNullOrEmpty(search.no())) {
            params.push({ FieldName: 'No', Value: search.no() });
        }
        if (!isNullOrEmpty(search.noHandy())) {
            params.push({ FieldName: 'NoHandy', Value: search.noHandy() });
        }
        if (!isNullOrEmpty(search.letterNo())) {
            params.push({ FieldName: 'letterNo', Value: search.letterNo() });
        }
        if (!isNullOrEmpty(search.letterDate())) {
            params.push({ FieldName: 'letterDate', Value: search.letterDate() });
        }
        if (!isNullOrEmpty(search.section())) {
            params.push({ FieldName: 'sectionid', Value: search.section().ID() });
        }
        return params;
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
        callbackAfterItemUpdate: callbackAfterItemUpdate,
        goToOrder: goToOrder,
        createInput: createInput,
        createOutput: createOutput,
        collapse: collapse,
        search: search
    };


});
   
