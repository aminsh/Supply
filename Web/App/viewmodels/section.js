
define(['services/logger', 'durandal/app', 'plugins/router', 'services/common'],
function (logger, app, router,com) {

    var activate = function () {
        sectionpager(new helper.pager(context, sections));
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
    sections = ko.observableArray([]),
    titleSearch = ko.observable(''),
    init = function () {
        var q = context.query('Sections');

        if (titleSearch() != '') {
            q = q.where('Title', 'contains', titleSearch());
        }
        
        sectionpager().setQuery(q);
        sectionpager().changeAllData(false);
        return sectionpager().load();
    },
    add = function () {
        sections.addEntity(context, 'Section', '');
    },
    remove = function (item) {
        sections.removeEntity(item);
    },
    save = function () {
        if (hasChanges())
            context.saveChanges();
    },
    cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            sectionpager().loadLocally();
        }
    },
    context = helper.datacontext,
    hasChanges = context.hasChanges
    sectionpager = ko.observable()

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'قسمت',
        hasChanges: hasChanges,
        sections: sections,
        titleSearch: titleSearch,
        sectionpager: sectionpager,
        init: init,
        add: add,
        remove: remove,
        save: save,
        cancel: cancel
    };


});
