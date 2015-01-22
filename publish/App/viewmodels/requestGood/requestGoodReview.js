
define(['services/logger', 'durandal/app', 'plugins/router','services/common'],
function (logger, app, router,com) {
    var activate = function () {
        //pager = new helper.pager(context, summaryList);
        //pager.changeAllData(false);
        paramSubscribe();
        //return init();
    };
    var canDeactivate = function() {
        return true;
    };
    var deactivate = function() {
        com.deactivate();
    };
    var viewAttached = function() {
    };

    var context = helper.datacontext;
    var pager = new helper.pager(context, summaryList);

    var pagerTypes = [{key: 'pager', text: 'صفحه بندی'}, {key: 'canAdded',text: 'لیست اضافه شدنی'}];
    var pagerType = ko.observable(pagerTypes.first());
    var pageSize = ko.observable(pager.pageSize());

    pageSize.subscribe(function() {
        pager.pageSize(pageSize());
    });

    var pagerCanAddedload = function() {
        pager.currentPage(pager.currentPage() + 1);
        pager.load();
    };

    var pagerCanAddedloadInSubRow = function (item) {
        item.pager.currentPage(pager.currentPage() + 1);
        item.pager.pageSize(pageSize());
        item.pager.load();
    };
    
    var dictionary = [
        { key: 'SectionAssistance', value: 'معاونت' },
        { key: 'Section', value: 'قسمت' },
        { key: 'Person', value: 'درخواست دهنده' },
        { key: 'ItemGood', value: 'کالا' },
        { key: 'Seller', value: 'فروشنده' },
        { key: 'PurchasingOfficer', value: 'کارپرداز' },
        { key: 'SumQty', value: 'تعداد' },
        { key: 'TotalPrice', value: 'مبلغ کل' },
        { key: 'DateFrom', value: 'از تاریخ' },
        { key: 'DateTo', value: 'تا تاریخ' },
        { key: 'TotalPrice', value: 'مبلغ کل' },
        { key: '==', value: 'مساوی' },
        { key: '&&', value: 'و' },
        { key: '||', value: 'یا' },
        { key: '>=', value: 'بزرگتر مساوی' },
        { key: '<=', value: 'کوچکتر مساوی' }
    ];

    var dictionaryFind = function(key) {
        var dic = dictionary.first(function(item) {
            return item.key == key;
        });

        return dic == undefined ? 'Not found ' : dic.value;
    };
    var baseColumns = [
        { name: ko.observable('SectionAssistance'), title: ko.observable('معاونت'), isActive: ko.observable(false), type: ko.observable('group') },
        { name: ko.observable('Section'), title: ko.observable('قسمت'), isActive: ko.observable(false), type: ko.observable('group') },
        { name: ko.observable('Person'), title: ko.observable('درخواست دهنده'), isActive: ko.observable(false), type: ko.observable('group') },
        { name: ko.observable('ItemGood'), title: ko.observable('کالا'), isActive: ko.observable(false), type: ko.observable('group') },
        { name: ko.observable('Seller'), title: ko.observable('فروشنده'), isActive: ko.observable(false), type: ko.observable('group') },
        { name: ko.observable('PurchasingOfficer'), title: ko.observable('کارپرداز'), isActive: ko.observable(false), type: ko.observable('group') },
        { name: ko.observable('SumQty'), title: ko.observable('تعداد'), isActive: ko.observable(false), type: ko.observable('sum') },
        { name: ko.observable('TotalPrice'), title: ko.observable('مبلغ کل'), isActive: ko.observable(false), type: ko.observable('sum') }
        
    ];

    var selectedColumns = ko.observableArray([]);
    var selectableColumns = ko.observableArray(baseColumns.filter(function(item) {
        return item.type() === 'group';
    }));
    
    //{ name: '', equalityOperator: '==', value: '', displayValue: '' },
    //{ linkOperator: '' },

    var filters = ko.observableArray([]);
    
    var addToFilters = function (name,fieldName,text,equalityOperator,equalityOperatorText, value, displayValue,type,dataType) {
        if (filters().any())
            filters.push({ LinkOperator: '&&' });

        var filter = filters().first(function(f) {
            return f.Name === name && f.Type === 'Static';
        });

        if (filter != null) removeFilter(filter);
        
        var item = {
            Name: name,
            FieldName: fieldName,
            Text: text,
            EqualityOperatorText: equalityOperatorText,
            EqualityOperator: equalityOperator,
            Value: value,
            DisplayValue: displayValue,
            Type: type,
            DataType: dataType
        };
        filters.push(item);
    };
    
    var removeFilter = function (item) {
        var index = filters.indexOf(item);
        if (index == 0) {
            var newItem = filters()[index + 1];
            if (newItem != undefined)
                filters.remove(newItem);
        }
        var preItem = filters()[index - 1];
        if (preItem != undefined)
            filters.remove(preItem);
        filters.remove(item);
    };

    var removeFilterDynamic = function () {
        filters.filter(function(item) {
            return item.Type === 'dynamic';
        })
            .foreach(function(item) {
                removeFilter(item);
            });
    };

    var params = {
        DateFrom: ko.observable(null),
        DateTo: ko.observable(null),
        SectionAssistance: ko.observable(),
        Section: ko.observable(),
        Person: ko.observable(),
        ItemGood: ko.observable(),
        Seller: ko.observable(),
        PurchasingOfficer: ko.observable()
    };

    var paramSubscribe = function() {
        var keys = getKeys(params);

        keys.foreach(function (key) {
            params[key].subscribe(function () {
                var filter = filters().first(function (f) {
                    return f.name === key && f.type === 'Static';
                });

                var obj = {
                    name: key,
                    text: dictionaryFind(key),
                    type: 'Static'
                };
                
                if (key === 'DateFrom') {
                    obj.name = key;
                    obj.fieldName = 'Date';
                    obj.equalityOperator = '>=';
                    obj.equalityOperatorText = dictionaryFind('>=');
                    obj.value = persianDate.display(params[key]());
                    obj.displayValue = persianDate.display(params[key]());
                    obj.dataType = 'DateTime';
                } else if (key === 'DateTo') {
                    obj.name = key;
                    obj.fieldName = 'Date';
                    obj.equalityOperator = '<=';
                    obj.equalityOperatorText = dictionaryFind('<=');
                    obj.value = persianDate.display(params[key]());
                    obj.displayValue = persianDate.display(params[key]());
                    obj.dataType = 'DateTime';
                } else {
                    obj.name = key + 'ID';
                    obj.fieldName = key + 'ID';
                    obj.equalityOperator = '==';
                    obj.equalityOperatorText = dictionaryFind('==');
                    obj.value = params[key]().ID();
                    obj.displayValue = getDisplayName(params[key]());
                    obj.dataType = 'int';
                }
                
                if (filter == null)
                    addToFilters(obj.name,obj.fieldName, obj.text, obj.equalityOperator, obj.equalityOperatorText, obj.value, obj.displayValue,obj.type,obj.dataType);
                else {
                    removeFilter(filter);
                    addToFilters(obj.name,obj.fieldName, obj.text, obj.equalityOperator, obj.equalityOperatorText, obj.value, obj.displayValue,obj.type,obj.dataType);
                }
            });
            
            
        });
    };

    var getDisplayName = function(obj) {
        if (obj.hasOwnProperty('Title'))
            return obj.Title();
        if (obj.hasOwnProperty('FirstName') && obj.hasOwnProperty('LastName'))
            return obj.FirstName() + ' ' + obj.LastName();
        
        throw new Error('Dispaly name not found ...');
    };
    //{ query: {}, isActive: true }
    var stateyHistory = [];

    var addToStateHistory = function (query) {
        stateyHistory.foreach(function(item) {
            item.isActive = false;
        });
        var columns = baseColumns.filter(function(item) {
            if (item.name() === 'TotalPrice')
                return true;
            if (item.name() === 'SumQty')
                return baseColumns.first(function(c) {
                    return c.name() === 'ItemGood';
                }).isActive();
            return item.isActive();
        });
        var state = { query: query, isActive: true, columns: columns };
        stateyHistory.push(state);
    };

    var activateState = function(index) {
        if (index < 0)
            throw new Error('Index for stateHistory array not good ...');
        if(index >= stateyHistory.count())
            throw new Error('Index for stateHistory array not good ...');
        
        stateyHistory.foreach(function (item) {
            item.isActive = false;
        });

        stateyHistory[index].isActive = true;
    };
    var summaryList = ko.observableArray();
    var request = ko.observable();
    var current = ko.observable();

    var sumTotalPrice = ko.computed(function() {
        var sum = 0;
        if (summaryList.count() == 0) return sum;
        if (!summaryList()[0].hasOwnProperty('TotalPrice'))
            return sum;
        summaryList.foreach(function(item) {
            sum += item.TotalPrice;
        });

        return sum;
    });

    var select = function(item) {
        current(item);
        var keys = getKeys(item);
        removeFilterDynamic();
        keys.foreach(function(key) {
            if (baseColumns.any(function (bc) {
                return bc.name() === key && bc.type() === 'group';
            })) {
                var column = baseColumns.first(function (bc) {
                    return bc.name() === key;
                });

                addToFilters(column.name()+'ID',column.name()+'ID', dictionaryFind(column.name()), '==',dictionaryFind('==') ,item[column.name()].ID, item[column.name()].Title, 'dynamic','int');
                //filter += filter === ''
                //    ? column.name + 'ID == ' + current[column.name].ID
                //    : ' && ' + column.name + 'ID == ' + current[column.name].ID;
            }
        });
        
        summaryList.foreach(function(row) {
            row.isSelected(false);
        });
        
        if(item.isSelected != undefined)
            item.isSelected(true);
    };

    var selectRequest = function(item) {
        request(item);
    };

    var loadRequest = function (item) {
        item.isExpanded(!item.isExpanded());

        if (item.isExpanded() == false) return;
        if (item.requests().any()) return;

        var lastState = stateyHistory.first(function(s) {
            return s.isActive;
        });
        
        var filter = lastState.query.parameters.defaultFilter;
        var parameters = $.parseJSON(filter);
        
        var keys = getKeys(item);
       

        keys.foreach(function (key) {
            if (baseColumns.any(function (bc) {
                return bc.name() === key && bc.type() === 'group';
            })) {
                var column = baseColumns.first(function (bc) {
                    return bc.name() === key;
                });
                
                if (parameters.any())
                    parameters.push({ LinkOperator: '&&' });

                parameters.push({
                    DataType: 'int',
                    EqualityOperator: "==",
                    FieldName: column.name() + 'ID',
                    Value: item[column.name()].ID
                });
            }
        });
        
        var q = context.query('RequestGoodXs');
        q = q.withParameters({ filter: ko.toJSON(parameters) });

        item.pager.setCallbackBeforeLoad(function() {
            item.loading(true);
        });
        
        item.pager.setCallback(function (data) {
            var results = data.results;
            if (!results.any()) {
                helper.note.info('اطلاعاتی یافت نشد');
                item.loading(false);
                return 0;
            }
            
            if (pagerType().key == 'pager') {
                item.loading(false);
                item.requests(results);
            }

            if (pagerType().key == 'canAdded') {
                if (item.pager.currentPage() == 1)
                    item.requests(results);
                else {
                    results.foreach(function (row) {
                        item.requests.push(row);
                    });
                }
                
                item.loading(false);
            }
            return 0;
        });
        
        item.pager.pageSize(pageSize());
        item.pager.currentPage(0);
        item.pager.setQuery(q);
        item.pager.changeAllData(false);
        return item.pager.load();
    };
    
    var runQuery = function (state) {
        var q;
        if (state == undefined) {
            var group = '';
            
            baseColumns.filter(function (bc) {
                return bc.isActive() && bc.type() === 'group';
            })
            .foreach(function (item) {
                group += group === '' ? item.name() : ';' + item.name();
            });

            if (group === '') return 0;
            
            selectedColumns(baseColumns.filter(function (item) {
                if (item.name() === 'TotalPrice')
                    return true;
                if (item.name() === 'SumQty')
                    return baseColumns.first(function (c) {
                        return c.name() === 'ItemGood';
                    }).isActive();
                return item.isActive();
            }));

            q = context.query('RequestGoodGrouping');
            q = q.withParameters({ group: group, defaultFilter: ko.toJSON(filters()) });
            q = q.where('TotalPrice', '!=', 0);

            addToStateHistory(q);
        } else {
            q = state.query;
            selectedColumns(state.columns);
            filters($.parseJSON(q.parameters.defaultFilter));

            baseColumns.foreach(function(item) {
                item.isActive(false);
            });

            state.columns.foreach(function(item) {
                var column = baseColumns.first(function(bc) {
                    return bc.name() === item.name();
                });

                column.isActive(true);
            });

        }
        
        
        pager.setCallback(runQueryCallback);
        pager.currentPage(0);
        pager.setQuery(q);
        pager.changeAllData(false);
        return pager.load();
    };

    var runQueryCallback = function(data) {
       
        
        var results = data.results;
        if (!results.any()) {
            helper.note.info('اطلاعاتی یافت نشد');
            return 0;
        }
        
        results.foreach(function (item) {
            item.isSelected = ko.observable(false);
            item.isExpanded = ko.observable(false);
            item.loading = ko.observable(false);
            item.requests = ko.observableArray();
            item.pager = new helper.pager(context, item.requests);
        });
        //results[0].isSelected(true);
        if(pagerType().key == 'pager')
            summaryList(results);
        
        if (pagerType().key == 'canAdded') {
            if (pager.currentPage() == 1)
                summaryList(results);
            else {
                results.foreach(function(item) {
                    summaryList.push(item);
                });
            }
        }
            
        removeFilterDynamic();

        return 0;
    };
    var selectColumn = function(item) {
        item.isActive(!item.isActive());

        runQuery();
    };

    var goBack = function() {
        if (!stateyHistory.any())
            return 0;
        var activeState = stateyHistory.first(function(item) {
            return item.isActive;
        });

        if (activeState == null)
            return 0;
        
        var index = stateyHistory.indexOf(activeState);
        if (index == 0)
            return 0;

        activateState(index - 1);

        var state = stateyHistory.first(function(item) {
            return item.isActive;
        });
        runQuery(state);

        return 0;
    };

    var forward = function() {
        if (!stateyHistory.any())
            return 0;
        var activeState = stateyHistory.first(function (item) {
            return item.isActive;
        });

        if (activeState == null)
            return 0;

        var index = stateyHistory.indexOf(activeState);
        if (index == stateyHistory.count() - 1)
            return 0;

        activateState(index + 1);

        var state = stateyHistory.first(function (item) {
            return item.isActive;
        });
        runQuery(state);

        return 0;
    };

    var canAdjustShow = ko.observable(false);

    var changeAdjustShow = function() {
        canAdjustShow(!canAdjustShow());
    };
  
   
    return {
        title: 'مرور درخواست کالا',
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        pager: pager,
        pagerTypes: pagerTypes,
        pagerType: pagerType,
        pagerCanAddedload: pagerCanAddedload,
        pagerCanAddedloadInSubRow: pagerCanAddedloadInSubRow,
        pageSize: pageSize,
        baseColumns: baseColumns,
        selectableColumns: selectableColumns,
        selectedColumns: selectedColumns,
        filters: filters,
        params: params,
        removeFilter: removeFilter,
        summaryList: summaryList,
        request: request,
        current: current,
        sumTotalPrice: sumTotalPrice,
        select: select,
        selectRequest: selectRequest,
        loadRequest: loadRequest,
        selectColumn: selectColumn,
        runQuery: runQuery,
        goBack: goBack,
        forward: forward,
        dictionaryFind: dictionaryFind,
        canAdjustShow: canAdjustShow,
        changeAdjustShow: changeAdjustShow
    };

});
