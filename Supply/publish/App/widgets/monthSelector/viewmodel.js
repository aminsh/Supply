define(['durandal/composition', 'jquery'], function (composition, $) {
    var ctor = function() {
        
    };
   
    ctor.prototype.activate = function (settings) {
        this.settings = settings;

        if (!settings.hasOwnProperty('minDate'))
            this.settings.minDate = ko.observable();
        
        if (!settings.hasOwnProperty('maxDate'))
            this.settings.maxDate = ko.observable();
        var months = helper.date.persianMonths;

        months.foreach(function(month) {
            month.isSelected = ko.observable(false);
        });
        
        
        this.settings.months = months;
        
        var seasons = helper.date.seasons;

        seasons.foreach(function(s) {
            s.months = ko.observableArray();
        });

        seasons[0].months.push(months[0]);
        seasons[0].months.push(months[1]);
        seasons[0].months.push(months[2]);
        
        seasons[1].months.push(months[3]);
        seasons[1].months.push(months[4]);
        seasons[1].months.push(months[5]);
        
        seasons[2].months.push(months[6]);
        seasons[2].months.push(months[7]);
        seasons[2].months.push(months[8]);
        
        seasons[3].months.push(months[9]);
        seasons[3].months.push(months[10]);
        seasons[3].months.push(months[11]);
        this.settings.seasons = ko.observableArray(seasons);
        
    };
    
    ctor.prototype.selectItem = function (parent, item) {
        parent.settings.months.foreach(function (month) {
            month.isSelected(false);
        });

        item.isSelected(true);

        var dateRange = helper.date.monthDateRange(item.key);
        parent.settings.minDate(dateRange.minDate);
        parent.settings.maxDate(dateRange.maxDate);
    };
    
    return ctor;
});