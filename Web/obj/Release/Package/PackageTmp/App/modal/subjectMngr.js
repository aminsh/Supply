define(['plugins/dialog', 'knockout', 'durandal/app'], function (dialog, ko,app) {
    var subjectMngr = function (callbackAfterClose) {
        var self = this;
        self.context = helper.datacontext;
        self.subjects = ko.observableArray();
        
        var q = self.context.query('Subjects');

        self.context.executeQuery(q).then(function (data) {
            var results = data.results;
            self.subjects(results);
        });

    };

    subjectMngr.prototype.close = function () {
        dialog.close(this);
    };
    
    subjectMngr.prototype.save = function () {
        this.context.manager.saveChanges(this.subjects())
            .then(function() {
                helper.note.successDefault();
            });
    };

    subjectMngr.prototype.canDeactivate = function () {
        var self = this;
        
        if (!self.hasChanges())
            return true;
        
        var title = 'آیا مایل به ادامه عملیات هستید ؟';
        var msg = 'بستن فرم و لغو تغییرات';

        return app.showMessage(title, msg, ['Yes', 'No'])
            .then(function () {
                self.subjects.foreach(function (item) {
                    item.entityAspect.rejectChanges();
                });
            });
    };

    subjectMngr.show = function (callbackAfterClose) {
        return dialog.show(new subjectMngr(callbackAfterClose));
    };

    subjectMngr.prototype.hasChanges = function() {
       return this.subjects.any(function(item) {
            return !item.entityAspect.entityState.isUnchanged();
        });
    };

    return subjectMngr;
});