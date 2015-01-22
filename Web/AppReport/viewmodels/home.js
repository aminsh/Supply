define(['services/logger', 'plugins/router'], function (logger, router) {
    var vm = {
        activate: activate,
        title: 'صفحه اصلی',
        currentUser: helper.defaults.currentUser,
        searchTermRoute: ko.observable(),
        routes: ko.observableArray(),
        sections: ko.observableArray(),
        totalRequests: ko.observableArray(),
        getRequestTotal: getRequestTotal,
        loadTotalRequests: loadTotalRequests,
        goToConfirm: goToConfirm,
        get: get
    };

    return vm;
    
    
    function activate() {
        vm.searchTermRoute.subscribe(function () {
            doSearchRoute();
        });
        
        loadTotalRequests();
        return true;
    }

    function loadTotalRequests() {
        var context = helper.datacontext;
        var q = context.query('TotalRequestsForSupplyManager');

        context.executeQuery(q)
            .then(function (data) {
                var results = data.results;
                vm.totalRequests(ko.getObservableArray(results));
            });
    }

    function goToConfirm(item) {
        router.navigate('confirm/' + item.Name());
    }

    function getRequestTotal(type) {
        var className = 'icon-' + type.toLowerCase();
        var obj = {};
        obj[className] = true;
        return obj;
    };

    function get () {
        var param = {StartDate: new Date,EndDate: new Date,PurchaseSize: null};

        var q = helper.datacontext.query('GetRequest')
            .withParameters({ param: ko.toJSON(param) });

        helper.datacontext.executeQuery(q)
            .then(function(data) {

            });

    }
    function doSearchRoute() {
        var term = vm.searchTermRoute();
        if (isNullOrEmpty(term)) {
            vm.routes.removeAll();
            return;
        }
            

        var results = router.routes.filter(function(item) {
            return item.title.contains(term);
        });

        vm.routes(results);
    }
});