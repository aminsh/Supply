define(['plugins/dialog', 'knockout', 'durandal/app'], function (dialog, ko,app) {
    var subjectSelect = function (master) {
        var self = this;
        self.context = helper.datacontext;
        self.subjects = ko.observableArray();
        self.master = master;
        
        var q = self.context.query('Subjects');

        self.context.executeQuery(q).then(function (data) {
            var results = data.results;
            results.foreach(function(item) {
                item.isSelected = ko.observable(false);
            });
            
            
            self.subjects(results);
        });

    };

    subjectSelect.prototype.close = function () {
        dialog.close(this);
    };
    
    subjectSelect.prototype.ok = function () {
        var self = this;

        if (self.subjects.any(function(item) {
            return item.isSelected();
        })) return;
        
        var selectedSubjects = self.subjects.filter(function (item) {
            return item.isSelected();
        });
        selectedSubjects.foreach(function (item) {
            context.addEntity('RolePermit', {
                Role: self.master(),
                RoleID: self.master().ID(),
                Subject: item,
                SubjectID: item.ID()
            });
        });
        self.close();
    };

    subjectSelect.prototype.canOk = function() {
        return this.subjects.any(function(item) {
            return item.isSelected();
        });
    };
    
    subjectSelect.prototype.canDeactivate = function () {
        
    };

    subjectSelect.show = function (master) {
        return dialog.show(new subjectSelect(master));
    };

    return subjectSelect;
});