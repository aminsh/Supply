
define(['services/logger', 'durandal/app', 'plugins/router', 'services/common'],
function (logger, app, router,com) {

    var activate = function () {
        vehiclepager(new helper.pager(context, vehicles));
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
    vehicles = ko.observableArray([]),
    init = function () {
        var q = context.query('Vehicles');
        q = q.expand('VehicleType,Driver');
        
        vehiclepager().setQuery(q);
        vehiclepager().changeAllData(false);
        return vehiclepager().load();
    },
    add = function () {
        //var q = context.query('VehicleTypes');
        //context.executeQuery(q).then(function(data) {
        //    vehicles.addEntity(context, 'Vehicle', { DriverID: 1, VehicleTypeID: 1, VehicleType: data.results[0] });
        //});
        vehicles.addEntity(context, 'Vehicle', { VehicleTypeID: null, DriverID: null });

    },
    remove = function (item) {
        vehicles.removeEntity(item);
    },
    save = function () {
        if (hasChanges())
            context.saveChanges();
    },
    cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            vehiclepager().loadLocally();
        }
    },
    context = helper.datacontext,
    hasChanges = context.hasChanges,
    vehiclepager = ko.observable()

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'وسیله نقلیه',
        hasChanges:hasChanges,
        vehicles: vehicles,
        vehiclepager: vehiclepager,
        init: init,
        add: add,
        remove: remove,
        save: save,
        cancel: cancel,
        context: context
    };


});
