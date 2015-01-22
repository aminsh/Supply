
define(['services/logger', 'durandal/app', 'plugins/router', 'services/viewController', 'services/common'],
function (logger, app, router, viewController,com) {

    var activate = function () {
        itemServicepager(new helper.pager(context, itemServices));
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
    viewAttached = function () {
    },
    itemServices = ko.observableArray([]),
    titleSearch = ko.observable(''),
    init = function () {
        var q = context.query('ItemServices');
        q = q.expand('Scale');
        
        if (titleSearch() != '') {
            q = q.where('Title', 'contains', titleSearch());
        }

        
        itemServicepager().setQuery(q);
        itemServicepager().changeAllData(false);
        return itemServicepager().load();
    },
    add = function () {
        itemServices.addEntity(context, 'ItemService', {});
    },
    remove = function (item) {
        itemServices.removeEntity(item);
    },
    save = function () {
        if (hasChanges())
            context.saveChanges();
    },
    cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            itemServicepager().loadLocally();
        }
    },
    context = helper.datacontext,
    hasChanges = context.hasChanges,
    itemServicepager = ko.observable()

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'انواع خدمات',
        itemServices: itemServices,
        itemServicepager: itemServicepager,
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
