define(['service/routeResolver','ocModal'
    //'controllers/shell'
], function() {
    var app = angular.module('app', [
        'ngAnimate',
        'ngRoute',
        'ngResource',
        'ngSanitize',
        'routeResolverService',
        'pascalprecht.translate',
        'oc.modal'
    ]);

    app.controller('TestCtrl', ['$scope', '$ocModal', '$timeout', function($scope, $ocModal, $timeout) {
        $timeout(function() {
            if($ocModal.getOpenedModals().indexOf('tempModal') !== -1) {
                $ocModal.close('tempModal', 'var a', 'var b');
            }
        }, 5000);
    }]);
    
    app.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
        $rootScope.$on('$routeChangeStart', function (evt, next, current) {
            //debugger;
            //if (evt.currentScope.hasOwnProperty('canDeacivate'))
            //    evt.defaultPrevented = evt.currentScope.canDeacivate();

            //if (next.$$route.originalPath == '/aboutUs');
            //evt.defaultPrevented = true;
        });

        $rootScope.$on('$routeChangeSuccess', function (evt, next, current) {
           //debugger;
        });
    }]);


    return app;
});

