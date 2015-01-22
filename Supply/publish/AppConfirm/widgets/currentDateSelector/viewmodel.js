define(['durandal/composition', 'jquery'], function (composition, $) {
    var ctor = function() {
        
    };
   
    ctor.prototype.activate = function (settings) {
        this.settings = settings;

        if (!settings.hasOwnProperty('minDate'))
            this.settings.minDate = ko.observable();
        
        if (!settings.hasOwnProperty('maxDate'))
            this.settings.maxDate = ko.observable();

        this.settings.currents = ko.observableArray([
            { name: 'currentYear', title: 'سال جاری', isSelected: ko.observable(false) },
            { name: 'currentSeason', title: 'فصل جاری', isSelected: ko.observable(false) },
            { name: 'currentMonth', title: 'ماه جاری', isSelected: ko.observable(false) },
            { name: 'currentWeek', title: 'هفته جاری', isSelected: ko.observable(false) },
            { name: 'Today', title: 'امروز', isSelected: ko.observable(false) }
        ]);
    };
    
    ctor.prototype.selectItem = function (parent, item) {
        parent.settings.currents.foreach(function (c) {
            c.isSelected(false);
        });

        item.isSelected(true);
        var dateRange;
        if (item.name == 'currentYear')
            dateRange = helper.date.currentYear();
        if (item.name == 'currentSeason')
            dateRange = helper.date.currentSeason();
        if (item.name == 'currentMonth')
            dateRange = helper.date.currentMonth();
        if (item.name == 'currentWeek')
            dateRange = helper.date.currentWeek();
        if (item.name == 'Today')
            dateRange = {
                minDate: new Date,
                maxDate: new Date
            };
        if (dateRange) {
            parent.settings.minDate(dateRange.minDate);
            parent.settings.maxDate(dateRange.maxDate);
        } 
    };
    
    return ctor;
});