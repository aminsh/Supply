
define(['services/logger', 'durandal/app', 'plugins/router'],
function (logger, app, router) {

    var activate = function() {
        everyonepager(new helper.pager(context, everyones));
        return init();
    },
        canDeactivate = function() {
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
        deactivate = function() {
            //('.k-window, .k-overlay').remove();
        },
        viewAttached = function() {
        },
        everyones = ko.observableArray([]),
        init = function() {
            var q = context.query('Everyones');

            everyonepager().setQuery(q);
            everyonepager().changeAllData(false);
            return everyonepager().load();
        },
        add = function() {
            everyones.addEntity(context, 'Everyone', '');
        },
        remove = function(item) {
            everyones.removeEntity(item);
        },
        save = function() {
            if (hasChanges())
                context.saveChanges();
        },
        cancel = function() {
            if (hasChanges()) {
                context.cancelChanges();
                everyonepager().loadLocally();
            }
        },
        context = helper.datacontext,
        hasChanges = context.hasChanges,
        everyonepager = ko.observable()

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'اشخاص',
        hasChanges: hasChanges,
        everyones: everyones,
        everyonepager: everyonepager,
        init: init,
        add: add,
        remove: remove,
        save: save,
        cancel: cancel
    };


});
