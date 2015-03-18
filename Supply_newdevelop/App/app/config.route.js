define(['app'], function (app) {
    app.constant('routes', getRoutes());

    app.config(['$routeProvider', 'routes', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', 'routeResolverProvider', routeConfigurator]);

    function routeConfigurator($routeProvider, routes, $controllerProvider, $compileProvider, $filterProvider, $provide, routeResolveProvider) {

        app.register = {
            controller: $controllerProvider.register,
            directive: $compileProvider.directive,
            filter: $filterProvider.register,
            factory: $provide.factory,
            service: $provide.service
        };

        var route = routeResolveProvider.route;

        routes.forEach(function (r) {
            $routeProvider.when(r.url, route.resolve(r.config.name));
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    name: 'home',
                    templateUrl: 'app/template/home/home.html',
                    controller: 'app/template/home/home',
                    title: 'Home',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            },
            {
                url: '/Foods',
                config: {
                    name: 'foodList',
                    templateUrl: 'app/views/foodList.html',
                    controller: 'app/controllers/foodList',
                    title: 'Foods',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            },
            {
                url: '/Foods/New',
                config: {
                    name: 'editFood',
                    templateUrl: 'app/views/editFood.html',
                    controller: 'app/controllers/editFood',
                    title: 'New Foods',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            },
            {
                url: '/Foods/Edit/:id',
                config: {
                    name: 'editFood',
                    templateUrl: 'app/views/editFood.html',
                    controller: 'app/controllers/editFood',
                    title: 'Edit Foods',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            },
            {
                url: '/contactUs',
                config: {
                    name: 'contactUs',
                    templateUrl: 'app/template/aboutUs/contactUs.html',
                    controller: 'app/template/aboutUs/contactUs',
                    title: 'About us',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            },
            {
                url: '/productList',
                config: {
                    name: 'productList',
                    templateUrl: 'app/views/productList.html',
                    controller: 'app/controllers/productList',
                    title: 'Product list',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            },
            {
                url: '/ProductManagement',
                config: {
                    name: 'categoriesList',
                    templateUrl: 'app/views/categoriesList.html',
                    controller: 'app/controllers/categoriesList',
                    title: 'Category list',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            },
            {
                url: '/Category/Edit/:id',
                config: {
                    name: 'categoryEdit',
                    templateUrl: 'app/views/categoryEdit.html',
                    controller: 'app/controllers/categoryEdit',
                    title: 'Edit Category',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            },
            {
                url: '/Category/New',
                config: {
                    name: 'categoryEdit',
                    templateUrl: 'app/views/categoryEdit.html',
                    controller: 'app/controllers/categoryEdit',
                    title: 'Edit Category',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }
        ];
    }
});