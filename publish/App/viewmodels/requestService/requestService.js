
define(['services/logger',
        'services/common',
        'durandal/app',
        'plugins/router',
        'viewmodels/tools/unitPriceCalc',
        'viewmodels/tools/assignGroup',
        'viewmodels/effectiveCost',
        'viewmodels/smallCost',
        'viewmodels/letter',
        'services/viewController'],
function (logger, com, app, router, calc, assignGroup, effectiveCost, smallCost, letter, viewController) {

    var activate = function () {
        viewController.chooseViews(['list', 'detail']);
        requestServicepager(new helper.pager(context, requestServices));
        letter.setMasterInfo('Service');
        assignGroup.setMasterInfo(requestServices, 'Service');
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
    var attached = function () {
        
    };

    var requestServices = ko.observableArray([]);
    var selectedRequestService = ko.observable();
    var selectedRequestServiceDetail = ko.observable();
    var canShowDoneDateColumn = ko.observable(false);
    var canShowCompleteData = ko.observable(false);
    var canShowAssignGroup = ko.observable(false);

    var init = function () {
        var q = context.query('RequestServices');
        q = q.where('PeriodID', '==', helper.defaults.currentPeriod().ID);
        
        var navigarions = [
           "Person",
           "Section",
           "CreatedByUser",
           "PurchasingOfficer",
           "LetterRequestServices",
           "EffectiveCostServices",
           "RequestDetailServices",
           "RequestDetailServices.ItemService",
           "RequestDetailServices.Scale",
           "RequestDetailServices.Seller",
           "RequestDetailServices.SmallCostServiceDetails",
           "RequestDetailServices.EffectiveCostServiceDetails",
           "RequestDetailServices.EffectiveCostServiceDetails.CostType"
        ];

        q = q.expand(navigarions);

        requestServicepager().setQuery(q);
        requestServicepager().changeAllData(false);
        return requestServicepager().load();
    };

    var selectRequestServiceDetail = function (item) {
        selectedRequestServiceDetail(item);
    };

    var add = function () {
        requestServices.addEntity(context, 'RequestService',
            {
                No: 0,
                SectionID: null,
                PersonID: null,
                PurchasingOfficer: null,
                PurchasingOfficerID: null,
                UserDefinedCategory: null,
                UserDefinedCategoryID: null,
                Date: new Date(),
                OrderDate: null,
                ShowDetail: true,
                PurchaseMethod: 'Small',
                Status: 'Temporary'
            });
    };

    var addDetail = function (item) {
        var newEntity = context.addEntity('RequestDetailService',
            {
                DoneDate: null,
                ItemService: null,
                ItemServiceID: null,
                Seller: null,
                SellerID: null,
                RequestService: item,
                RequestServiceID: item.ID(),
                PurchaseSize: 0
            });

        var sq = 0;
        item.RequestDetailServices.foreach(function (rds) {
            sq += 1;
            rds.Row(sq);
        });
    };

    var remove = function () {
        var item = selectedRequestService();
        requestServices.removeEntity(item);
        selectedRequestService(null);
    };

    var removeDetail = function () {
        var item = selectedRequestServiceDetail();
        item.RequestService(null);

        if (item.entityAspect.entityState == 'Added')
            item.entityAspect.rejectChanges();

        item.entityAspect.setDeleted();

        selectedRequestServiceDetail(null);
    };

    var save = function () {
        if (hasChanges())
            context.saveChanges();
    };
    var cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            requestServicepager().loadLocally();
        }
    };

    var selectRequestService = function (item) {
        selectedRequestService(item);
    };
    
    var changeStatus = function(item) {
        var value = item.Status();

        if (value == 'Cancel') {
            helper.note.warning('درخواست جاری باطل شده است ، امکان تغییر وجود ندارد');
        }

        if (value == 'Temporary') {
            item.Status('Confirm');
            context.manager.saveChanges([item])
                .then(function() {
                    helper.note.success('تغییر وضعیت انجام شد');
                });

        }

        if (value == 'Confirm') {
            item.Status('Temporary');
            context.manager.saveChanges([item]).then(function() {
                helper.note.success('تغییر وضعیت انجام شد');
            });
        }
    };
    var changeShowDetail = function (item) {
        item.ShowDetail(!item.ShowDetail());
    };
    
    var callbackAfterItemServiceUpdate = function (item) {
        if (item.entityAspect.entityState != 'Added')
            return 0;
        item.Scale(item.ItemService().Scale());
        item.ScaleID(item.ItemService().ScaleID());
        if(item.UnitPrice() == undefined)
            item.UnitPrice(item.ItemService().Price());
    };

    var openEffectiveCostMaster = function (item) {
        effectiveCost.setMasterInfo('master', 'Service');
        effectiveCost.currentMaster(item);
        effectiveCost.openEffectiveCost();
    };

    var openEffectiveCostDetail = function (item) {
        effectiveCost.setMasterInfo('detail', 'Service');
        effectiveCost.currentMaster(item);
        effectiveCost.openEffectiveCost();
    };

    var openSmallCostDetail = function (item) {
        smallCost.setMasterInfo('detail', 'Service');
        smallCost.currentMaster(item);
        smallCost.openSmallCost();
    };
    
    var openLetter = function (item) {
        effectiveCost.setMasterInfo('Service');
        effectiveCost.currentMaster(item);
        effectiveCost.openLetter();
    };

    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var requestServicepager = ko.observable();

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        attached: attached,
        title: 'درخواست خدمات',
        hasChanges: hasChanges,
        calc: calc,
        assignGroup:assignGroup,
        requestServices: requestServices,
        selectedRequestService: selectedRequestService,
        selectedRequestServiceDetail: selectedRequestServiceDetail,
        requestServicepager: requestServicepager,
        canShowDoneDateColumn: canShowDoneDateColumn,
        canShowCompleteData: canShowCompleteData,
        canShowAssignGroup: canShowAssignGroup,
        init: init,
        selectRequestService: selectRequestService,
        selectRequestServiceDetail: selectRequestServiceDetail,
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
        changeStatus: changeStatus,
        callbackAfterItemServiceUpdate: callbackAfterItemServiceUpdate
    };


});
