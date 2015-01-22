
define(['services/logger', 'durandal/app', 'plugins/router','services/common'],
function (logger, app, router,com) {

    var activate = function () {
        purchasingOfficerpager(new helper.pager(context, purchasingOfficers));
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
    purchasingOfficers = ko.observableArray([]),
    init = function () {
        var q = context.query('PurchasingOfficers');

        q = q.expand('Employee');

        purchasingOfficerpager().setQuery(q);
        purchasingOfficerpager().changeAllData(false);
        return purchasingOfficerpager().load();
    },
    add = function () {
        purchasingOfficers.addEntity(context, 'PurchasingOfficer',
            {
                Employee: null,
                EmployeeID: null
            });
    },
    remove = function (item) {
        purchasingOfficers.removeEntity(item);
    },
    save = function () {
        if (hasChanges())
            context.saveChanges();
    },
    cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            purchasingOfficerpager().loadLocally();
        }
    },
    context = helper.datacontext,
    hasChanges = context.hasChanges,
    purchasingOfficerpager = ko.observable()

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'کارپرداز',
        hasChanges: hasChanges,
        purchasingOfficers: purchasingOfficers,
        purchasingOfficerpager: purchasingOfficerpager,
        init: init,
        add: add,
        remove: remove,
        save: save,
        cancel: cancel
    };


});
