define(['app'], function(app) {
    app.register.controller('aboutUsController', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.message = 'this is about us page';
        $scope.canDeacivate = function() {
            return confirm('Do you deactivate ? ');
        };

        //$rootScope.$on('$routeChangeStart', function(evt, next, current) {
        //    evt.defaultPrevented = confirm('Do you deactivate ? ');
        //});
    }]);
});