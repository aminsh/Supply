define(['services/logger',
        'services/common',
        'durandal/app',
        'plugins/router',
        'viewmodels/tools/unitPriceCalc',
        'viewmodels/tools/assignGroup',
        'viewmodels/effectiveCost',
        'viewmodels/smallCost',
        'viewmodels/letter',
        'services/viewController',
        'modal/confirmCancel',
        'modal/effectiveCost'],
function (logger, com, app, router, calc, assignGroup, effectiveCost, smallCost, letter, viewController, confirmCancel,ec) {
    var activate = function(param) {
        var views = [];
        views.push(viewController.createViewObject('list', 'لیست'));
        views.push(viewController.createViewObject('singleEdit', 'تک ردیف قابل ویرایش'));
        views.push(viewController.createViewObject('singleRead', 'تک ردیفف فقط قابل مشاهده'));
        viewController.rebuild(views);
        viewController.selectViewByName('list');

        var currentRoute = router.routes.first(function(r) {
            return r.hash.replaceAll('#', '') == window.location.hash.replaceAll('#/', '');
        });

        if (!isNullOrEmpty(currentRoute))
            title(currentRoute.title);
        
        pager(new helper.pager(context, requests));
        letter.setMasterInfo('Good');
        return init();
    };

    var deactivate = function () {
        com.deactivate();
        
    };

    var canDeactivate = function () {
        return true;
    };

    var attached = function() {

    };

    var init = function() {
        var q = context.query('RequestGoodsOrder').toType('RequestGood');
        q = q.orderByDesc('OrderNo');

        var preds = [];
        //preds.push(context.predicate('HasOrder', '==', true));
        //preds.push(context.predicate('Status', '==', 'Order'));
        //preds.push(context.predicate('Status', '!=', 'Cancel'));
        
        q = q.where(breeze.Predicate.and(preds));
        q = q.withParameters({ filter: ko.toJSON(search.getParamter()) });
        //q = q.where('PeriodID', '==', helper.defaults.currentPeriod().ID);

        var navigarions = [
           "Person",
           "Section",
           "ConsumerSection",
           "CreatedByUser",
           "PurchasingOfficer",
           "StockDeliveryLocation",
           "LetterRequestGoods",
           "EffectiveCostGoods",
           "RequestDetailGoods",
           "RequestDetailGoods.ItemGood",
           "RequestDetailGoods.Seller",
           "RequestDetailGoods.InputDetail",
           "RequestDetailGoods.InputDetail.Input",
           "RequestDetailGoods.EffectiveCostGoodDetails",
           "RequestDetailGoods.EffectiveCostGoodDetails.CostType",
           "RequestDetailGoods.InputDetail",
           "RequestDetailGoods.InputDetail.Input"
        ];

        q = q.expand(navigarions);

        pager().setQuery(q);
        pager().changeAllData(false);
        return pager().load();
    };

    var title = ko.observable('');
    var requests = ko.observableArray();
    var current = ko.observable();
    var currentDetail = ko.observable();

    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var pager = ko.observable();
    
    var canShowMaster = ko.observable(false);
    var canShowDetail = ko.observable(false);
    var canShowFinance = ko.observable(false);
    

    var canShowCurrentDetailFull = ko.observable(true);
    var canShowCurrentDetailRead = ko.observable(false);

    var changeShowMaster = function() {
        canShowMaster(!canShowMaster());
    };

    var changeShowDetail = function() {
        canShowDetail(!canShowDetail());
    };

    var changeShowFinance = function() {
        canShowFinance(!canShowFinance());
    };

    //var changeShowCurrentDetailFull = function() {
    //    canShowCurrentDetailFull(!canShowCurrentDetailFull());
    //};

    var changeShowCurrentDetailRead = function() {
        canShowCurrentDetailRead(!canShowCurrentDetailRead());
    };
    
    var select = function(item) {
        current(item);
        canShowMaster(true);
        viewController.selectViewByName('singleRead');
    };

    var selectDetail = function(item) {
        currentDetail(item);
    };
    
    var edit = function() {
        viewController.selectViewByName('singleEdit');
    };

    var returnToRead = function() {
        leaveEdit(function () {
            viewController.selectViewByName('singleRead');
        });
    };
    
    var returnToList = function() {
        leaveEdit(function() {
            viewController.selectViewByName('list');
        });
    };
    
    var leaveEdit = function(gotoCallback) {
        if (hasChanges()) {
            var title = 'آیا مایل به ادامه عملیات هستید ؟';
            var msg = 'لغو تغییرات';

            app.showMessage(title, msg, ['Yes', 'No'])
                .then(function(answer) {
                    if (answer == 'Yes') {
                        context.cancelChanges();
                        gotoCallback();
                    }
                });
        } else {
            gotoCallback();
        }     
    };

    var add = function() {
        var newEntity = context.addEntity('RequestGood',
            {
                No: 0,
                SectionID: null,
                PersonID: null,
                PurchasingOfficer: null,
                PurchasingOfficerID: null,
                StockDeliveryLocation: null,
                StockDeliveryLocationID: null,
                UserDefinedCategory: null,
                UserDefinedCategoryID: null,
                Date: new Date(),
                OrderDate: null,
                ShowDetail: true,
                PurchaseMethod: 'Small',
                Status: 'Order',
                HasOrder: true
            });
        current(newEntity);
        changeShowMaster();
        viewController.selectViewByName('singleEdit');
    };
    
    var addDetail = function (item) {
        var newEntity = context.addEntity('RequestDetailGood',
            {
                DoneDate: null,
                ItemGood: null,
                ItemGoodID: null,
                Seller: null,
                SellerID: null,
                RequestGood: item,
                RequestGoodID: item.ID(),
                PurchaseSize: 0,
                ItemDescription: '---'
            });

        var sq = 0;
        item.RequestDetailGoods.foreach(function (rds) {
            sq += 1;
            rds.Row(sq);
        });
    };

    var remove = function () {
        var title = 'آیا مایل به ادامه عملیات هستید ؟';
        var msg = 'حذف درخواست جاری';
        app.showMessage(title, msg, ['Yes', 'No'])
            .then(function(answer) {
                if (answer == 'Yes') {
                    var entity = current();
                    if (entity.entityAspect.entityState == "Added") {
                        entity.entityAspect.rejectChanges();
                    } else {
                        entity.Status('Cancel');
                        
                        save().then(function() {
                            requests.remove(entity);
                        }); 
                    }
                    viewController.selectViewByName('list');
                }
            });

    };

    var removeDetail = function (item) {
        if (item.IsCancel())
            return;
        
        if (!item.entityAspect.entityState.isAdded()) {
            confirmCancel.show(item);
            return;
        }
        //item.RequestGood(null);

        //if (item.entityAspect.entityState == 'Added')
        //    item.entityAspect.rejectChanges();

        item.entityAspect.setDeleted();
        currentDetail(null);
    };
    
    var save = function () {
        if (hasChanges()) {
            var entityState = current().entityAspect.entityState;
            var callbackIfSuccessful = {
                success: function (result) {
                    if (entityState == "Added")
                        requests.unshift(current());
                }
            };
            return context.saveChanges(callbackIfSuccessful);
        }
    };
    
    var cancel = function () {
        if (hasChanges()) {
            var title = 'آیا مایل به ادامه عملیات هستید ؟';
            var msg = 'لغو تغییرات';
            app.showMessage(title, msg, ['Yes', 'No'])
            .then(function (answer) {
                if (answer == 'Yes') {
                    var entityState = current().entityAspect.entityState;
                    context.cancelChanges();
                    if (entityState == "Added") {
                        viewController.selectViewByName('list');
                    } 
                }
            });
        }
    };
    
    var callbackAfterItemGoodUpdate = function (item) {
        if (item.entityAspect.entityState != 'Added')
            return 0;
        item.Scale(item.ItemGood().Scale());
        item.ScaleID(item.ItemGood().ScaleID());
        if (item.UnitPrice() == undefined)
            item.UnitPrice(item.ItemGood().Price());
    };
    
    var openEffectiveCostMaster = function () {
        var item = currentDetail();
        effectiveCost.setMasterInfo('master', 'Good');
        effectiveCost.currentMaster(item);
        effectiveCost.openEffectiveCost();
    };

    var openEffectiveCostDetail = function (item) {
        //var item = currentDetail();
        //effectiveCost.setMasterInfo('detail', 'Good');
        //effectiveCost.currentMaster(item);
        //effectiveCost.openEffectiveCost();
        ec.show(item);
    };

    var openSmallCostDetail = function () {
        var item = currentDetail();
        smallCost.setMasterInfo('detail', 'Good');
        smallCost.currentMaster(item);
        smallCost.openSmallCost();
    };

    var openLetter = function () {
        var item = currentDetail();
        effectiveCost.setMasterInfo('Good');
        effectiveCost.currentMaster(item);
        effectiveCost.openLetter();
    };

    var search = {
        periodIncluded: ko.observable(false),
        no: ko.observable(null),
        noHandy: ko.observable(null),
        letterNo: ko.observable(null),
        letterDate: ko.observable(null)
    };

    search.getParamter = function () {
        var params = [];
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
        return params;
    };
    return {
        title: title,
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        attached: attached,
        init: init,
        viewController: viewController,
        requests: requests,
        current: current,
        currentDetail: currentDetail,
        context: context,
        hasChanges: hasChanges,
        pager: pager,
        canShowMaster: canShowMaster,
        canShowDetail: canShowDetail,
        canShowFinance: canShowFinance,
        canShowCurrentDetailFull: canShowCurrentDetailFull,
        canShowCurrentDetailRead: canShowCurrentDetailRead,
        changeShowMaster: changeShowMaster,
        changeShowDetail: changeShowDetail,
        changeShowFinance: changeShowFinance,
        //changeShowCurrentDetailFull: changeShowCurrentDetailFull,
        changeShowCurrentDetailRead: changeShowCurrentDetailRead,
        select: select,
        selectDetail: selectDetail,
        edit: edit,
        returnToList: returnToList,
        returnToRead: returnToRead,
        leaveEdit: leaveEdit,
        add: add,
        addDetail: addDetail,
        remove: remove,
        removeDetail: removeDetail,
        save: save,
        cancel: cancel,
        callbackAfterItemGoodUpdate: callbackAfterItemGoodUpdate,
        effectiveCost: effectiveCost,
        smallCost: smallCost,
        letter: letter,
        openEffectiveCostMaster: openEffectiveCostMaster,
        openEffectiveCostDetail: openEffectiveCostDetail,
        openSmallCostDetail: openSmallCostDetail,
        openLetter: openLetter,
        search: search
    };
});