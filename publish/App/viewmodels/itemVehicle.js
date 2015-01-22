
define(['services/logger', 'durandal/app', 'plugins/router', 'services/viewController','services/common'],
function (logger, app, router, viewController,com) {

    var activate = function () {
        itemVehiclepager(new helper.pager(context, itemVehicles));
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
    itemVehicles = ko.observableArray([]),
    titleSearch = ko.observable(''),
    init = function () {
        var q = context.query('ItemVehicles');
        q = q.expand('Scale');

        if (titleSearch() != '') {
            q = q.where('Title', 'contains', titleSearch());
        }

        itemVehiclepager().setQuery(q);
        itemVehiclepager().changeAllData(false);
        return itemVehiclepager().load();
    },
    add = function () {
        itemVehicles.addEntity(context, 'ItemVehicle', {ScaleID: null});
    },
    remove = function (item) {
        itemVehicles.removeEntity(item);
    },
    save = function () {
        if (hasChanges())
            context.saveChanges();
    },
    cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            itemVehiclepager().loadLocally();
        }
    },
    context = helper.datacontext,
    hasChanges = context.hasChanges,
    itemVehiclepager = ko.observable()

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'انواع خدمات نقلیه',
        itemVehicles: itemVehicles,
        itemVehiclepager: itemVehiclepager,
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
