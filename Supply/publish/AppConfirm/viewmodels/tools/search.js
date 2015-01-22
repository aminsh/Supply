
define(['services/logger', 'durandal/app', 'plugins/router','viewmodels/tools/multiSelect'],
function (logger, app, router,multiSelect) {

    var search = {
        dataTypes: [
            {
                name: 'boolean',
                equalityOperator: [
                    //{name: 'checked', display: ''}
                ]
            },
            {
                name: 'number',
                equalityOperator: [
                    { name: '==', display: 'مساوی' },
                    { name: '!=', display: 'نا مساوی' },
                    { name: 'range', display: 'بین' },
                    { name: 'notRange', display: 'بین نه' },
                    { name: '>', display: 'بزرگتر' },
                    { name: '>', display: 'کوچکتر' },
                    { name: '>=', display: 'بزرگتر مساوی' },
                    { name: '<=', display: 'کوچکتر مساوی' },
                    { name: 'contains', display: 'شامل' },
                    { name: 'notContains', display: 'شامل نه' },
                    { name: 'null', display: 'خالی' },
                    { name: 'notNull', display: 'خالی نه' }
                ]
            },
            {
                name: 'string',
                equalityOperator: [
                    { name: '==', display: 'مساوی' },
                    { name: '!=', display: 'نا مساوی' },
                    { name: 'contains', display: 'شامل' },
                    { name: 'notContains', display: 'شامل نه' },
                    { name: 'startWith', display: 'شروع با' },
                    { name: 'endWith', display: 'تمام با' },
                    { name: 'empty', display: 'خالی' },
                    { name: 'notEmpty', display: 'خالی نه' }
                ]
            },
            {
                name: 'Date',
                equalityOperator: [
                    { name: '==', display: 'مساوی' },
                    { name: '!=', display: 'نا مساوی' },
                    { name: 'range', display: 'بین' },
                    { name: 'notRange', display: 'بین نه' },
                    { name: '>', display: 'بزرگتر' },
                    { name: '>', display: 'کوچکتر' },
                    { name: '>=', display: 'بزرگتر مساوی' },
                    { name: '<=', display: 'کوچکتر مساوی' },
                    { name: 'contains', display: 'شامل' },
                    { name: 'notContains', display: 'شامل نه' },
                    { name: 'null', display: 'خالی' },
                    { name: 'notNull', display: 'خالی نه' }
                ]
            },
            {
                name: 'model',
                equalityOperator: [
                    { name: '==', display: 'مساوی' },
                    { name: '!=', display: 'نا مساوی' },
                    { name: 'contains', display: 'شامل' },
                    { name: 'notContains', display: 'شامل نه' },
                    { name: 'empty', display: 'خالی' },
                    { name: 'notEmpty', display: 'خالی نه' }
                ]
            },
            {
                name: 'enum',
                equalityOperator: [
                    { name: '==', display: 'مساوی' },
                    { name: '!=', display: 'نا مساوی' },
                    { name: 'contains', display: 'شامل' },
                    { name: 'notContains', display: 'شامل نه' },
                    { name: 'empty', display: 'خالی' },
                    { name: 'notEmpty', display: 'خالی نه' }
                ]
            }
        ],
        filters: ko.observableArray(),
        columns: ko.observableArray(),
        entityName: '',
        dateFrom: ko.observable(),
        dateTo: ko.observable(),
        modelProp: ko.observable(),
        srcX: ko.observable(),
        months: [
            { key: 1, name: 'فروردین' ,isSelected: ko.observable(false)},
            { key: 2, name: 'اردیبهشت', isSelected: ko.observable(false) },
            { key: 3, name: 'خرداد', isSelected: ko.observable(false) },
            { key: 4, name: 'تیر', isSelected: ko.observable(false) },
            { key: 5, name: 'مرداد', isSelected: ko.observable(false) },
            { key: 6, name: 'شهریور', isSelected: ko.observable(false) },
            { key: 7, name: 'مهر', isSelected: ko.observable(false) },
            { key: 8, name: 'آبان', isSelected: ko.observable(false) },
            { key: 9, name: 'آذر', isSelected: ko.observable(false) },
            { key: 10, name: 'دی', isSelected: ko.observable(false) },
            { key: 11, name: 'بهمن', isSelected: ko.observable(false) },
            { key: 12, name: 'اسفند', isSelected: ko.observable(false) }
        ],
        seasons: ko.observableArray([
            { key: 1, name: 'spring', title: 'بهار', months: ko.observableArray([]), isSelected: ko.observable(false) },
            { key: 2, name: 'summer', title: 'تابستان', months: ko.observableArray([]),isSelected: ko.observable(false) },
            { key: 3, name: 'fall', title: 'پاییز', months: ko.observableArray([]), isSelected: ko.observable(false) },
            { key: 4, name: 'winter', title: 'زمستان', months: ko.observableArray([]), isSelected: ko.observable(false) }
        ]),
        currents: ko.observableArray([
            { name: 'currentYear', title: 'سال جاری', isSelected: ko.observable(false) },
            { name: 'currentSeason', title: 'فصل جاری', isSelected: ko.observable(false) },
            { name: 'currentMonth', title: 'ماه جاری', isSelected: ko.observable(false) },
            { name: 'currentWeek', title: 'هفته جاری', isSelected: ko.observable(false) },
            { name: 'Today', title: 'امروز', isSelected: ko.observable(false) }
        ])
    };

    search.setMonthsToSeason = function() {
        search.seasons.foreach(function (season) {
            if (season.key == 1) {
                season.months.push(search.months[0]);
                season.months.push(search.months[1]);
                season.months.push(search.months[2]);
            }
            if (season.key == 2) {
                season.months.push(search.months[3]);
                season.months.push(search.months[4]);
                season.months.push(search.months[5]);
            }
            if (season.key == 3) {
                season.months.push(search.months[6]);
                season.months.push(search.months[7]);
                season.months.push(search.months[8]);
            }
            if (season.key == 4) {
                season.months.push(search.months[9]);
                season.months.push(search.months[10]);
                season.months.push(search.months[11]);
            }
        });
    };

    search.selectMonth = function(month) {
        search.months.foreach(function(m) {
            m.isSelected(false);
        });

        search.seasons.foreach(function(s) {
            s.isSelected(false);
        });

        search.currents.foreach(function(c) {
            c.isSelected(false);
        });
        month.isSelected(true);
    };
    
    search.selectSeason = function (season) {
        search.months.foreach(function (m) {
            m.isSelected(false);
        });

        search.seasons.foreach(function(s) {
            s.isSelected(false);
        });
        
        search.currents.foreach(function (c) {
            c.isSelected(false);
        });
        season.isSelected(true);
    };
    search.list = ko.observableArray();
    search.init = function(entityName) {
        search.entityName = entityName;
        search.columns(ko.getObservableArray(helper.modelInfo.getEntityByName(entityName).Columns));
        search.multiSelect.init('ItemService', 'ItemServices', 'No,Title', search.list);
        search.setMonthsToSeason();
    };

    search.activate = function() {
        search.init('RequestService');
    };
    
    search.filterModel = function() {
        var item = {
            column: ko.observable(),
            columnSelected: ko.observable(true),
            name: ko.observable(),
            type: ko.observable(),
            dataType: ko.observable(),
            opr: ko.observable(),
            oprs: ko.observableArray(),
            oprSelected: ko.observable(false),
            value: ko.observable(),
            valueFrom: ko.observable(),
            valueTo: ko.observable(),
            values: ko.observableArray()
        };

        item.column.subscribe(function () {
            item.name(item.column().Name());
            if (item.column()) {
                var type = search.mapType(item.column().Type());
                item.type(type);
                if (type) {
                    var dataType = search.dataTypes.first(function(dt) {
                        return dt.name == type;
                    });
                    item.opr(undefined);
                    item.oprs(dataType.equalityOperator);
                }
                
            }
            
        });
        
        return item;
    };

    search.mapType = function (type) {
        if (type.startsWith('Model'))
            return 'model';
        if (type.startsWith('Enum'))
            return 'enum';
        type = type.replaceAll('System.', '');
        type = type.toLowerCase();
        if (type === 'string')
            return type;
        if (type === 'double' || type === 'int32')
            return 'number';
        if (type === 'datetime')
            return 'Date';
        if (type === 'boolean')
            return type;
        
        return null;

    };

    search.getPluralNameByType = function(type) {
        var typeName = type.replaceAll('Model.', '');
        var entity = helper.modelInfo.getEntityByName(typeName);
        return entity.PluralName;
    };

    search.getDisplayColumnByType = function(type) {
        var typeName = type.replaceAll('Model.', '');
        var entity = helper.modelInfo.getEntityByName(typeName);
        return entity.DisplayColumn;
    };

    search.comboSetting = function (item) {
        if (search.mapType(item.column().Type()) !== 'model')
            return { modelProp: item.value };
        var obj = {
            modelProp: item.value,
            displayProp: search.getDisplayColumnByType(item.column().Type()),
            allData: true,
            entityName: item.name(),
            pluralEntityName: search.getPluralNameByType(item.column().Type())
        };

        return obj;
    };
    
    search.enumcomboSetting = function (item) {
        if (search.mapType(item.column().Type()) !== 'enum')
            return { modelProp: item.value };
        var obj = {
            Type: item.column().Type().replaceAll('Enum.',''),
            value: item.value
        };

        return obj;
    };
    
    search.multiSelectSetting = function (item) {
        if (search.mapType(item.column().Type()) !== 'model')
            return { goals: item.values };
        var obj = {
            goals: item.values,
            displayProp: search.getDisplayColumnByType(item.column().Type()),
            entityName: item.name(),
            pluralEntityName: search.getPluralNameByType(item.column().Type())
        };

        return obj;
    };
    
    search.enummultiSelectSetting = function (item) {
        if (search.mapType(item.column().Type()) !== 'enum')
            return { goals: item.values };
        var obj = {
            goals: item.values,
            enumType: item.column().Type().replaceAll('Enum.',''),
        };

        return obj;
    };
    
    search.getByName = function(name) {
        var datatype = search.dataTypes.first(function(item) {
            return item.name === name;
        });

        return datatype;
    };

    search.getEqualityOperatorsByName = function(name) {
        var eo = search.getByName(name);
        if (eo != null)
            return eo.equalityOperator;
        return null;
    };

    search.addToFilter = function() {
        search.filters.push(search.filterModel());
    };

    search.callbackAfterColumnUpdate = function(item) {
        if (item.column() != undefined) {
            item.name(item.column.Name());
            item.type(item.column.Type());
        }
            
    };

    search.columnGetFocus = function(item) {
        item.columnSelected(true);
    };

    search.addNumber = function (item) {
        var value = { value: ko.observable(0) };
        item.values.push(value);
    };

    search.multiSelect = multiSelect;
    
    return search;

    

});
