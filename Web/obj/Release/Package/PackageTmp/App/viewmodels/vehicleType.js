
define(['services/logger', 'durandal/app', 'plugins/router', 'services/common'],
function (logger, app, router,com) {

    var activate = function () {
        vehicleTypepager(new helper.pager(context, vehicleTypes));
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
    vehicleTypes = ko.observableArray([]),
    init = function () {
        var q = context.query('VehicleTypes');

        vehicleTypepager().setQuery(q);
        vehicleTypepager().changeAllData(false);
        return vehicleTypepager().load();
    },
    add = function () {
        vehicleTypes.addEntity(context, 'VehicleType', '');
    },
    remove = function (item) {
        vehicleTypes.removeEntity(item);
    },
    save = function () {
        if (hasChanges())
            context.saveChanges();
    },
    cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            vehicleTypepager().loadLocally();
        }
    },
    context = helper.datacontext,
    hasChanges = context.hasChanges,
    vehicleTypepager = ko.observable()

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'نوع وسیله نقلیه',
        hasChanges: hasChanges,
        vehicleTypes: vehicleTypes,
        vehicleTypepager: vehicleTypepager,
        init: init,
        add: add,
        remove: remove,
        save: save,
        cancel: cancel
    };


});
