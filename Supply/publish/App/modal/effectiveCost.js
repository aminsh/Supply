define(['plugins/dialog', 'knockout'], function (dialog, ko) {
    var effectiveCost = function (master) {
        this.context = helper.datacontext;
        //this.masterType = type;
        //this.masterName = name;
        this.master = ko.observable(master);
        this.masterName = master.entityType.shortName; //like RequestGood , RequestDetailGood
        this.requestType = this.masterName.replaceAll('Request', '').replaceAll('Detail', '');
        this.masterType = this.masterName.contains('Detail') ? 'detail' : 'master';  //master || detail
        this.list = master['EffectiveCost' + this.requestType + (this.masterType === 'detail' ? 'Detail' : '') + 's'];
        this.sumValue = master['SumEffectiveCost' + this.requestType + (this.masterType === 'detail' ? 'Detail' : '') + 's'];
    };

    effectiveCost.prototype.attached = function() {

    };
    
    effectiveCost.prototype.add = function () {
        var initValue = {
            CostType: null,
            CostTypeID: null,
        };

        initValue[this.masterName + 'ID'] = this.master().ID();
        initValue[this.masterName] = this.master();
        var entityName = 'EffectiveCost'
            + this.requestType
            + (this.masterType === 'detail' ? 'Detail' : '');
        var newEntity = this.context.addEntity(entityName, initValue);
    };

    effectiveCost.prototype.remove = function(parent,item) {
        item[parent.masterName](null);
        item[parent.masterName + 'ID'](null);

        item.entityAspect.setDeleted();
    };
    
    effectiveCost.prototype.canDeactivate = function () {
        return true;
    };

    effectiveCost.show = function (master) {
        return dialog.show(new effectiveCost(master));
    };

    effectiveCost.prototype.close = function() {
        dialog.close(this);
    };
    
    return effectiveCost;
});