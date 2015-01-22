define(['services/logger', 'durandal/app', 'services/viewController', 'services/common']
    , function (logger, app, viewController,com) {

    var activate = function () {
        pager(new helper.pager(context, sellers));
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
    sellers = ko.observableArray([]),
    titleSearch = ko.observable(''),
    init = function () {
        var q = context.query('Sellers');
        
        if (titleSearch() != '') {
            q = q.where('Title', 'contains', titleSearch());
        }
        
        pager().setQuery(q);
        pager().changeAllData(false);
        return pager().load();
    },
    add = function () {
        sellers.addEntity(context, 'Seller');
    },
    remove = function (item) {
        sellers.removeEntity(item);
    },
    save = function () {
        if (hasChanges())
            context.saveChanges();
    },
    cancel = function () {
        if (hasChanges())
            context.cancelChanges();

        pager().loadLocally();
    },
    context = helper.datacontext,
    hasChanges = context.hasChanges,
    pager = ko.observable(),
    viewAttached = function () {
        
    }

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'فروشنده',
        hasChanges: hasChanges,
        sellers: sellers,
        init: init,
        add: add,
        remove: remove,
        save: save,
        cancel: cancel,
        pager: pager,
        viewController: viewController,
        titleSearch: titleSearch
    };


});