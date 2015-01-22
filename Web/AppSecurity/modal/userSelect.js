define(['plugins/dialog', 'knockout', 'durandal/app'], function (dialog, ko,app) {
    var userSelect = function (master) {
        var self = this;
        self.context = helper.datacontext;
        self.users = ko.observableArray();
        self.master = master;
        
        var q = self.context.query('Users');

        self.context.executeQuery(q).then(function (data) {
            var results = data.results;
            results.foreach(function(item) {
                item.isSelected = ko.observable(false);
            });
            self.users(results);
        });

    };

    userSelect.prototype.close = function () {
        dialog.close(this);
    };
    
    userSelect.prototype.ok = function () {
        var self = this;

        if (!self.users.any(function (item) {
            return item.isSelected();
        })) return;
        
        var selectedUsers = self.users.filter(function (item) {
            return item.isSelected();
        });

        selectedUsers.foreach(function(item) {
            self.context.addEntity('RequestDefineStepUser', {
                User: item,
                UserID: item.ID(),
                RequestDefineStep: self.master,
                RequestDefineStepID: self.master.ID()
            });
        });
        //self.master.HandlerUsers(selectedUsers);
        self.close();
    };

    userSelect.prototype.canOk = function() {
        return this.users.any(function(item) {
            return item.isSelected();
        });
    };
    
    userSelect.prototype.canDeactivate = function () {
        return true;
    };

    userSelect.show = function (master) {
        return dialog.show(new userSelect(master));
    };

    return userSelect;
});