define(['plugins/dialog', 'knockout'], function (dialog, ko) {
    var purchasingOfficerSelect = function (dfd) {
        var self = this;
        self.dfd = dfd;
        self.context = helper.datacontext;
        
        self.list = ko.observableArray();
        self.selectedPurchasingOfficer = ko.observable();
        

        this.context.executeQuery(this.context.query('PurchasingOfficers'))
            .then(function (data) {
                self.list(data.results);
            });
    };

    purchasingOfficerSelect.prototype.attached = function() {

    };
    
    purchasingOfficerSelect.prototype.select = function (parent, item) {
        parent.selectedPurchasingOfficer(item);
    };
    
    purchasingOfficerSelect.prototype.ok = function () {
        if (isNullOrEmpty(this.selectedPurchasingOfficer())) return;
        this.dfd.resolve(this.selectedPurchasingOfficer());
        dialog.close(this);
    };

    
    purchasingOfficerSelect.prototype.canDeactivate = function () {
        return true;
    };

    purchasingOfficerSelect.show = function () {
        var dfd = $.Deferred();
        dialog.show(new purchasingOfficerSelect(dfd));
        return dfd.promise();
    };

    purchasingOfficerSelect.prototype.close = function() {
        dialog.close(this);
    };
    
    return purchasingOfficerSelect;
});