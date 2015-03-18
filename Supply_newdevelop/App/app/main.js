requirejs.config({
    baseUrl: '/app',
    urlArgs: 'v=1.0',
    paths: {
        'external': 'lib/external',
        'helper': 'lib/helper',
        'jQuery': 'lib/external/jquery-2.1.1.min',
        'angular': 'lib/external/angular.min',
        'angular-animate': 'lib/external/angular-animate.min',
        'angular-route': 'lib/external/angular-route.min',
        'angular-resource': 'lib/external/angular-resource.min',
        'angular-sanitize': 'lib/external/angular-sanitize.min',
        'angular-translate': 'lib/external/angular-translate',
        'linq': 'lib/external/linq.min',
        'helper-window': 'lib/helper/helper.window',
        'helper_array': 'lib/helper/helper.array',
        'bootstrap': 'lib/external/bootstrap-rtl',
        'domReady': 'lib/helper/domReady'
    },
    shim: {
        'jQuery': {
            exports: 'jQuery'
        },
        'angular': {
            deps: ['jQuery'],
            exports: 'angular'
        },
        'angular-animate': {
            deps: ['angular', 'jQuery'],
            exports: 'angular-animate'
        },
        'angular-route': {
            deps: ['angular'],
            exports: 'angular-route'
        },
        'angular-resource': {
            deps: ['angular'],
            exports: 'angular-resource'
        },
        'angular-sanitize': {
            deps: ['angular'],
            exports: 'angular-sanitize'
        },
        'angular-translate':{
            deps: ['angular'],
            exports: 'angular-translate'
        },
        'bootstrap': {
          exports: 'bootstrap',
          deps: ['jQuery']
        },
        'linq': {exports: 'linq'},
        'helper-window': {deps: ['jQuery'], exports: 'helper-window'},
        'helper_array': {
            deps: ['linq'],
            exports: 'helper_array'
        },
        'app': {
            deps: ['angular'],
            exports: 'app'
        },
        'config.route': {
            deps: ['angular'],
            exports: 'config.route'
        },
        'domReady': {
            exports: 'domReady',
            deps: ['jQuery']
        }
    }
});

require([
    'angular-animate',
    'angular-route',
    'angular-resource',
    'angular-sanitize',
    'angular-translate',
    'helper-window',
    'helper_array',
    'app',
    'config.route',
    'config.translate',
    'controllers/shellController',
    'bootstrap',
    'directives/content',
    'domReady!'
],
function() {
    angular.bootstrap(document, ['app']);

    var app = angular.module('app');
    app.register.controller('shell', controllers.shellController);
});