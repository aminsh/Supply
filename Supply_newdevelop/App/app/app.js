define(['service/routeResolver',
    //'controllers/shell'
], function() {
    var app = angular.module('app', [
        'ngAnimate',
        'ngRoute',
        'ngResource',
        'ngSanitize',
        'routeResolverService',
        'pascalprecht.translate'
    ]);

    //app.controller('shell',controllers.shellController);
    
    app.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
        $rootScope.$on('$routeChangeStart', function (evt, next, current) {
            //if (evt.currentScope.hasOwnProperty('canDeacivate'))
            //    evt.defaultPrevented = evt.currentScope.canDeacivate();

            //if (next.$$route.originalPath == '/aboutUs');
            //evt.defaultPrevented = true;
        });
    }]);


    return app;
});

