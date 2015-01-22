define(['plugins/dialog', 'knockout'], function (dialog, ko) {
    var createOutput = function (master) {
        this.context = helper.datacontext;
        
        this.master = ko.observable(master);
        this.list = ko.observableArray();

        var goodForOutputEntities = master.RequestDetailGoods.filter(
            function (rdg) {
                if (rdg.IsOrder())
                    return !isNullOrEmpty(rdg.DoneDate()) && rdg.Qty() <= rdg.InventoryQty() && isNullOrEmpty(rdg.OutputDetailID());
                
                return isNullOrEmpty(rdg.OutputDetailID()) && rdg.Qty() <= rdg.InventoryQty(); 
                //rdg.IsOrder() && rdg.DoneDate() && isNullOrEmpty(rdg.OutputDetailID());
            }).select(function(rdg) {
                return {
                    ID: rdg.ID,
                    ItemGood: rdg.ItemGood,
                    Qty: rdg.Qty,
                    isSelected: ko.observable(true)
                };
            });
        
        this.list(goodForOutputEntities);
        var self = this;
        this.canSubmit = ko.computed(function() {
            if (isNullOrEmpty(self.list))
                return false;
            return self.list.any(function (item) {
                return item.isSelected();
            });
        });
    };

    createOutput.prototype.attached = function() {

    };
    
    createOutput.prototype.submit = function () {
        if (!this.canSubmit()) return;
        
        var rds = this.list.filter(
            function(item) {
                return item.isSelected();
            }).select(
                function(item) {
                    return item.ID();
                }).join(';');
        
        var q = this.context.query('CreateNewOutput');
        q = q.withParameters({ requestGoodId: this.master().ID(), requestDetail: rds });

        var self = this;
        this.context.executeQuery(q).then(
            function () {
                helper.note.successDefault();
                self.close();
            });

    };

    
    createOutput.prototype.canDeactivate = function () {
        return true;
    };

    createOutput.show = function (master) {
        return dialog.show(new createOutput(master));
    };

    createOutput.prototype.close = function() {
        dialog.close(this);
    };
    
    return createOutput;
});