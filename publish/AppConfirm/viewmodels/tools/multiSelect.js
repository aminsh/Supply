
define(['services/logger', 'durandal/app', 'plugins/router'],
function (logger, app, router) {

    var multiSelect = {
        lookups: ko.observableArray(),
        lookupTerm: ko.observable(),
        displayProp: '',
        context: null,
        expand: null,
        entityName: '',
        pluralEntityName: '',
        goals: null
    };

    multiSelect.init = function (entityName, pluralEntityName, displayProp,goals, context) {
        multiSelect.entityName = entityName;
        multiSelect.pluralEntityName = pluralEntityName;
        multiSelect.displayProp = displayProp;
        multiSelect.goals = goals;
        multiSelect.context = context || helper.datacontext;
    };

    multiSelect.doSearch = function() {
        var q = multiSelect.context.query(multiSelect.pluralEntityName);
        q = q.where(multiSelect.getPred());
        q = q.take(20);

        multiSelect.context.executeQuery(q).then(function (data) {
            data.results.foreach(function(item) {
                item.FullName = ko.computed(function () {
                    var display = '';
                    multiSelect.displayProp.split(',').foreach(function (p) {
                        display += display === '' ? item[p]() : ' ' + item[p]();
                    });

                    return display;
                });
            });
            multiSelect.lookups(data.results);
        });
    };

    multiSelect.getPred = function() {
        var preds = [];
        multiSelect.displayProp.split(',').foreach(function (p) {
            preds.push(breeze.Predicate.create(p, "contains", multiSelect.lookupTerm()));
        });
        var pred = breeze.Predicate.or(preds);
        return pred;
    };

    multiSelect.selectItem = function (item) {
        if (!multiSelect.goals().any(function(g) {
            return g == item;
        }))
            multiSelect.goals.push(item);
    };

    multiSelect.removeItem = function(item) {
        multiSelect.goals.remove(item);
    };

    multiSelect.display = function(item) {
        return item.Title;
    };
    return multiSelect;


});
