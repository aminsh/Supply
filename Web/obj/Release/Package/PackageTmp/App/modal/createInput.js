define(['plugins/dialog', 'knockout'], function (dialog, ko) {
    var createInput = function (master) {
        this.context = helper.datacontext;
        
        this.master = ko.observable(master);
        this.list = ko.observableArray();

        var goodForInputEntities = master.RequestDetailGoods.filter(
            function(rdg) {
                return rdg.IsOrder() && rdg.DoneDate() && isNullOrEmpty(rdg.InputDetailID());
            }).select(function(rdg) {
                return {
                    ID: rdg.ID,
                    ItemGood: rdg.ItemGood,
                    Qty: rdg.Qty,
                    isSelected: ko.observable(true)
                };
            });
        
        this.list(goodForInputEntities);
        var self = this;
        this.canSubmit = ko.computed(function() {
            if (isNullOrEmpty(self.list))
                return false;
            return self.list.any(function (item) {
                return item.isSelected();
            });
        });
    };

    createInput.prototype.attached = function() {

    };
    
    createInput.prototype.submit = function () {
        if (!this.canSubmit()) return;
        
        var rds = this.list.filter(
            function(item) {
                return item.isSelected();
            }).select(
                function(item) {
                    return item.ID();
                }).join(';');
        
        var q = this.context.query('CreateNewInput');
        q = q.withParameters({ requestGoodId: this.master().ID(), requestDetail: rds });

        var self = this;
        this.context.executeQuery(q).then(
            function () {
                helper.note.successDefault();
                self.close();
            });

    };

    
    createInput.prototype.canDeactivate = function () {
        return true;
    };

    createInput.show = function (master) {
        return dialog.show(new createInput(master));
    };

    createInput.prototype.close = function() {
        dialog.close(this);
    };
    
    return createInput;
});