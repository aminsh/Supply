
      
define(['services/logger',
  'services/common',
  'durandal/app',
  'plugins/router',
  'services/viewController'],
function (logger, com, app, router, viewController) {

    var activate = function () {
        userDefinedCategorypager(new helper.pager(context, userDefinedCategories));
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

    var userDefinedCategories = ko.observableArray([]);
    
    var init = function () {
        var q = context.query('UserDefinedCategories');
        
        var navigarions = [
            ""
        ];

        q = q.expand(navigarions);

        userDefinedCategorypager().setQuery(q);
        userDefinedCategorypager().changeAllData(false);
        return userDefinedCategorypager().load();
    };
    
    
    var add = function () {
        userDefinedCategories.addEntity(context, 'UserDefinedCategory',
            {
                
            });
    };

    var remove = function (item) {
        userDefinedCategories.removeEntity(item);
    };

    var save = function () {
        if (hasChanges())
            context.saveChanges();
    };
    
    var cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            userDefinedCategorypager().loadLocally();
        }
    };

    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var userDefinedCategorypager = ko.observable();

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'دسته بندی سفارشی',
        hasChanges: hasChanges,
        userDefinedCategories: userDefinedCategories,
        userDefinedCategorypager: userDefinedCategorypager,
        init: init,
        add: add,
        remove: remove,
        save: save,
        cancel: cancel,
        viewController: viewController
};


});
   
