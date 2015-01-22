define(['plugins/dialog', 'knockout'], function (dialog, ko) {
    var subjectSelect2 = function (master) {
        var self = this;
        self.context = helper.datacontext;
        self.subjects = ko.observableArray();
        self.master = master;
        
        var q = self.context.query('Subjects');

        self.context.executeQuery(q).then(function (data) {
            var results = data.results;
            results.foreach(function (item) {
                item.isSelected = ko.observable(false);
            });

            var used = self.master.RolePermits();
            var notUsed = results.filter(function (item) {
                return !used.any(function(u) {
                    return item == u.Subject();
                });
            });
            
            self.subjects(notUsed);
        });
    };

    subjectSelect2.prototype.canDeactivate = function () {
        return true;
    };


    subjectSelect2.prototype.confirm = function() {
        var self = this;

        if (!self.subjects.any(function (item) {
            return item.isSelected();
        })) return;

        var selectedSubjects = self.subjects.filter(function (item) {
            return item.isSelected();
        });
        selectedSubjects.foreach(function (item) {
            self.context.addEntity('RolePermit', {
                Role: self.master,
                RoleID: self.master.ID(),
                Subject: item,
                SubjectID: item.ID()
            });
        });
        self.close();
    };
    
    subjectSelect2.show = function (master) {
        return dialog.show(new subjectSelect2(master));
    };

    subjectSelect2.prototype.close = function() {
        dialog.close(this);
    };
    
    return subjectSelect2;
});