define(['durandal/composition', 'jquery'], function (composition, $) {
    var ctor = function() {
        
    };
   
    ctor.prototype.activate = function (settings) {
        this.settings = settings;
        this.settings.context = this.settings.context || helper.datacontext;
        this.settings.lookups = ko.observableArray();
        this.settings.lookupTerm = ko.observable('');
        this.settings.canShowFullContent = ko.observable(true);
    };

    ctor.prototype.doSearch = function () {
        var q = this.settings.query || this.settings.context.query(this.settings.pluralEntityName);
        if (!isNullOrEmpty(this.settings.lookupTerm()))
            q = q.where(this.getPred());
        q = q.take(10);
        
        var displayProp = this.settings.displayProp;
        var lookups = this.settings.lookups;
        this.settings.context.executeQuery(q).then(function (data) {
            data.results.foreach(function (item) {
                item.FullName = ko.computed(function () {
                    var display = '';
                    displayProp.split(',').foreach(function (p) {
                        display += display === '' ? item[p]() : ' ' + item[p]();
                    });

                    return display;
                });
            });
            lookups(data.results);
        });
    };
    
    ctor.prototype.getPred = function () {
        var preds = [];
        var lookupTerm = this.settings.lookupTerm();
        this.settings.displayProp.split(',').foreach(function (p) {
            preds.push(breeze.Predicate.create(p, "contains", lookupTerm));
        });
        var pred = breeze.Predicate.or(preds);
        return pred;
    };
    
    ctor.prototype.selectItem = function (parent, item) {
        if (!parent.settings.goals().any(function (g) {
            return g == item;
        }))
            parent.settings.goals.push(item);
    };

    ctor.prototype.removeItem = function (parent,item) {
        parent.settings.goals.remove(item);
    };
    
    ctor.prototype.changeCanShowFullContent = function () {
        this.settings.canShowFullContent(!this.settings.canShowFullContent());
    };
    
    return ctor;
});