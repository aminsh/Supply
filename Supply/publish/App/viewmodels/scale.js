
define(['services/logger', 'durandal/app', 'plugins/router', 'services/common'],
function (logger, app, router,com) {

    var activate = function () {
        scalepager(new helper.pager(context, scales));
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
    scales = ko.observableArray([]),
    init = function () {
        var q = context.query('Scales');

        scalepager().setQuery(q);
        scalepager().changeAllData(false);
        return scalepager().load();
    },
    add = function () {
        scales.addEntity(context, 'Scale', '');
    },
    remove = function (item) {
        scales.removeEntity(item);
    },
    save = function () {
        if (hasChanges())
            context.saveChanges();
    },
    cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            scalepager().loadLocally();
        }
    },
    context = helper.datacontext,
    hasChanges = context.hasChanges,
    scalepager = ko.observable()

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'واحد اندازه گیری',
        hasChanges: hasChanges,
        scales: scales,
        scalepager: scalepager,
        init: init,
        add: add,
        remove: remove,
        save: save,
        cancel: cancel
    };


});
