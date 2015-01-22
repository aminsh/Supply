
define(['services/logger', 'durandal/app', 'plugins/router'],
function (logger, app, router) {

    var activate = function () {
        driverpager(new helper.pager(context, drivers));
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
        $('.k-window, .k-overlay').remove();
    },
    viewAttached = function () {
    },
    drivers = ko.observableArray([]),
    init = function () {
        var q = context.query('Drivers');

        driverpager().setQuery(q);
        driverpager().changeAllData(false);
        return driverpager().load();
    },
    add = function () {
        drivers.addEntity(context, 'Driver', '');
    },
    remove = function (item) {
        drivers.removeEntity(item);
    },
    save = function () {
        if (hasChanges())
            context.saveChanges();
    },
    cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            driverpager().loadLocally();
        }
    },
    context = helper.datacontext,
    hasChanges = context.hasChanges,
    driverpager = ko.observable()

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'راننده',
        hasChanges: hasChanges,
        drivers: drivers,
        driverpager: driverpager,
        init: init,
        add: add,
        remove: remove,
        save: save,
        cancel: cancel
    };


});
