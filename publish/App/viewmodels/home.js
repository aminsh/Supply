define(['services/logger', 'plugins/router'], function (logger, router) {
    var vm = {
        activate: activate,
        title: 'صفحه اصلی',
        currentUser: helper.defaults.currentUser,
        searchTermRoute: ko.observable(),
        routes: ko.observableArray(),
        loadTotalRequests: loadTotalRequests,
        goToConfirm: goToConfirm,
        totalRequests: ko.observableArray(),
        getRequestTotal: getRequestTotal,
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
        var q = context.query('TotalRequestsForExpert');

        context.executeQuery(q)
            .then(function (data) {
                var results = data.results;
                vm.totalRequests(ko.getObservableArray(results));
            });
    }
    
    function goToConfirm(item) {
        
        router.navigate('confirm/expert/confirmExpert/' + item.Name());
    }
    
    function getRequestTotal(type) {
        var className = 'icon-' + type.toLowerCase();
        var obj = {};
        obj[className] = true;
        return obj;
    };
    
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