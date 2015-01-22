
define(['services/logger', 'durandal/app', 'plugins/router', 'services/viewController','services/common'],
function (logger, app, router, viewController,com) {

    var activate = function () {
        itemFoodpager(new helper.pager(context, itemFoods));
        return init();
    },
    canDeactivate = function () {
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
    },
    deactivate = function () {
        com.deactivate();
    },
    attached = function () {
       
    },
    itemFoods = ko.observableArray([]),
    titleSearch = ko.observable(''),
    init = function () {
        var q = context.query('ItemFoods');
        q = q.expand('Scale');
        
        if (titleSearch() != '') {
            q = q.where('Title', 'contains', titleSearch());
        }
        
        itemFoodpager().setQuery(q);
        itemFoodpager().changeAllData(false);
        return itemFoodpager().load();
    },
    add = function () {
        itemFoods.addEntity(context, 'ItemFood', {});
    },
    remove = function (item) {
        itemFoods.removeEntity(item);
    },
    save = function () {
        if (hasChanges())
            context.saveChanges();
    },
    cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            itemFoodpager().loadLocally();
        }
    },
    context = helper.datacontext,
    hasChanges = context.hasChanges,
    itemFoodpager = ko.observable()

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        attached: attached,
        title: 'خدمات مواد غذایی',
        itemFoods: itemFoods,
        itemFoodpager: itemFoodpager,
        titleSearch: titleSearch,
        hasChanges: hasChanges,
        init: init,
        add: add,
        remove: remove,
        save: save,
        cancel: cancel,
        viewController: viewController
    };


});
