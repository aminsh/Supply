﻿define([], function() {
    var services = angular.module('routeResolverService', []);
    services.provider('routeResolver', function() {
        this.$get = function() {
            return this;
        };

        this.routeConfig = function() {
            var viewsDirectory = 'app/views/';
            var controllersDirectory = 'app/controllers/';

            var setBaseDirectories = function(viewsDir, controllersDir) {
                    viewsDirectory = viewsDir;
                    controllersDirectory = controllersDir;
                },

                getViewsDirectory = function() {
                    return viewsDirectory;
                },

                getControllersDirectory = function() {
                    return controllersDirectory;
                };

            return {
                setBaseDirectories: setBaseDirectories,
                getControllersDirectory: getControllersDirectory,
                getViewsDirectory: getViewsDirectory
            };
        }();

        this.route = function(routeConfig) {
            var resolve = function(baseName) {
                var routeDef = {};
                routeDef.templateUrl = routeConfig.getViewsDirectory() + baseName + '.html';
                routeDef.controller = baseName + 'Controller';
                routeDef.resolve = {
                    load: [
                        '$q', '$rootScope', function($q, $rootScope) {
                            var dependencies = [routeConfig.getControllersDirectory() + baseName + 'Controller.js'];
                            return resolveDependencies($q, $rootScope, dependencies);
                        }
                    ]
                };

                return routeDef;
            };

            var resolveDependencies = function($q, $rootScope, dependencies) {
                var defer = $q.defer();
                require(dependencies, function() {
                    defer.resolve();
                    $rootScope.$apply();
                });

                return defer.promise;
            };

            return {
                resolve: resolve
            };
        }(this.routeConfig);
    });
});