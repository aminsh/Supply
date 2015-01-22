define(['services/logger',
  'services/common',
  'services/utility.ajax',
  'durandal/app',
  'plugins/router',
  'services/viewController'],
function (logger, com, ajax, app, router, viewController) {

    var activate = function () {
        return init();
    };
    var canDeactivate = function () {
        return true;
    };

    var deactivate = function () {
        com.deactivate();
    };
    var attached = function () {
    };

    var requestTypes = [
        { name: 'Good', title: 'کالا' },
        { name: 'Food', title: 'میوه و  شیرینی' },
        { name: 'Service', title: 'خدمات' },
        { name: 'Ticket', title: 'بلیط' },
        { name: 'Vehicle', title: 'نقلیه' }
    ];

    var stepType = [        
        { name: 'Request', title: 'درخواست' },
        { name: 'Order', title: 'سفارش خرید' }
    ];
    
    var param = {
        StartDate: ko.observable(null),
        EndDate: ko.observable(null),
        Section: ko.observable(null),
        Letter: ko.observable(null),
        Item: ko.observable(null),
        OrderStatus: ko.observable(null),
        RequestType: ko.observable(null),
        PurchaseSize: ko.observable(null),
        ReportType: ko.observable(null),
        StepType: ko.observable(null)
    };
    
    var canShowParam = ko.observable(false);
    var parameters = ko.observable();
    var requestXs = ko.observableArray();
    var paramData = ko.observable();

    var init = function () {
        getDataInit(function(data) {
            paramData(data);
            //getKeys(paramData).foreach(function(key) {
            //    paramData[key] = new ko.observableArray(paramData[key]);
            //});
            parametersScriber();
        });
    };

    var getDataInit = function(dataReady) {
        context.executeQuery(context.query('InitialData'))
            .then(function(data) {
                dataReady(data.results[0]);
            });
    };
    
    var context = helper.datacontext;
    
    var getParameters = function() {
        var param = ko.toJS(parameters());

        if (isNullOrEmpty(param))
            return { RequestType: null };
        
        if (isNullOrEmpty(param.RequestType))
            return { RequestType: null };
        
        if (isNullOrEmpty(param.StepType))
            return { RequestType: param.RequestType, StepType: null };

        var paramObj = {
            RequestType: param.RequestType,
            StepType: param.StepType,
            StartDate: null,
            EndDate: null,
            Letter: null
        };

        return paramObj;
    };

    var parametersScriber = function () {
        canShowParam(false);
        var param = getParameters();
        parameters(ko.getObservable(param));

        getKeys(param).foreach(function(key) {
            param[key].subscribe(function() {
                parametersScriber();
            });
        });
        
        canShowParam(true);
    };

    var selectRequestType = function(type) {
        param.RequestType(type.name);

        canShowStepType(true);
    };

    var selectStepType = function (type) {
        param.StepType(type.name);

        canShowDate(true);
    };
    
    var canShowStepType = ko.observable(false);
    var canShowDate = ko.observable(false);
    
    var test = function() {
        //var p = paramData();
        //var p = {
        //    StartDate: new Date,
        //    EndDate: new Date,
        //    Section: null,
        //    Letter: null,
        //    Item: null,
        //    OrderStatus: 0,
        //    RequestType: 0,
        //    PurchaseSize: 0,
        //    ReportType: 0,
        //    StepType: 0
        //};

        var p = {            
            Section: { ID: 12410 }
        };
        //var param = { param: 1 };
        var q = context.query('SelectedItemBySection');
        q = q.withParameters({ param: ko.toJSON(p) });
        context.executeQuery(q).then(function(result) {
            var data = result.results;
        });
        //ajax.query('SupplyReview/SelectedItemBySection', ko.toJSON(p));
    };

    var mapLetter = function(item) {
        return {            
            label: ko.getValue(item.No) + ' - ' + ko.getValue(item.Date).toPersian(),
            value: item.ID,
            item: item
        };
    };
    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        attached: attached,
        title: 'مرور تدارکات',
        init: init,
        viewController: viewController,
        parametersScriber: parametersScriber,
        selectRequestType: selectRequestType,
        selectStepType: selectStepType,
        canShowParam: canShowParam,
        canShowStepType: canShowStepType,
        canShowDate: canShowDate,
        param: param,
        paramData: paramData,
        requestXs: requestXs,
        requestTypes: requestTypes,
        stepType: stepType,
        test: test,
        mapLetter: mapLetter 
    };


});
   
