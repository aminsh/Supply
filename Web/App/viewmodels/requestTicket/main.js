﻿define(['services/logger',
        'services/common',
        'durandal/app',
        'plugins/router',
        'viewmodels/tools/unitPriceCalc',
        'viewmodels/tools/assignGroup',
        'viewmodels/effectiveCost',
        'viewmodels/smallCost',
        'viewmodels/letter',
        'services/viewController'],
function(logger, com, app, router, calc, assignGroup, effectiveCost, smallCost, letter, viewController) {
    var activate = function(param) {
        var views = [];
        views.push(viewController.createViewObject('list', 'لیست'));
        views.push(viewController.createViewObject('singleEdit', 'تک ردیف قابل ویرایش'));
        views.push(viewController.createViewObject('singleRead', 'تک ردیفف فقط قابل مشاهده'));
        viewController.rebuild(views);
        viewController.selectViewByName('list');
        
        pager(new helper.pager(context, requests));
        letter.setMasterInfo('Ticket');
        init();
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
        var q = context.query('RequestTicketsAdv').toType('RequestTicket');
        q = q.orderByDesc('No');
        q = q.where('Status', '!=', 'Cancel');
        q = q.withParameters({ filter: ko.toJSON(search.getParamter()) });
        
        var navigarions = [
           "Person",
           "Section",
           "PerformerSection",
           "ConsumerSection",
           "CreatedByUser",
           "PurchasingOfficer",
           "LetterRequestTickets",
           "EffectiveCostTickets",
           "RequestDetailTickets",
            "RequestDetailTickets.Passenger",
           "RequestDetailTickets.Seller",
           "RequestDetailTickets.EffectiveCostTicketDetails",
           "RequestDetailTickets.EffectiveCostTicketDetails.CostType"
        ];

        q = q.expand(navigarions);

        pager().setQuery(q);
        pager().changeAllData(false);
        return pager().load();
    };

    var requests = ko.observableArray();
    var current = ko.observable();
    var currentDetail = ko.observable();

    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var pager = ko.observable();
    
    var canShowMaster = ko.observable(false);
    var canShowDetail = ko.observable(false);
    var canShowFinance = ko.observable(false);
    

    var canShowCurrentDetailFull = ko.observable(false);
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

    var changeShowCurrentDetailFull = function() {
        canShowCurrentDetailFull(!canShowCurrentDetailFull());
    };

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
        var newEntity = context.addEntity('RequestTicket',
            {
                No: 0,
                SectionID: null,
                PerformerSectionID: null,
                ConsumerSectionID: null,
                PersonID: null,
                PurchasingOfficer: null,
                PurchasingOfficerID: null,
                UserDefinedCategory: null,
                UserDefinedCategoryID: null,
                Date: new Date(),
                OrderDate: null,
                ShowDetail: true,
                PurchaseMethod: 'Small',
                Status: 'Confirm'
            });
        current(newEntity);
        changeShowMaster();
        viewController.selectViewByName('singleEdit');
    };
    
    var addDetail = function (item) {
        var newEntity = context.addEntity('RequestDetailTicket',
            {
                Passenger: null,
                PassengerID: null,
                GoOnDate: new Date,
                ReturnDate: new Date,
                DoneDate: null,
                ItemTicket: null,
                ItemTicketID: 1,
                ScaleID: 1,
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

    var removeDetail = function () {
        var item = currentDetail();
        //item.RequestTicket(null);

        //if (item.entityAspect.entityState == 'Added')
        //    item.entityAspect.rejectChanges();

        item.entityAspect.setDeleted();
        currentDetail(null);
    };
    
    var save = function () {
        if (hasChanges()) {
            return context.saveChanges(); 
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
    
    var callbackAfterItemTicketUpdate = function (item) {
        if (item.entityAspect.entityState != 'Added')
            return 0;
        item.Scale(item.ItemTicket().Scale());
        item.ScaleID(item.ItemTicket().ScaleID());
        if (item.UnitPrice() == undefined)
            item.UnitPrice(item.ItemTicket().Price());
    };
    
    var openEffectiveCostMaster = function () {
        var item = currentDetail();
        effectiveCost.setMasterInfo('master', 'Ticket');
        effectiveCost.currentMaster(item);
        effectiveCost.openEffectiveCost();
    };

    var openEffectiveCostDetail = function () {
        var item = currentDetail();
        effectiveCost.setMasterInfo('detail', 'Ticket');
        effectiveCost.currentMaster(item);
        effectiveCost.openEffectiveCost();
    };

    var openSmallCostDetail = function () {
        var item = currentDetail();
        smallCost.setMasterInfo('detail', 'Ticket');
        smallCost.currentMaster(item);
        smallCost.openSmallCost();
    };

    var openLetter = function () {
        var item = currentDetail();
        effectiveCost.setMasterInfo('Ticket');
        effectiveCost.currentMaster(item);
        effectiveCost.openLetter();
    };

    var search = {
        periodIncluded: ko.observable(false),
        no: ko.observable(null),
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
        if (!isNullOrEmpty(search.letterNo())) {
            params.push({ FieldName: 'letterNo', Value: search.letterNo() });
        }
        if (!isNullOrEmpty(search.letterDate())) {
            params.push({ FieldName: 'letterDate', Value: search.letterDate() });
        }
        return params;
    };
    return {
        title: 'درخواست بلیط',
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
        changeShowCurrentDetailFull: changeShowCurrentDetailFull,
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
        callbackAfterItemTicketUpdate: callbackAfterItemTicketUpdate,
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