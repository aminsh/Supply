
define(['services/logger', 'durandal/app', 'plugins/router'],
function (logger, app, router) {

    var activate = function () {
        costTypepager(new helper.pager(context, costTypes));
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
        //('.k-window, .k-overlay').remove();
    },
    viewAttached = function () {
    },
    costTypes = ko.observableArray([]),
    init = function () {
        var q = context.query('CostTypes');

        costTypepager().setQuery(q);
        costTypepager().changeAllData(false);
        return costTypepager().load();
    },
    add = function () {
        costTypes.addEntity(context, 'CostType', '');
    },
    remove = function (item) {
        costTypes.removeEntity(item);
    },
    save = function () {
        if (hasChanges())
            context.saveChanges();
    },
    cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            costTypepager().loadLocally();
        }
    },
    context = helper.datacontext,
    hasChanges = context.hasChanges,
    costTypepager = ko.observable()

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'نوع هزینه',
        hasChanges: hasChanges,
        costTypes: costTypes,
        costTypepager: costTypepager,
        init: init,
        add: add,
        remove: remove,
        save: save,
        cancel: cancel
    };


});
