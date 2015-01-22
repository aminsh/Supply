define(['plugins/dialog', 'knockout', 'durandal/app'], function (dialog, ko,app) {
    var confirmCancel = function (currentDetail) {
        var self = this;
        self.context = helper.datacontext;
        self.currentDetail = currentDetail;
        self.cancelReason = ko.observable('');
    };

    confirmCancel.prototype.close = function () {
        dialog.close(this);
    };
    
    confirmCancel.prototype.ok = function () {
        this.currentDetail.IsCancel(true);
        this.currentDetail.CancelReason(this.cancelReason());
        dialog.close(this);
    };

    confirmCancel.prototype.canDeactivate = function () {
        return true;
    };

    confirmCancel.show = function (currentDetail) {
        return dialog.show(new confirmCancel(currentDetail));
    };
    
   
    return confirmCancel;
});