
define(['services/logger',
        'services/common',
        'durandal/app',
        'plugins/router',
        'viewmodels/tools/unitPriceCalc',
        'viewmodels/tools/assignGroup',
        'viewmodels/effectiveCost',
        'viewmodels/letter',
        'services/viewController'],
function (logger, com, app, router, calc, assignGroup, effectiveCost, letter, viewController) {

    var activate = function () {
        viewController.chooseViews(['list', 'detail']);
        requestTicketpager(new helper.pager(context, requestTickets));
        letter.setMasterInfo('Ticket');
        assignGroup.setMasterInfo(requestTickets, 'Ticket');
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

    var requestTickets = ko.observableArray([]);
    var selectedRequestTicket = ko.observable();
    var selectedRequestTicketDetail = ko.observable();
    var canShowDoneDateColumn = ko.observable(false);
    var canShowCompleteData = ko.observable(false);
    var canShowAssignGroup = ko.observable(false);

    var init = function () {
        var q = context.query('RequestTickets');
        q = q.where('PeriodID', '==', helper.defaults.currentPeriod().ID);
        
        var navigarions = [
           "Person",
           "Section",
           "CreatedByUser",
           "PurchasingOfficer",
           "LetterRequestTickets",
           "EffectiveCostTickets",
           "RequestDetailTickets",
           "RequestDetailTickets.Seller",
           "RequestDetailTickets.EffectiveCostTicketDetails",
           "RequestDetailTickets.EffectiveCostTicketDetails.CostType"
        ];

        q = q.expand(navigarions);

        requestTicketpager().setQuery(q);
        requestTicketpager().changeAllData(false);
        return requestTicketpager().load();
    };

    var selectRequestTicketDetail = function (item) {
        selectedRequestTicketDetail(item);
    };

    var add = function () {
        requestTickets.addEntity(context, 'RequestTicket',
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
        var newEntity = context.addEntity('RequestDetailTicket',
            {
                DoneDate: null,
                GoOnDate: new Date,
                ReturnDate: new Date,
                ItemTicket: null,
                ItemTicketID: 1,
                Seller: null,
                SellerID: null,
                RequestTicket: item,
                RequestTicketID: item.ID(),
                PurchaseSize: 0
            });

        var sq = 0;
        item.RequestDetailTickets.foreach(function (rds) {
            sq += 1;
            rds.Row(sq);
        });
    };

    var remove = function () {
        var item = selectedRequestTicket();
        requestTickets.removeEntity(item);
        selectedRequestTicket(null);
    };

    var removeDetail = function () {
        var item = selectedRequestTicketDetail();
        item.RequestTicket(null);

        if (item.entityAspect.entityState == 'Added')
            item.entityAspect.rejectChanges();

        item.entityAspect.setDeleted();

        selectedRequestTicketDetail(null);
    };

    var save = function () {
        if (hasChanges())
            context.saveChanges();
    };
    var cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            requestTicketpager().loadLocally();
        }
    };

    var selectRequestTicket = function (item) {
        selectedRequestTicket(item);
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

    var callbackAfterItemTicketUpdate = function (item) {
        if (item.entityAspect.entityState != 'Added')
            return 0;
        item.Scale(item.ItemTicket().Scale());
        item.ScaleID(item.ItemTicket().ScaleID());
        if (item.UnitPrice() == undefined)
            item.UnitPrice(item.ItemTicket().Price());
    };

    var openEffectiveCostMaster = function (item) {
        effectiveCost.setMasterInfo('master', 'Ticket');
        effectiveCost.currentMaster(item);
        effectiveCost.openEffectiveCost();
    };

    var openEffectiveCostDetail = function (item) {
        effectiveCost.setMasterInfo('detail', 'Ticket');
        effectiveCost.currentMaster(item);
        effectiveCost.openEffectiveCost();
    };

    var openSmallCostDetail = function (item) {
        smallCost.setMasterInfo('detail', 'Ticket');
        smallCost.currentMaster(item);
        smallCost.openSmallCost();
    };

    var openLetter = function (item) {
        effectiveCost.setMasterInfo('Ticket');
        effectiveCost.currentMaster(item);
        effectiveCost.openLetter();
    };

    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var requestTicketpager = ko.observable();

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        attached: attached,
        title: 'درخواست بلیط',
        hasChanges: hasChanges,
        calc: calc,
        assignGroup: assignGroup,
        requestTickets: requestTickets,
        selectedRequestTicket: selectedRequestTicket,
        selectedRequestTicketDetail: selectedRequestTicketDetail,
        requestTicketpager: requestTicketpager,
        canShowDoneDateColumn: canShowDoneDateColumn,
        canShowCompleteData: canShowCompleteData,
        canShowAssignGroup: canShowAssignGroup,
        init: init,
        selectRequestTicket: selectRequestTicket,
        selectRequestTicketDetail: selectRequestTicketDetail,
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
        callbackAfterItemTicketUpdate: callbackAfterItemTicketUpdate
    };


});
