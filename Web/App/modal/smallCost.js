define(['plugins/dialog', 'knockout'], function (dialog, ko) {
    var smallCost = function (master) {
        this.context = helper.datacontext;
        //this.masterType = type;
        //this.masterName = name;
        this.master = ko.observable(master);
        this.masterName = master.entityType.shortName; //like RequestGood , RequestDetailGood
        this.requestType = this.masterName.replaceAll('Request', '').replaceAll('Detail', '');
        this.masterType = this.masterName.contains('Detail') ? 'detail' : 'master';  //master || detail
        this.list = master['SmallCost' + this.requestType + (this.masterType === 'detail' ? 'Detail' : '') + 's'];
        this.sumValue = master['SumSmallCost' + this.requestType + (this.masterType === 'detail' ? 'Detail' : '') + 's'];
    };

    smallCost.prototype.attached = function() {

    };
    
    smallCost.prototype.add = function () {
        var initValue = {};

        initValue[this.masterName + 'ID'] = this.master().ID();
        initValue[this.masterName] = this.master();
        var entityName = 'SmallCost'
            + this.requestType
            + (this.masterType === 'detail' ? 'Detail' : '');
        var newEntity = this.context.addEntity(entityName, initValue);
    };

    smallCost.prototype.remove = function(parent,item) {
        item[parent.masterName](null);
        item[parent.masterName + 'ID'](null);

        item.entityAspect.setDeleted();
    };
    
    smallCost.prototype.canDeactivate = function () {
        return true;
    };

    smallCost.show = function (master) {
        return dialog.show(new smallCost(master));
    };

    smallCost.prototype.close = function() {
        dialog.close(this);
    };
    
    return smallCost;
});