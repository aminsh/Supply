
define(['services/logger',
        'services/common',
        'durandal/app',
        'plugins/router',
        'viewmodels/tools/unitPriceCalc',
        'viewmodels/tools/assignGroup',
        'viewmodels/effectiveCost',
        'viewmodels/letter',
        'services/viewController'],
function (logger, com,app, router, calc, assignGroup, effectiveCost, letter, viewController) {

    var activate = function () {
        viewController.chooseViews(['list', 'detail']);
        requestGoodpager(new helper.pager(context, requestGoods));
        letter.setMasterInfo('Good');
        assignGroup.setMasterInfo(requestGoods, 'Good');
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

    var requestGoods = ko.observableArray([]);
    var selectedRequestGood = ko.observable();
    var selectedRequestGoodDetail = ko.observable();
    var canShowDoneDateColumn = ko.observable(false);
    var canShowCompleteData = ko.observable(false);
    var canShowAssignGroup = ko.observable(false);

    var init = function () {
        var q = context.query('RequestGoods');
        q = q.where('PeriodID', '==', helper.defaults.currentPeriod().ID);

        var navigarions = [
           "Person",
           "Section",
           "CreatedByUser",
           "PurchasingOfficer",
           "LetterRequestGoods",
           "EffectiveCostGoods",
           "RequestDetailGoods",
           "RequestDetailGoods.ItemGood",
           "RequestDetailGoods.Scale",
           "RequestDetailGoods.Seller",
           "RequestDetailGoods.EffectiveCostGoodDetails",
           "RequestDetailGoods.EffectiveCostGoodDetails.CostType"
        ];

        q = q.expand(navigarions);

        requestGoodpager().setQuery(q);
        requestGoodpager().changeAllData(false);
        return requestGoodpager().load();
    };

    var selectRequestGood = function (item) {
        selectedRequestGood(item);
    };
    
    var selectRequestGoodDetail = function (item) {
        selectedRequestGoodDetail(item);
    };

    var add = function () {
        requestGoods.addEntity(context, 'RequestGood',
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
        var newEntity = context.addEntity('RequestDetailGood',
            {
                DoneDate: null,
                ItemGood: null,
                ItemGoodID: null,
                Seller: null,
                SellerID: null,
                RequestGood: item,
                RequestGoodID: item.ID(),
                PurchaseSize: 0
            });

        var sq = 0;
        item.RequestDetailGoods.foreach(function (rds) {
            sq += 1;
            rds.Row(sq);
        });
    };

    var remove = function () {
        var item = selectedRequestGood();
        requestGoods.removeEntity(item);
        selectedRequestGood(null);
    };

    var removeDetail = function () {
        var item = selectedRequestGoodDetail();
        item.RequestGood(null);

        if (item.entityAspect.entityState == 'Added')
            item.entityAspect.rejectChanges();

        item.entityAspect.setDeleted();

        selectedRequestGoodDetail(null);
    };

    var save = function () {
        if (hasChanges())
            context.saveChanges();
    };
    var cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            requestGoodpager().loadLocally();
        }
    };

    var changeStatus = function (item) {
        var value = item.Status();

        if (value == 'Cancel') {
            helper.note.warning('درخواست جاری باطل شده است ، امکان تغییر وجود ندارد');
        }

        if (value == 'Temporary') {
            item.Status('Confirm');
            context.manager.saveChanges([item])
                .then(function () {
                    helper.note.success('تغییر وضعیت انجام شد');
                });

        }

        if (value == 'Confirm') {
            item.Status('Temporary');
            context.manager.saveChanges([item]).then(function () {
                helper.note.success('تغییر وضعیت انجام شد');
            });
        }
    };
    var changeShowDetail = function (item) {
        item.ShowDetail(!item.ShowDetail());
    };

    var callbackAfterItemGoodUpdate = function (item) {
        if (item.entityAspect.entityState != 'Added')
            return 0;
        item.Scale(item.ItemGood().Scale());
        item.ScaleID(item.ItemGood().ScaleID());
        if (item.UnitPrice() == undefined)
            item.UnitPrice(item.ItemGood().Price());
    };

    var openEffectiveCostMaster = function (item) {
        effectiveCost.setMasterInfo('master', 'Good');
        effectiveCost.currentMaster(item);
        effectiveCost.openEffectiveCost();
    };

    var openEffectiveCostDetail = function (item) {
        effectiveCost.setMasterInfo('detail', 'Good');
        effectiveCost.currentMaster(item);
        effectiveCost.openEffectiveCost();
    };

    var openSmallCostDetail = function (item) {
        smallCost.setMasterInfo('detail', 'Good');
        smallCost.currentMaster(item);
        smallCost.openSmallCost();
    };

    var openLetter = function (item) {
        effectiveCost.setMasterInfo('Good');
        effectiveCost.currentMaster(item);
        effectiveCost.openLetter();
    };

    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var requestGoodpager = ko.observable();

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'درخواست کالا',
        hasChanges: hasChanges,
        calc: calc,
        assignGroup: assignGroup,
        requestGoods: requestGoods,
        selectedRequestGood: selectedRequestGood,
        selectedRequestGoodDetail: selectedRequestGoodDetail,
        requestGoodpager: requestGoodpager,
        canShowDoneDateColumn: canShowDoneDateColumn,
        canShowCompleteData: canShowCompleteData,
        canShowAssignGroup: canShowAssignGroup,
        init: init,
        selectRequestGood: selectRequestGood,
        selectRequestGoodDetail: selectRequestGoodDetail,
        add: add,
        addDetail: addDetail,
        remove: remove,
        removeDetail: removeDetail,
        save: save,
        cancel: cancel,
        effectiveCost: effectiveCost,
        letter: letter,
        viewController: viewController,
        openEffectiveCostMaster: openEffectiveCostMaster,
        openEffectiveCostDetail: openEffectiveCostDetail,
        openSmallCostDetail: openSmallCostDetail,
        openLetter: openLetter,
        changeShowDetail: changeShowDetail,
        changeStatus: changeStatus,
        callbackAfterItemGoodUpdate: callbackAfterItemGoodUpdate
    };


});
