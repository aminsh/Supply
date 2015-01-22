define(['services/logger',
  'services/common',
  'durandal/app',
  'plugins/router',
  'services/viewController',
  'modal/userSelect'],
function (logger, com, app, router, viewController,userSelect) {

    var activate = function () {
        requestDefineSteppager(new helper.pager(context, requestDefineSteps));
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

    var requestTypes = [
        { name: 'Good', title: 'کالا' },
        { name: 'Food', title: 'میوه و  شیرینی' },
        { name: 'Service', title: 'خدمات' },
        { name: 'Ticket', title: 'بلیط' },
        { name: 'Vehicle', title: 'نقلیه' }
    ];
    
    var views = ['FirstExpert', 'OrderExpert', 'PurchasingOfficer', 'Approval', 'ExpertGood'];
    
    var requestDefineSteps = ko.observableArray([]);

    
    var init = function () {
        var q = context.query('RequestDefineSteps');
        
        var navigarions = [
            "HandlerUsers.User"
        ];

        q = q.expand(navigarions);

        requestDefineSteppager().setQuery(q);
        requestDefineSteppager().setCallback(function (data) {
            var results = data.results;
            results.foreach(function(item) {
                var subRequestTypes = requestTypes.select(function(type) {
                    return {
                        name: type.name,
                        title: type.title,
                        isSelected: ko.observable(false)
                    };
                });
                if (!isNullOrEmpty(item.RequestTypes())) {
                    item.RequestTypes().split(';').foreach(function(type) {
                        subRequestTypes.first(function(s) {
                            return s.name == type;
                        }).isSelected(true);
                    });
                }
               
                item.RequestTypesX = ko.observableArray(subRequestTypes);
            });
            requestDefineSteps(results);
            requestDefineSteps.sort(function (left, right) {
                return left.Ordering() == right.Ordering() ? 0 : (left.Ordering() < right.Ordering() ? -1 : 1);
            });

            if (callback) callback();
        });
        
        requestDefineSteppager().changeAllData(false);
        return requestDefineSteppager().load();
    };


    var add = function() {
        var subRequestTypes = requestTypes.select(function(type) {
            return {
                name: type.name,
                title: type.title,
                isSelected: ko.observable(false)
            };
        });

        var newEntity = context.addEntity('RequestDefineStep', {});

        newEntity.RequestTypesX = ko.observableArray(subRequestTypes);
        requestDefineSteps.push(newEntity);
    };

    var remove = function (item) {
        requestDefineSteps.removeEntity(item);
    };

    var save = function () {
        if (hasChanges()) {
            requestDefineSteps.foreach(function (item) {
                item.RequestTypes(changeRequestType(item.RequestTypesX));
            });
            context.saveChanges();
        } 
    };
    
    var cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            requestDefineSteppager().loadLocally();
        }
    };

    var selectHandlerUser = function(item) {
        userSelect.show(item);
    };

    var removeUser = function(item) {
        item.RequestDefineStep(null);
        item.RequestDefineStepID(null);

        item.entityAspect.setDeleted();

        context.manager.saveChanges([item]);
    };
    
    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var requestDefineSteppager = ko.observable();

    var changeRequestType = function (items) {
        var types = [];
        items.foreach(function (item) {
            if (item.isSelected())
                types.push(item.name);
        });

        return types.join(';');
    };

    var afterSelectRequestType = function(parent,item) {
        parent.RequestTypes(changeRequestType(parent.RequestTypesX()));
    };
    
    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'تعریف مراحل',
        hasChanges: hasChanges,
        requestDefineSteps: requestDefineSteps,
        requestDefineSteppager: requestDefineSteppager,
        init: init,
        add: add,
        remove: remove,
        save: save,
        cancel: cancel,
        viewController: viewController,
        selectHandlerUser: selectHandlerUser,
        removeUser: removeUser,
        afterSelectRequestType: afterSelectRequestType,
        views: views
    };


});
   
