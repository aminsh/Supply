
define(['services/logger', 'durandal/app', 'plugins/router','services/common'],
function (logger, app, router,com) {

    var activate = function () {
        stockpager(new helper.pager(context, stocks));
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
    stocks = ko.observableArray([]),
    init = function () {
        var q = context.query('Stocks');

        stockpager().setQuery(q);
        stockpager().changeAllData(false);
        return stockpager().load();
    },
    add = function () {
        stocks.addEntity(context, 'Stock', '');
    },
    remove = function (item) {
        stocks.removeEntity(item);
    },
    save = function () {
        if (hasChanges())
            context.saveChanges();
    },
    cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            stockpager().loadLocally();
        }
    },
    context = helper.datacontext,
    hasChanges = context.hasChanges;
    stockpager = ko.observable()

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'انبار',
        hasChanges: hasChanges,
        stocks: stocks,
        stockpager: stockpager,
        init: init,
        add: add,
        remove: remove,
        save: save,
        cancel: cancel
    };


});
