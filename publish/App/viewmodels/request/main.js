
define(['services/logger',
  'services/common',
  'durandal/app',
  'plugins/router',
  'modal/confirmCancel',
  'modal/effectiveCost',
  'modal/smallCost',
  'services/viewController',
  'modal/letter'],
function (logger, com, app, router,confirmCancel,effectiveCost,smallCost, viewController,letter) {

    var activate = function () {
        pager(new helper.pager(context, requests));
        
        var views = [];
        var view = viewController.createViewObject('list', 'لیست');
        view.css = 'btn-danger';
        view.loadStatus = ko.observable('notLoad');
        views.push(view);

        view = viewController.createViewObject('read', 'نمایش');
        view.css = 'btn-success';
        view.loadStatus = ko.observable('notLoad');
        views.push(view);

        view = viewController.createViewObject('edit', 'ویرایش');
        view.css = 'btn-primary';
        view.loadStatus = ko.observable('notLoad');
        views.push(view);

        viewController.rebuild(views);
        viewController.selectViewByName('list');
        
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

    var requestTypes = [
        { name: 'Good', title: 'کالا' },
        { name: 'Service', title: 'خدمات' },
        { name: 'Food', title: 'مواد غذایی' },
        { name: 'Ticket', title: 'بلیط' },
        { name: 'Vehicle', title: 'نقلیه' }
    ];
    
    var requests = ko.observableArray([]);
    var current = ko.observable();
    var currentDetail = ko.observable();
    
    var init = function () {
        var q = context.query('RequestGoods');
        
       
        var queries = [];
        var params = search.getParamter();

        queries.push(context.query('RequestGoodsAdv')
            .where('HasOrder', '==', true)
            .withParameters({ filter: ko.toJSON(params) })
        );
        queries.push(context.query('RequestServicesAdv')
            .where('HasOrder', '==', true)
            .withParameters({ filter: ko.toJSON(params) })
        );
        queries.push(context.query('RequestFoodsAdv')
            .where('HasOrder', '==', true)
            .withParameters({ filter: ko.toJSON(params) })
        );
        queries.push(context.query('RequestTicketsAdv')
            .where('HasOrder', '==', true)
            .withParameters({ filter: ko.toJSON(params) })
        );
        queries.push(context.query('RequestVehiclesAdv')
            .where('HasOrder', '==', true)
            .withParameters({ filter: ko.toJSON(params) })
        );
        
        pager().setQueries(queries);
        pager().changeAllData(false);
        
        pager().setCallbackBeforeLoad(function() {
            requests.removeAll();
        });
        
        pager().setCallback(function (data) {
            var results = data.results;
            results.foreach(function (item) {
                item.RequestType = ko.observable(item.entityType.shortName.replaceAll('Request',''));
                requests.push(item);
            });

            requests.sort(function(left,right) {
                return left.ID() == right.ID() ? 0 : (left.ID() > right.ID() ? -1 : 1);
            });
        });
        return pager().load();
    };

    var loadSingleEntity = function(item) {
        var resourceName = item.entityType.defaultResourceName;
        var q = context.query(resourceName);
       
        var navigarions = [
           "Person",
           "Section",
           "ConsumerSection",
           "CreatedByUser",
           "PurchasingOfficer"
        ];

        navigarions.push('LetterRequest' + item.RequestType() + 's');
        
        q = q.expand(navigarions);

        q = q.where('ID', '==', item.ID());

        context.executeQuery(q).then(function (data) {
            var results = data.results;
            current(results[0]);
        });
    };
    
    var loadSingleEntityDetail = function (item) {
        var detailProp = item.entityType.navigationProperties.first(function(prop) {
            return prop.name.startsWith('RequestDetail');
        });

        if (isNullOrEmpty(detailProp))
            return;

        var resourceName = detailProp.name;
        
        var q = context.query(resourceName);

        var navigarions = [
           "Seller"
        ];

        navigarions.push('Item' + item.RequestType());
        
        if (item.RequestType() == 'Good') {
            navigarions.push('ItemGood.Scale');
            navigarions.push('InputDetail');
            navigarions.push('InputDetail.Input');
        }                    
        
        if (['Service', 'Food', 'Vehicle'].contains(item.RequestType())) {
            navigarions.push('Scale');
        }
        
        if (item.RequestType() == 'Ticket') {
            navigarions.push('Passenger');
        }
        q = q.expand(navigarions);

        var preds = [];

        preds.push(context.predicate('IsOrder', '==', true));
        preds.push(context.predicate('Request' + item.RequestType() + 'ID', '==', item.ID()));
        
        q = q.where(breeze.Predicate.and(preds));
        
        context.executeQuery(q).then(function (data) {
            item['RequestDetail' + item.RequestType() + 's'].sort(function(left, right) {
                return left.Row() == right.Row() ? 0 : (left.Row() < right.Row() ? -1 : 1);
            });
            var results = data.results;
        });
    };

    var selectDetail = function(item) {
        currentDetail(item);
    };
    var read = function(item) {
        loadSingleEntity(item);
        canShowMaster(true);
        viewController.selectViewByName('read');
    };

    var edit = function(item) {
        loadSingleEntity(item);
        canShowMaster(true);
        viewController.selectViewByName('edit');
    };

    var readToEdit = function() {
        viewController.selectViewByName('edit');
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
    
    var returnToRead = function () {
        if (current().entityAspect.entityState.isAdded()) 
            return;
        
        leaveEdit(function () {
            viewController.selectViewByName('read');
        });
    };

    var returnToList = function () {
        leaveEdit(function () {
            canShowMaster(false);
            canShowDetail(false);
            canShowFinance(false);
            viewController.selectViewByName('list');
        });
    };
    
    var add = function(type) {
        var entityName = 'Request' + type.name;
        
        var initValue = {
            Section: null,
            SectionID: null,
            Person: null,
            PersonID: null,
            PurchasingOfficer: null,
            PurchasingOfficerID: null,
            UserDefinedCategory: null,
            UserDefinedCategoryID: null,
            Date: new Date(),
            OrderDate: null,
            ShowDetail: true,
            PurchaseMethod: 'Small',
            Status: 'Order',
            HasOrder: true
        };
        var newEntity = context.addEntity(entityName, initValue);
        newEntity.RequestType = ko.observable(type.name);
        current(newEntity);
        viewController.selectViewByName('edit');
    };

    var addDetail = function() {
        var detailProp = current().entityType.navigationProperties.first(function (prop) {
            return prop.name.startsWith('RequestDetail');
        });

        if (isNullOrEmpty(detailProp))
            return;

        var entityName = detailProp.entityType.shortName;
        
        var initValue = {
            DoneDate: null,
            Seller: null,
            SellerID: null,
            PurchaseSize: 0,
            ItemDescription: '---'
        };

        if (['Good', 'Service', 'Food', 'Vehicle'].contains(current().RequestType())) {
            initValue['Item' + current().RequestType()] = null;
            initValue['Item' + current().RequestType() + 'ID'] = null;
            initValue.Qty = 1;
        }
        
        if (current().RequestType() === 'Ticket') {
            initValue['Item' + current().RequestType() + 'ID'] = 1;
            initValue.Passenger = null;
            initValue.PassengerID = null;
            initValue.GoOnDate = new Date;
            initValue.ReturnDate = null;
        }
         
        initValue['Request' + current().RequestType()] = current();
        initValue['Request' + current().RequestType() + 'ID'] = current().ID();
        
        var newEntity = context.addEntity(entityName, initValue);
    };

    var remove = function() {

    };

    var removeDetail = function(item) {
        if (item.IsCancel())
            return;

        if (!item.entityAspect.entityState.isAdded()) {
            confirmCancel.show(item);
            return;
        }

        item['Request' + current().RequestType()](null);
        item['Request' + current().RequestType() + 'ID'](null);

        item.entityAspect.setDeleted();
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
                .then(function(answer) {
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
    
    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var pager = ko.observable();
    
    var callbackAfterItemUpdate = function (item) {
        if (item.entityAspect.entityState != 'Added')
            return 0;
        //item.Scale(item.ItemGood().Scale());
        //item.ScaleID(item.ItemGood().ScaleID());
        if (item.UnitPrice() == undefined)
            item.UnitPrice(item.ItemGood().Price());
    };

    var getRequestIcon = function (type) {
        var className = 'icon-' + type.toLowerCase();
        var obj = {};
        obj[className] = true;
        return obj;
    };
    
    var openEffectiveCostDetail = function (item) {
        effectiveCost.show(item);
    };


    var openSmallCost = function(item) {
        smallCost.show(item);
    };
    var openLetter = function(item) {
        letter.show(item);
    };
    
    var canShowMaster = ko.observable(false);
    var canShowDetail = ko.observable(false);
    var canShowFinance = ko.observable(false);

    var canShowCurrentDetailFull = ko.observable(true);

    var canShowLetter = ko.observable(false);
    
    var changeShowMaster = function() {
        canShowMaster(!canShowMaster());
    };

    var changeShowDetail = function() {
        canShowDetail(!canShowDetail());
        loadSingleEntityDetail(current());
    };

    var changeShowFinance = function() {
        canShowFinance(!canShowFinance());
    };

    var changeShowLetter = function() {
        canShowLetter(!canShowLetter());
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
        pager: pager,
        hasChanges: hasChanges,
        requestTypes: requestTypes,
        requests: requests,
        current: current,
        currentDetail: currentDetail,
        init: init,
        viewController: viewController,
        loadSingleEntity: loadSingleEntity,
        loadSingleEntityDetail: loadSingleEntityDetail,
        selectDetail: selectDetail,
        read: read,
        edit: edit,
        add: add,
        addDetail: addDetail,
        remove: remove,
        removeDetail: removeDetail,
        save: save,
        cancel: cancel,
        callbackAfterItemUpdate: callbackAfterItemUpdate,
        openEffectiveCostDetail: openEffectiveCostDetail,
        openSmallCost: openSmallCost,
        openLetter: openLetter,
        returnToList: returnToList,
        returnToRead: returnToRead,
        readToEdit: readToEdit,
        canShowMaster: canShowMaster,
        canShowDetail: canShowDetail,
        canShowFinance: canShowFinance,
        canShowLetter: canShowLetter,
        canShowCurrentDetailFull: canShowCurrentDetailFull,
        changeShowMaster: changeShowMaster,
        changeShowDetail: changeShowDetail,
        changeShowFinance: changeShowFinance,
        changeShowLetter: changeShowLetter,
        getRequestIcon: getRequestIcon,
        search: search
    };


});
   
