define(['services/logger',
  'services/common',
  'durandal/app',
  'plugins/router',
  'services/viewController',
  'modal/userSelect',
  'modal/createInput',
  'modal/createOutput',
    'modal/purchasingOfficerSelect'],
function (logger, com, app, router, viewController, userSelect, createInputDialog, createOutputDialog, purchasingOfficerSelect) {

    var activate = function () {
        newsPager(new helper.pager(context, newSteps));
        myStepPager(new helper.pager(context, mySteps));

        createView();
        
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
                cancel();
            }
            return selectedOption;
        }
    };

    var deactivate = function () {
        com.deactivate();
    };
    var viewAttached = function () {
    };

    var newSteps = ko.observableArray([]);
    var mySteps = ko.observableArray();
    
    var init = function () {
        loadNewSteps();
        loadMySteps();
    };

    var createView = function() {
        var views = [];
        views.push(viewController.createViewObject('newStep', 'درخواستهای جدید'));
        views.push(viewController.createViewObject('myStep', 'درخواستهای من'));

        viewController.rebuild(views);
        viewController.selectViewByName('myStep');
    };

    var changeView = function(view) {
        viewController.selectView(view);
    };
    
    var loadNewSteps = function() {
        var q = context.query('NewSteps');

        var navigarions = [
            "HandlerUser",
            "Step",
            "Request",
            "Request.Section",
            "Request.Section.Parent",
            "Request.ConsumerSection",
            "Request.Person"
        ];

        q = q.expand(navigarions);

        newsPager().setQuery(q);
        newsPager().changeAllData(false);
        return newsPager().load();
    };
    
    var loadMySteps = function() {
        var q = context.query('MySteps');

        var navigarions = [
            "HandlerUser",
            "Step",
            "Request",
            "Request.Section",
            "Request.Section.Parent",
            "Request.ConsumerSection",
            "Request.Person"
        ];

        q = q.expand(navigarions);

        myStepPager().setQuery(q);
        myStepPager().setCallback(function (data) {
            var results = data.results;
            results
                .select(function(item) { return item.Request(); })
                .foreach(function(item) {
                    var entityType = item.entityType.shortName.replaceAll('Request', '');

                    item.loadStatus = ko.observable('notLoad');
                    item.isCompletedForPurchase = ko.computed(function() {
                        if (entityType == 'Ticket') {
                            return item['RequestDetail' + entityType + 's'].any(function(rdg) {
                                return rdg.IsOrder();
                            });
                        }
                        return item['RequestDetail' + entityType + 's'].any(function(rdg) {
                            return !isNullOrEmpty(rdg['Item' + entityType]()) && rdg.IsOrder();
                        });
                    });
                    item.isCompletedForInput = ko.computed(function() {
                        if (entityType != 'Good')
                            return false;
                        return item.RequestDetailGoods.any(function(rdg) {
                            return rdg.IsOrder() && !isNullOrEmpty(rdg.DoneDate()) && isNullOrEmpty(rdg.InputDetailID());
                        });
                    });
                    item.isCompletedForOutput = ko.computed(function() {
                        if (entityType != 'Good')
                            return false;
                        return item.RequestDetailGoods.any(function(rdg) {
                            return !isNullOrEmpty(rdg.ItemGood()) && rdg.InventoryQty() >= rdg.Qty() && isNullOrEmpty(rdg.OutputDetailID());
                        });
                    });
                });
            mySteps(results);
            mySteps.sort(function (left, right) {
                return left.ID() == right.ID() ? 0 : (left.ID() > right.ID() ? -1 : 1);
            });

            if (callback) callback();
        });
        myStepPager().changeAllData(false);
        return myStepPager().load();
    };
    
    var save = function () {
        if (hasChanges())
            context.saveChanges();
    };
    
    var cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            //requestSteppager().loadLocally();
        }
    };

    var assignToMe = function (item) {
        save();
        var q = context.query('AssignToMeRequestStep')
            .withParameters({ step: ko.toJSON(getStepJson(item)) });
        context.executeQuery(q)
            .then(function(data) {
                var results = data.results;
                //newSteps.remove(item);
                //myStepPager().loadLocally();
            });
    };
    
    var doneStep = function (item) {
        save();
        var q = context.query('DoneRequestStep')
            .withParameters({ step: ko.toJSON(getStepJson(item)) });
        context.executeQuery(q)
            .then(function (data) {
                var results = data.results;
                mySteps.remove(item);
                item.Request().ShowDetail(false);
                myStepPager().loadLocally();
            });
    };

    var goToOrder = function (item) {
        save();
        var q = context.query('GoToOrder')
            .withParameters({ step: ko.toJSON(getStepJson(item)) });
        context.executeQuery(q)
            .then(function (data) {
                var results = data.results;
                mySteps.remove(item);
                item.Request().ShowDetail(false);
                myStepPager().loadLocally();
            });
    };
    
    var rejectStep = function (item) {
        save();
        var q = context.query('RejectStep')
            .withParameters({ step: ko.toJSON(getStepJson(item)) });
        context.executeQuery(q)
            .then(function (data) {
                var results = data.results;
                mySteps.remove(item);
                item.Request().ShowDetail(false);
                myStepPager().loadLocally();
            });
    };
    
    var assignToPurchasingOfficer = function (item) {
        save();
        purchasingOfficerSelect.show()
            .done(function(po) {
                //item.Request().PurchasingOfficer(po);
                var empId = po.EmployeeID();
                var q = context.query('AssignToPurchasingOfficer')
                    .withParameters({ step: ko.toJSON(getStepJson(item)), employeeID: empId });
                context.executeQuery(q)
                    .then(function (data) {
                        var results = data.results;
                        mySteps.remove(item);
                        rejectAll(item);
                        item.Request().ShowDetail(false);
                        myStepPager().loadLocally();
                    });
            });
    };
    
    var goToSpecificStep = function(item) {

    };
    
    var saveRequest = function (item, callbackAfterUpdate) {
        var items = [];
        item = item.Request();
        var entityType = item.entityType.shortName.replaceAll('Request','');
        
        if (!item.entityAspect.entityState.isUnchanged())
            items.push(item);

        item['RequestDetail' + entityType + 's'].foreach(function (rd) {
            if (!rd.entityAspect.entityState.isUnchanged())
                items.push(rd);
        });
        context.manager.saveChanges(items)
            .then(function () {
                helper.note.successDefault();
                callbackAfterUpdate();
            });
    };
    
    var saveOnly = function (item) {
        saveRequest(item, function () { });
    };

    var rejectAll = function(item) {
        var items = [];
        item = item.Request();
        var entityType = item.entityType.shortName.replaceAll('Request', '');

        if (!item.entityAspect.entityState.isUnchanged())
            item.entityAspect.rejectChanges();

        item['RequestDetail' + entityType + 's'].foreach(function (rd) {
            if (!rd.entityAspect.entityState.isUnchanged())
                rd.entityAspect.rejectChanges();
        });
    };
    
    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var newsPager = ko.observable();
    var myStepPager = ko.observable();

    var getStepJson = function (step) {
        var model = [step].select(function(item) {
            return {
                ID: item.ID,
                RequestID: item.RequestID,
                StepID: item.StepID,
                CreatedOnDate: item.CreatedOnDate,
                DoneOnDate: item.DoneOnDate,
                HandlerUserID: item.HandlerUserID,
                Status: item.Status
            };
        });

        return ko.toJS(model);
    };
    
    var getRequestIcon = function (type) {
        var className = 'icon-' + type.replaceAll('Request','').toLowerCase();
        var obj = {};
        obj[className] = true;
        return obj;
    };
    
    var changeShowStatus = function (parent, item) {
        //if (item.loadStatus() == 'loaded') {
        //    item.ShowDetail(!item.ShowDetail());
        //    return;
        //}

        //item.loadStatus('loading');

        loadDetail(parent, item);

        item.ShowDetail(!item.ShowDetail());
    };
    
    var loadDetail = function (parent, item, callback) {
        var entityType = item.entityType.shortName.replaceAll('Request','');
        var q = context.query('RequestDetail' + entityType + 's');
        var preds = [];
        preds.push(context.predicate('Request' + entityType + 'ID', '==', item.ID()));
        preds.push(context.predicate('IsCancel', '==', false));
        if (parent.Step().IsOrder())
            preds.push(context.predicate('IsOrder', '==', true));
        q = q.where(breeze.Predicate.and(preds));

        var navigarions = [
        ];

        if (['Good', 'Food', 'Service', 'Vehicle'].contains(entityType)) {
            navigarions.push('Item' + entityType);
        }

        if (['Food', 'Service', 'Vehicle'].contains(entityType)) {
            navigarions.push('Scale');
        }

        if (entityType === 'Good') {
            navigarions.push('InputDetail');
            navigarions.push('InputDetail.Input');
            navigarions.push('OutputDetail');
            navigarions.push('OutputDetail.Output');
            navigarions.push('ItemGood.Scale');
        }

        if (entityType === 'Ticket') {
            navigarions.push('Passenger');
        }

        q = q.expand(navigarions);

        context.executeQuery(q).then(function (data) {
            var results = data.results;

            results.foreach(function (rdg) {
                rdg.orgianlIsOrder = ko.observable(rdg.IsOrder());
                rdg.isSelected = ko.observable(false);

                if (item.Status() == 'Expert') {
                    rdg.IsOrder(true);
                }

                rdg.RequestType = ko.observable(entityType);
                if (entityType === 'Good') {
                    rdg.InventoryQty(-1);

                    if (rdg.ItemGood().No() == '0') {
                        rdg.ItemGood(null);
                        rdg.ItemGoodID(null);
                    }
                    
                    if (!isNullOrEmpty(rdg.ItemGood().ID())) {
                        getInventoryQty(rdg);
                    }
                }
            });
            item.loadStatus('loaded');
        });
    };
    
    var createInput = function (item) {
        item = item.Request();
        
        if (!item.RequestDetailGoods.any(function (rdg) {
            return rdg.IsOrder() && !isNullOrEmpty(rdg.DoneDate()) && isNullOrEmpty(rdg.InputDetailID());
        })) {
            helper.note.warning('ردیفی جهت صدور رسید وجود ندارد');
            return;
        }

        createInputDialog.show(item);
    };

    var createOutput = function (item) {
        item = item.Request();
        if (!item.RequestDetailGoods.any(function (rdg) {
            return !isNullOrEmpty(rdg.ItemGood()) && rdg.InventoryQty() >= rdg.Qty() && isNullOrEmpty(rdg.OutputDetailID());
        })) {
            helper.note.warning('ردیفی جهت صدور حواله وجود ندارد');
            return;
        }

        createOutputDialog.show(item);
    };
    
    var changeAccept = function (item) {
        item.IsCancel(!item.IsCancel());
    };
    
    var getInventoryQty = function (item) {
        if (isNullOrEmpty(item.ItemGood().ID())) {
            helper.note.warning('ابتدا کالای قطعی را انتخاب کنید');
            return;
        }

        item.InventoryQty(-2);

        var q = context.query('GetInventrory');
        q = q.withParameters({ itemGoodId: item.ItemGood().ID() });

        context.executeQuery(q)
            .then(function (data) {
                item.InventoryQty(data.results[0]);
            });
    };
    
    var callbackAfterItemUpdate = function (item) {
        var entityType = item.entityType.shortName.replaceAll('RequestDetail', '');
        
        if (entityType == 'Good') {
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
    
    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'تعریف مراحل',
        hasChanges: hasChanges,
        newSteps: newSteps,
        mySteps: mySteps,
        newsPager: newsPager,
        myStepPager: myStepPager,
        init: init,
        save: save,
        saveOnly: saveOnly,
        cancel: cancel,
        viewController: viewController,
        changeView: changeView,
        assignToMe: assignToMe,
        doneStep: doneStep,
        goToOrder: goToOrder,
        rejectStep: rejectStep,
        assignToPurchasingOfficer: assignToPurchasingOfficer,
        getRequestIcon: getRequestIcon,
        changeShowStatus: changeShowStatus,
        getInventoryQty: getInventoryQty,
        changeAccept: changeAccept,
        callbackAfterItemUpdate: callbackAfterItemUpdate,
        createInput: createInput,
        createOutput: createOutput
    };


});
   
