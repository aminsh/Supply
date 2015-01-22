define(['durandal/system', 'plugins/router', 'services/logger'],
    function (system, router, logger) {

        var init = function() {
            var q = context.query('Periods');
            context.executeQuery(q).then(function(data) {
                var results = data.results;
                current(results.first(function(item) {
                    return item.IsActive() == true;
                }));

                periods(results);
            });
        };
        var context = helper.datacontext;
        var periods = ko.observableArray();
        var current = ko.observable();
        var canPeriodSelectorShow = ko.observable(false);

        var select = function(item) {
            current(item);
            var obj = ko.toJS(item);
            helper.defaults.setCurrentPeriod(obj);
        };

        var changeShow = function() {
            canPeriodSelectorShow(!canPeriodSelectorShow());
        };
        
        return {
            init: init,
            periods: periods,
            current: current,
            canPeriodSelectorShow: canPeriodSelectorShow,
            select: select,
            changeShow: changeShow
        };
    });