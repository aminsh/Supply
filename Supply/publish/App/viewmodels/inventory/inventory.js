      
define(['services/logger',
  'services/common',
  'durandal/app',
  'plugins/router',
  'services/viewController'],
    function(logger, com, app, router, viewController) {

        var activate = function() {
            pager(new helper.pager(context, inventories));
            
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
        var canDeactivate = function() {
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

        var deactivate = function() {
            com.deactivate();
        };
        var attached = function() {
        };

        var inventoryTypes = [
            { name: 'Input', title: 'رسید' },
            { name: 'Output', title: 'حواله' }
        ];
        
        var inventories = ko.observableArray([]);
        var current = ko.observable();
        var currentDetail = ko.observable();

        var init = function() {
            var navigarions = [
                'Section',
                'Section.Parent',
                'Person',
                'RequestGood'
            ];
            
            var queries = [];
            queries.push(context.query('Inputs').expand(navigarions));
            queries.push(context.query('Outputs').expand(navigarions));

            pager().setQueries(queries);
            pager().setCallbackBeforeLoad(function() {
                inventories.removeAll();
            });
            pager().setCallback(function(data) {
                var results = data.results;
                results.foreach(function(item) {
                    item.InventoryType = ko.observable(item.entityType.shortName);
                    inventories.push(item);
                });

                
                inventories.sort(function (left, right) {
                    return left.ID() == right.ID() ? 0 : (left.ID() > right.ID() ? -1 : 1);
                });
            });

            pager().changeAllData(false);
            return pager().load();
        };
        
        var loadSingleEntity = function (item) {
            var resourceName = item.entityType.defaultResourceName;
            var q = context.query(resourceName);

            var navigarions = [
               'Section',
               'Section.Parent',
               'Person',
               'RequestGood',
               'CreatedByUser'
            ];


            q = q.expand(navigarions);

            q = q.where('ID', '==', item.ID());

            context.executeQuery(q).then(function (data) {
                var results = data.results;
                current(results[0]);
            });
        };
        
        var loadSingleEntityDetail = function (item) {
            var resourceName = item.InventoryType() + 'Details';

            var q = context.query(resourceName);

            var navigarions = [
               "ItemGood"
            ];
            
            q = q.expand(navigarions);

            var preds = [];

            preds.push(context.predicate(item.InventoryType() + 'ID', '==', item.ID()));

            q = q.where(breeze.Predicate.and(preds));

            context.executeQuery(q).then(function (data) {
                var results = data.results;
            });
        };
    
        var selectDetail = function (item) {
            currentDetail(item);
        };
        var read = function (item) {
            loadSingleEntity(item);
            canShowMaster(true);
            viewController.selectViewByName('read');
        };

        var edit = function (item) {
            loadSingleEntity(item);
            canShowMaster(true);
            viewController.selectViewByName('edit');
        };

        var readToEdit = function () {
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

        var returnToList = function() {
            leaveEdit(function() {
                canShowMaster(false);
                canShowDetail(false);
                viewController.selectViewByName('list');
            });
        };

        var add = function(type) {
            var newEntity = context.addEntity(type, {
                No: 0,
                SectionID: null,
                PersonID: null,
                Date: new Date(),
                ShowDetail: true,
                Status: 'Temporary',
                InputType: 'Purchase',
                StockID: 1
            });
            current(newEntity);
            viewController.selectViewByName('edit');
        };

        var remove = function(item) {

        };

        var addDetail = function (item) {
            var initValue = {
                ItemGood: null,
                ItemGoodID: null,
            };

            initValue[item.InventoryType()] = item;
            initValue[item.InventoryType() + 'ID'] = item.ID();

            var newEntity = context.addEntity(item.InventoryType() + 'Detail', initValue);

            var sq = 0;
            item.InputDetails.foreach(function (rds) {
                sq += 1;
                rds.Row(sq);
            });
        };
        var removeDetail = function(item) {
            item[current().InventoryType()](null);
            item[current().InventoryType() + 'ID'](null);

            item.entityAspect.setDeleted();
        };
        
    var save = function () {
        if (hasChanges())
            context.saveChanges();
    };
    
    var cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            pager().loadLocally();
        }
    };

    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var pager = ko.observable();

    var canShowCurrentDetailFull = ko.observable(true);
        
    var canShowMaster = ko.observable(false);
    var canShowDetail = ko.observable(false);
        
    var changeShowMaster = function () {
        canShowMaster(!canShowMaster());
    };

    var changeShowDetail = function () {
        canShowDetail(!canShowDetail());
        loadSingleEntityDetail(current());
    };
        
    var getInventoryIcon = function (type) {
        var className = 'icon-' + type.toLowerCase();
        var obj = {};
        obj[className] = true;
        return obj;
    };
        return {
            activate: activate,
            canDeactivate: canDeactivate,
            deactivate: deactivate,
            attached: attached,
            title: '',
            hasChanges: hasChanges,
            inventories: inventories,
            inventoryTypes: inventoryTypes,
            current: current,
            currentDetail: currentDetail,
            pager: pager,
            init: init,
            loadSingleEntity: loadSingleEntity,
            selectDetail: selectDetail,
            read: read,
            edit: edit,
            add: add,
            addDetail: addDetail,
            remove: remove,
            removeDetail: removeDetail,
            save: save,
            cancel: cancel,
            viewController: viewController,
            returnToList: returnToList,
            returnToRead: returnToRead,
            readToEdit: readToEdit,
            canShowCurrentDetailFull: canShowCurrentDetailFull,
            canShowMaster: canShowMaster,
            canShowDetail: canShowDetail,
            changeShowMaster: changeShowMaster,
            changeShowDetail: changeShowDetail,
            getInventoryIcon: getInventoryIcon
        };


    });
   
