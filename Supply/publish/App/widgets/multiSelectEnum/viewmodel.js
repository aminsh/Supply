define(['durandal/composition', 'jquery'], function (composition, $) {
    var ctor = function () { };
    var sets;
    ctor.prototype.activate = function (settings) {
        this.settings = settings;
        this.settings.context = this.settings.context || helper.datacontext;
        settings.lookups = ko.observableArray();
        
        helper.ajax.get('getEnum', this.settings.enumType, function (data) {
            settings.lookups(data);
        });

        sets = this.settings;
    };
    
    ctor.prototype.selectItem = function (parent,item) {
        if (!parent.settings.goals().any(function (g) {
            return g == item;
        }))
            parent.settings.goals.push(item);
    };

    ctor.prototype.removeItem = function (parent,item) {
        parent.settings.goals.remove(item);
    };
    
    return ctor;
});