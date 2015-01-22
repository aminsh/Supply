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
    var activate = function (param) {
        var views = [];
        views.push(viewController.createViewObject('list', 'لیست'));
        views.push(viewController.createViewObject('singleEdit', 'تک ردیف قابل ویرایش'));
        views.push(viewController.createViewObject('singleRead', 'تک ردیفف فقط قابل مشاهده'));
        viewController.rebuild(views);
        viewController.selectViewByName('list');

        pager(new helper.pager(context, requests));
        letter.setMasterInfo('Food');
        init();
    };

    var deactivate = function () {
        com.deactivate();

    };

    var canDeactivate = function () {
        return true;
    };

    var attached = function () {

    };

    var init = function () {
        var q = context.query('RequestFoodsAdv').toType('RequestFood');
        q = q.orderByDesc('No');
        q = q.where('Status', '!=', 'Cancel');
        q = q.withParameters({ filter: ko.toJSON(search.getParamter()) });
        //q = q.where('PeriodID', '==', helper.defaults.currentPeriod().ID);

        var navigarions = [
           "Person",
           "Section",
           "PerformerSection",
           "ConsumerSection",
           "CreatedByUser",
           "PurchasingOfficer",
           "LetterRequestFoods",
           "EffectiveCostFoods",
           "RequestDetailFoods",
           "RequestDetailFoods.ItemFood",
           "RequestDetailFoods.Scale",
           "RequestDetailFoods.Seller",
           "RequestDetailFoods.EffectiveCostFoodDetails",
           "RequestDetailFoods.EffectiveCostFoodDetails.CostType"
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

    var changeShowMaster = function () {
        canShowMaster(!canShowMaster());
    };

    var changeShowDetail = function () {
        canShowDetail(!canShowDetail());
    };

    var changeShowFinance = function () {
        canShowFinance(!canShowFinance());
    };

    var changeShowCurrentDetailFull = function () {
        canShowCurrentDetailFull(!canShowCurrentDetailFull());
    };

    var changeShowCurrentDetailRead = function () {
        canShowCurrentDetailRead(!canShowCurrentDetailRead());
    };

    var select = function (item) {
        current(item);
        canShowMaster(true);
        viewController.selectViewByName('singleRead');
    };

    var selectDetail = function (item) {
        currentDetail(item);
    };

    var edit = function () {
        viewController.selectViewByName('singleEdit');
    };

    var returnToRead = function () {
        leaveEdit(function () {
            viewController.selectViewByName('singleRead');
        });
    };

    var returnToList = function () {
        leaveEdit(function () {
            viewController.selectViewByName('list');
        });
    };

    var leaveEdit = function (gotoCallback) {
        if (hasChanges()) {
            var title = 'آیا مایل به ادامه عملیات هستید ؟';
            var msg = 'لغو تغییرات';

            app.showMessage(title, msg, ['Yes', 'No'])
                .then(function (answer) {
                    if (answer == 'Yes') {
                        context.cancelChanges();
                        gotoCallback();
                    }
                });
        } else {
            gotoCallback();
        }
    };

    var add = function () {
        var newEntity = context.addEntity('RequestFood',
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
                Status: 'Confirm'
            });
        current(newEntity);
        changeShowMaster();
        viewController.selectViewByName('singleEdit');
    };

    var addDetail = function (item) {
        var newEntity = context.addEntity('RequestDetailFood',
            {
                DoneDate: null,
                ItemFood: null,
                ItemFoodID: null,
                Seller: null,
                SellerID: null,
                RequestFood: item,
                RequestFoodID: item.ID(),
                PurchaseSize: 0
            });

        var sq = 0;
        item.RequestDetailFoods.foreach(function (rds) {
            sq += 1;
            rds.Row(sq);
        });
    };

    var remove = function () {
        var title = 'آیا مایل به ادامه عملیات هستید ؟';
        var msg = 'حذف درخواست جاری';
        app.showMessage(title, msg, ['Yes', 'No'])
            .then(function (answer) {
                if (answer == 'Yes') {
                    var entity = current();
                    if (entity.entityAspect.entityState == "Added") {
                        entity.entityAspect.rejectChanges();
                    } else {
                        entity.Status('Cancel');
                        save().then(function () {
                            requests.remove(entity);
                        });
                    }
                    viewController.selectViewByName('list');
                }
            });

    };

    var removeDetail = function () {
        var item = currentDetail();
        //item.RequestFood(null);

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

    var callbackAfterItemFoodUpdate = function (item) {
        if (item.entityAspect.entityState != 'Added')
            return 0;
        item.Scale(item.ItemFood().Scale());
        item.ScaleID(item.ItemFood().ScaleID());
        if (item.UnitPrice() == undefined)
            item.UnitPrice(item.ItemFood().Price());
    };

    var openEffectiveCostMaster = function () {
        var item = currentDetail();
        effectiveCost.setMasterInfo('master', 'Food');
        effectiveCost.currentMaster(item);
        effectiveCost.openEffectiveCost();
    };

    var openEffectiveCostDetail = function () {
        var item = currentDetail();
        effectiveCost.setMasterInfo('detail', 'Food');
        effectiveCost.currentMaster(item);
        effectiveCost.openEffectiveCost();
    };

    var openSmallCostDetail = function () {
        var item = currentDetail();
        smallCost.setMasterInfo('detail', 'Food');
        smallCost.currentMaster(item);
        smallCost.openSmallCost();
    };

    var openLetter = function () {
        var item = currentDetail();
        effectiveCost.setMasterInfo('Food');
        effectiveCost.currentMaster(item);
        effectiveCost.openLetter();
    };

    var search = {
        periodIncluded: ko.observable(false),
        no: ko.observable(null),
        letterNo: ko.observable(null),
        letterDate: ko.observable(null)
    };

    var fastEntry = {
        list: ko.observableArray(),
        items: ko.observableArray(),
        offers: ko.observableArray(),
        itemSearch: ko.observable(),
        section: ko.observable(),
        parent: null,
        canFastEntryOpen: ko.observable(false)
    };

    fastEntry.init = function (item) {
        if (item == fastEntry.parent && fastEntry.canFastEntryOpen()) {
            fastEntry.canFastEntryOpen(false);
            return;
        }
        fastEntry.parent = item;
        //selectedRequestFood(item);
        //fastEntry.list.removeAll();
        fastEntry.itemSearch(null);
        fastEntry.canFastEntryOpen(true);
        var q = context.query('ItemFoodsAdv').toType('ItemFood');
        q = q.withParameters({ date: moment().format("YYYY/MM/DD"), term: 'empty' });
        //q = q.take(10);

        context.executeQuery(q).then(function (data) {
            fastEntry.offers(data.results);
        });
    };

    fastEntry.load = function () {
        var q = context.query('ItemFoods');
        //var p1 = breeze.Predicate.create("ItemFoodType", "==", 'Food');
        //var p2 = breeze.Predicate.create("Title", "contains", fastEntry.itemSearch());
        q = q.where("Title", "contains", fastEntry.itemSearch());
        //var pred = breeze.Predicate.and([p1, p2]);

        //q = q.where(pred);
        q = q.take(10);

        fastEntry.items.executeQuery(context, q);

        q = context.query('ItemFoodsAdv').toType('ItemFood');
        q = q.withParameters({ date: moment().format("YYYY/MM/DD"), term: fastEntry.itemSearch() });

        context.executeQuery(q).then(function (data) {
            fastEntry.offers(data.results);
        }).fail(function (error) {
            alert(error);
        });
    };

    fastEntry.addToRequestDetail = function (item) {
        var rds = fastEntry.parent.RequestDetailFoods().first(function (p) {
            return p.ItemFood() == item;
        });
        if (rds != null) {
            rds.Qty(rds.Qty() + 1);
            return;
        }

        var newEntity = context.addEntity('RequestDetailFood',
            {
                DoneDate: null,
                ItemFood: item,
                ItemFoodID: item.ID(),
                UnitPrice: item.Price() == undefined ? 0 : item.Price(),
                Scale: item.Scale() == undefined ? null : item.Scale(),
                ScaleID: item.Scale() == undefined ? null : item.Scale().ID(),
                Qty: 1,
                Seller: null,
                SellerID: null,
                RequestFood: fastEntry.parent,
                RequestFoodID: fastEntry.parent.ID(),
                PurchaseSize: 0
            });

        var sq = 0;
        fastEntry.parent.RequestDetailFoods.foreach(function (rds) {
            sq += 1;
            rds.Row(sq);
        });
    };

    fastEntry.add = function (item) {
        var rd = fastEntry.list().first(function (itemFood) {
            return itemFood.item == item;
        });

        if (rd != null) {
            rd.qty(rd.qty() + 1);
            return;
        }

        var row = {
            item: item,
            unitPrice: ko.observable(item.Price() == undefined ? 1 : item.Price()),
            qty: ko.observable(1)
        };
        fastEntry.list.push(row);
    };

    fastEntry.remove = function (item) {
        item.RequestFood(null);

        if (item.entityAspect.entityState == 'Added')
            item.entityAspect.rejectChanges();

        item.entityAspect.setDeleted();

        selectedRequestFoodDetail(null);
    };

    fastEntry.addToRequestFood = function () {
        if (fastEntry.list().any()) {
            fastEntry.list.foreach(function (item) {
                var newEntity = addDetail(fastEntry.parent);
                newEntity.ItemFood(item.item);
                newEntity.ItemFoodID(item.item.ID());
                newEntity.Qty(item.qty());
                newEntity.UnitPrice(item.unitPrice());
                newEntity.Scale(item.item.Scale());
                newEntity.ScaleID(item.item.ScaleID());
            });
        }
        fastEntry.canFastEntryOpen(false);
    };
    fastEntry.callbackAfterSelect = function (item) {
        fastEntry.add(fastEntry.itemSearch());
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
            params.push({ FieldName: 'letterDate', Value: search.letterDate().toPersian() });
        }
        return params;
    };
    return {
        title: 'درخواست مواد غذایی',
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
        callbackAfterItemFoodUpdate: callbackAfterItemFoodUpdate,
        effectiveCost: effectiveCost,
        smallCost: smallCost,
        letter: letter,
        openEffectiveCostMaster: openEffectiveCostMaster,
        openEffectiveCostDetail: openEffectiveCostDetail,
        openSmallCostDetail: openSmallCostDetail,
        openLetter: openLetter,
        search: search,
        fastEntry: fastEntry
    };
});