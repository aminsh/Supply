
define(['services/logger', 'durandal/app', 'plugins/router', 'services/common'],
function (logger, app, router,com) {

    var activate = function () {
        periodpager(new helper.pager(context, periods));
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
    periods = ko.observableArray([]),
    init = function () {
        var q = context.query('Periods');

        periodpager().setQuery(q);
        periodpager().changeAllData(false);
        return periodpager().load();
    },
    add = function () {
        periods.addEntity(context, 'Period', {
            DateFrom: new Date,
            DateTo: new Date
        });
    },
    remove = function (item) {
        periods.removeEntity(item);
    },
    save = function () {
        if (hasChanges())
            context.saveChanges();
    },
    cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            periodpager().loadLocally();
        }
    },
    context = helper.datacontext,
    hasChanges = context.hasChanges,
    periodpager = ko.observable()

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'دوره',
        hasChanges: hasChanges,
        periods: periods,
        periodpager: periodpager,
        init: init,
        add: add,
        remove: remove,
        save: save,
        cancel: cancel
    };


});
