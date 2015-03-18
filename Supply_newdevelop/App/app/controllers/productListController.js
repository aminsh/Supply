
define(['app', 'service/helper', 'service/rest/productService'],function(app){
    app.register.controller('productListController',function($scope, helper, productService){
        debugger;

        var context = dataContext;

        function fetch(){
//            context.Products
//                .toLiveArray(function(data){
//                    $scope.products = data;
//                    $scope.$apply();
//                });

            productService.get().$promise.then(function(result){
                debugger;
            });
        }

        fetch();

        $scope.products = [];

        $scope.viewType = 'gallary';

        $scope.params = {
            categoryId: 0,
            sortItem: ''
        };
    helper.watch($scope,$scope.params);
//        window.getKeys = function(obj) {
//            var keys = [];
//            for (key in obj) {
//                keys.push(key);
//            }
//
//            return keys;
//        };
//
//        getKeys($scope.params).forEach(function(key){
//            $scope.$watch('params.' + key,function(a,b){
//                debugger;
//            });
//        });

        $scope.changeView = function(){
            if($scope.viewType == 'gallary')
            $scope.viewType = 'list';
            else
            $scope.viewType = 'gallary';
        };

        $scope.addProduct = function(){
            context.Products.add({Name: 'new Product'});
            context.saveChanges().then(function(result){
                debugger;
                context.Products.toArray()
                    .then(function(data){
                        debugger;
                    });
            }).fail(function(error){
                    debugger;
                });
        };


        $scope.addToCart = function(p){
            console.log(p);
        }
    });
});
