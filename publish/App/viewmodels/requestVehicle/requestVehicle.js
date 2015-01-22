
define(['services/logger',
        'durandal/app',
        'plugins/router',
        'viewmodels/tools/unitPriceCalc',
        'viewmodels/tools/assignGroup',
        'viewmodels/effectiveCost',
        'viewmodels/smallCost',
        'viewmodels/letter',
        'services/viewController',
        'services/common'],
function (logger, app, router, calc, assignGroup, effectiveCost, smallCost, letter, viewController,com) {

    var activate = function () {
        viewController.chooseViews(['list', 'detail']);
        requestVehiclepager(new helper.pager(context, requestVehicles));
        letter.setMasterInfo('Vehicle');
        assignGroup.setMasterInfo(requestVehicles, 'Vehicle');
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

    var requestVehicles = ko.observableArray([]);
    var selectedRequestVehicle = ko.observable();
    var selectedRequestVehicleDetail = ko.observable();
    var canShowDoneDateColumn = ko.observable(false);
    var canShowCompleteData = ko.observable(false);
    var canShowAssignGroup = ko.observable(false);

    var init = function () {
        var q = context.query('RequestVehicles');
        q = q.where('PeriodID', '==', helper.defaults.currentPeriod().ID);
        
        var navigarions = [
           "Person",
           "Section",
           "CreatedByUser",
           "PurchasingOfficer",
           "LetterRequestVehicles",
           "EffectiveCostVehicles",
           "RequestDetailVehicles",
           "RequestDetailVehicles.Vehicle",
           "RequestDetailVehicles.Driver",
           "RequestDetailVehicles.ItemVehicle",
           //"RequestDetailVehicles.Scale",
           "RequestDetailVehicles.Seller",
           "RequestDetailVehicles.SmallCostVehicleDetails",
           "RequestDetailVehicles.EffectiveCostVehicleDetails",
           "RequestDetailVehicles.EffectiveCostVehicleDetails.CostType"
        ];

        q = q.expand(navigarions);

        requestVehiclepager().setQuery(q);
        requestVehiclepager().changeAllData(false);
        return requestVehiclepager().load();
    };

    var selectRequestVehicle = function (item) {
        selectedRequestVehicle(item);
    };
    
    var selectRequestVehicleDetail = function (item) {
        selectedRequestVehicleDetail(item);
    };

    var add = function () {
        requestVehicles.addEntity(context, 'RequestVehicle',
            {
                No: 0,
                SectionID: null,
                PersonID: null,
                PurchasingOfficer: null,
                PurchasingOfficerID: null,
                Date: new Date(),
                OrderDate: null,
                ShowDetail: true,
                PurchaseMethod: 'Small',
                Status: 'Temporary'
            });
    };

    var addDetail = function (item) {
        var newEntity = context.addEntity('RequestDetailVehicle',
            {
                DoneDate: null,
                ItemVehicle: null,
                ItemVehicleID: null,
                Seller: null,
                SellerID: null,
                RequestVehicle: item,
                RequestVehicleID: item.ID(),
                PurchaseSize: 0,
                Qty: 1
            });

        var sq = 0;
        item.RequestDetailVehicles.foreach(function (rds) {
            sq += 1;
            rds.Row(sq);
        });
    };

    var remove = function () {
        var item = selectedRequestVehicle();
        requestVehicles.removeEntity(item);
        selectedRequestVehicle(null);
    };

    var removeDetail = function () {
        var item = selectedRequestVehicleDetail();
        item.RequestVehicle(null);

        if (item.entityAspect.entityState == 'Added')
            item.entityAspect.rejectChanges();

        item.entityAspect.setDeleted();

        selectedRequestVehicleDetail(null);
    };

    var save = function () {
        if (hasChanges())
            context.saveChanges();
    };
    var cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            requestVehiclepager().loadLocally();
        }
    };

    var changeShowDetail = function (item) {
        item.ShowDetail(!item.ShowDetail());
    };
    
    var callbackAfterItemVehicleUpdate = function (item) {
        if (item.entityAspect.entityState != 'Added')
            return 0;
        item.Scale(item.ItemVehicle().Scale());
        item.ScaleID(item.ItemVehicle().ScaleID());
        if(item.UnitPrice() == undefined)
            item.UnitPrice(item.ItemVehicle().Price());
    };

    var callbackAfterVehicleUpdate = function (item) {
        if (item.entityAspect.entityState != 'Added')
            return 0;
        item.Driver(item.Vehicle().Driver());
        item.DriverID(item.Vehicle().DriverID());
    };
    
    var openEffectiveCostMaster = function (item) {
        effectiveCost.setMasterInfo('master', 'Vehicle');
        effectiveCost.currentMaster(item);
        effectiveCost.openEffectiveCost();
    };

    var openEffectiveCostDetail = function (item) {
        effectiveCost.setMasterInfo('detail', 'Vehicle');
        effectiveCost.currentMaster(item);
        effectiveCost.openEffectiveCost();
    };

    var openSmallCostDetail = function (item) {
        smallCost.setMasterInfo('detail', 'Vehicle');
        smallCost.currentMaster(item);
        smallCost.openSmallCost();
    };
    
    var openLetter = function (item) {
        effectiveCost.setMasterInfo('Vehicle');
        effectiveCost.currentMaster(item);
        effectiveCost.openLetter();
    };
    
    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var requestVehiclepager = ko.observable();

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'درخواست نقلیه',
        hasChanges: hasChanges,
        calc: calc,
        assignGroup: assignGroup,
        requestVehicles: requestVehicles,
        selectedRequestVehicle: selectedRequestVehicle,
        selectedRequestVehicleDetail: selectedRequestVehicleDetail,
        requestVehiclepager: requestVehiclepager,
        canShowDoneDateColumn: canShowDoneDateColumn,
        canShowCompleteData: canShowCompleteData,
        canShowAssignGroup: canShowAssignGroup,
        init: init,
        selectRequestVehicle: selectRequestVehicle,
        selectRequestVehicleDetail: selectRequestVehicleDetail,
        add: add,
        addDetail: addDetail,
        remove: remove,
        removeDetail: removeDetail,
        save: save,
        cancel: cancel,
        effectiveCost: effectiveCost,
        smallCost: smallCost,
        letter: letter,
        viewController: viewController,
        openEffectiveCostMaster: openEffectiveCostMaster,
        openEffectiveCostDetail: openEffectiveCostDetail,
        openSmallCostDetail: openSmallCostDetail,
        openLetter: openLetter,
        changeShowDetail: changeShowDetail,
        callbackAfterItemVehicleUpdate: callbackAfterItemVehicleUpdate,
        callbackAfterVehicleUpdate: callbackAfterVehicleUpdate
    };


});
