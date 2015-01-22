define(['services/logger',
        'services/common',
        'durandal/app',
        'plugins/router',
        'services/viewController'],
function(logger, com, app, router,viewController) {
    var activate = function(param) {
        var views = [];
        views.push(viewController.createViewObject('list', 'لیست'));
        views.push(viewController.createViewObject('singleEdit', 'تک ردیف قابل ویرایش'));
        views.push(viewController.createViewObject('singleRead', 'تک ردیفف فقط قابل مشاهده'));
        viewController.rebuild(views);
        viewController.selectViewByName('list');
        
        pager(new helper.pager(context, outputs));
       
        init();
    };

    var deactivate = function () {
        com.deactivate();
        
    };

    var canDeactivate = function () {
        if (hasChanges()) {
            var title = 'آیا مایل به ادامه عملیات هستید ؟';
            var msg = 'لغو تغییرات';

            app.showMessage(title, msg, ['Yes', 'No'])
                .then(function (answer) {
                    if (answer == 'Yes') {
                        context.cancelChanges();
                        return true;
                    }
                });
        } else {
            return true;
        }
    };

    var attached = function() {

    };

    var init = function() {
        var q = context.query('Outputs');
        //q = q.orderByDesc('No');
        //q = q.where('Status', '!=', 'Cancel');
        //q = q.withParameters({ filter: ko.toJSON(search.getParamter()) });
        //q = q.where('PeriodID', '==', helper.defaults.currentPeriod().ID);

        var navigarions = [
           "Person",
           "Section",
           "CreatedByUser",
           "OutputDetails",
           "OutputDetails.ItemGood",
           "OutputDetails.ItemGood.Scale"
        ];

        q = q.expand(navigarions);

        pager().setQuery(q);
        pager().changeAllData(false);
        return pager().load();
    };

    var outputs = ko.observableArray();
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
        var newEntity = context.addEntity('Output',
            {
                No: 0,
                SectionID: null,
                PersonID: null,
                Date: new Date(),
                ShowDetail: true,
                Status: 'Temporary'
            });
        current(newEntity);
        changeShowMaster();
        viewController.selectViewByName('singleEdit');
    };
    
    var addDetail = function (item) {
        var newEntity = context.addEntity('OutputDetail',
            {
                ItemGood: null,
                ItemGoodID: null,
                Output: item,
                OutputID: item.ID()
            });

        var sq = 0;
        item.OutputDetails.foreach(function (rds) {
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
                            outputs.remove(entity);
                        }); 
                    }
                    viewController.selectViewByName('list');
                }
            });

    };

    var removeDetail = function (item) {
        //var item = currentDetail();

        item.entityAspect.setDeleted();
        currentDetail(null);
    };
    
    var save = function () {
        if (hasChanges()) {
            var entityState = current().entityAspect.entityState;
            var callbackIfSuccessful = {
                success: function(result) {
                    if (entityState == "Added")
                        outputs.unshift(current());
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
        title: 'حواله',
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        attached: attached,
        init: init,
        viewController: viewController,
        outputs: outputs,
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
        search: search
    };
});