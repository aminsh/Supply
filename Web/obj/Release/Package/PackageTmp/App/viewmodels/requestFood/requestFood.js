
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
        requestFoodpager(new helper.pager(context, requestFoods));
        letter.setMasterInfo('Food');
        assignGroup.setMasterInfo(requestFoods, 'Food');
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

    var requestFoods = ko.observableArray([]);
    var selectedRequestFood = ko.observable();
    var selectedRequestFoodDetail = ko.observable();
    var canShowDoneDateColumn = ko.observable(false);
    var canShowCompleteData = ko.observable(false);
    var canShowAssignGroup = ko.observable(false);

    var init = function () {
        var q = context.query('RequestFoods');
        q = q.where('PeriodID', '==', helper.defaults.currentPeriod().ID);
        
        var navigarions = [
           "Person",
           "Section",
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

        requestFoodpager().setQuery(q);
        requestFoodpager().changeAllData(false);
        return requestFoodpager().load();
    };
    
    var selectRequestFood = function (item) {
        if (fastEntry.canFastEntryOpen()) {
            fastEntry.init(item);
        }
        selectedRequestFood(item);
        
    };
    var selectRequestFoodDetail = function (item) {
        selectedRequestFoodDetail(item);
    };

    var openEffectiveCostMaster = function (item) {
        effectiveCost.setMasterInfo('master', 'Food');
        effectiveCost.currentMaster(item);
        effectiveCost.openEffectiveCost();
    };
    
    var openEffectiveCostDetail = function (item) {
        effectiveCost.setMasterInfo('detail', 'Food');
        effectiveCost.currentMaster(item);
        effectiveCost.openEffectiveCost();
    };
    
    var openLetter = function (item) {
        effectiveCost.setMasterInfo('Food');
        effectiveCost.currentMaster(item);
        effectiveCost.openLetter();
    };
    
    var add = function () {
        requestFoods.addEntity(context, 'RequestFood',
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
        return newEntity;
    };

    var remove = function () {
        var item = selectedRequestFood();
        requestFoods.removeEntity(item);
        selectedRequestFood(null);
    };

    var removeDetail = function () {
        var item = selectedRequestFoodDetail();
        item.RequestFood(null);

        if (item.entityAspect.entityState == 'Added')
            item.entityAspect.rejectChanges();

        item.entityAspect.setDeleted();

        selectedRequestFoodDetail(null);
    };

    var save = function () {
        if (hasChanges())
            context.saveChanges();
    };
    var cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            requestFoodpager().loadLocally();
        }
    };

    var changeShowDetail = function (item) {
        if (item.hasOwnProperty('Scale'))
            item.entityAspect.loadNavigationProperty('Scale');
        item.ShowDetail(!item.ShowDetail());
    };
    
    var callbackAfterItemFoodUpdate = function (item) {
        if (item.entityAspect.entityState != 'Added')
            return 0;
        item.Scale(item.ItemFood().Scale());
        item.ScaleID(item.ItemFood().ScaleID());

        if (item.UnitPrice() == undefined)
            item.UnitPrice(item.ItemFood().Price());
    };

    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var requestFoodpager = ko.observable();

    
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
        selectedRequestFood(item);
        //fastEntry.list.removeAll();
        fastEntry.itemSearch(null);
        fastEntry.canFastEntryOpen(true);
        var q = context.query('ItemFoodsAdv').toType('ItemFood');
        q = q.withParameters({ date: moment().format("YYYY/MM/DD"), term: 'empty' });
        //q = q.take(10);

        context.executeQuery(q).then(function(data) {
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

    fastEntry.addToRequestDetail = function(item) {
        var rds = fastEntry.parent.RequestDetailFoods().first(function(p) {
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
                ScaleID: item.Scale() == undefined? null : item.Scale().ID(),
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
        var rd = fastEntry.list().first(function(itemFood) {
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
            fastEntry.list.foreach(function(item) {
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
    fastEntry.callbackAfterSelect = function(item) {
        fastEntry.add(fastEntry.itemSearch());
    };
    
    
    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'درخواست مواد غذایی',
        hasChanges: hasChanges,
        calc: calc,
        requestFoods: requestFoods,
        selectedRequestFoodDetail: selectedRequestFoodDetail,
        selectedRequestFood: selectedRequestFood,
        requestFoodpager: requestFoodpager,
        canShowDoneDateColumn: canShowDoneDateColumn,
        canShowCompleteData: canShowCompleteData,
        canShowAssignGroup:canShowAssignGroup,
        init: init,
        selectRequestFood: selectRequestFood,
        selectRequestFoodDetail: selectRequestFoodDetail,
        add: add,
        addDetail: addDetail,
        remove: remove,
        removeDetail: removeDetail,
        save: save,
        cancel: cancel,
        changeShowDetail: changeShowDetail,
        callbackAfterItemFoodUpdate: callbackAfterItemFoodUpdate,
        assignGroup: assignGroup,
        effectiveCost: effectiveCost,
        letter: letter,
        viewController: viewController,
        openEffectiveCostMaster: openEffectiveCostMaster,
        openEffectiveCostDetail: openEffectiveCostDetail,
        openLetter: openLetter,
        fastEntry: fastEntry
    };


});
