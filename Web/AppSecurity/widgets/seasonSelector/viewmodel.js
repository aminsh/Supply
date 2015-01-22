define(['durandal/composition', 'jquery'], function (composition, $) {
    var ctor = function() {
        
    };
   
    ctor.prototype.activate = function (settings) {
        this.settings = settings;

        if (!settings.hasOwnProperty('minDate'))
            this.settings.minDate = ko.observable();
        
        if (!settings.hasOwnProperty('maxDate'))
            this.settings.maxDate = ko.observable();
        
        var seasons = helper.date.seasons;
        
        seasons.foreach(function (s) {
            s.isSelected = ko.observable(false);
        });
        
        this.settings.seasons = ko.observableArray(seasons);
    };
    
    ctor.prototype.selectItem = function (parent, item) {
        parent.settings.seasons.foreach(function (s) {
            s.isSelected(false);
        });

        item.isSelected(true);

        var dateRange = helper.date.seasonDateRange(item.key);
        parent.settings.minDate(dateRange.minDate);
        parent.settings.maxDate(dateRange.maxDate);
    };
    
    return ctor;
});