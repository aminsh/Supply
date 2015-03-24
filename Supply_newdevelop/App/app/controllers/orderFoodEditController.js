define(['app',
    'service/rest/orderFoodService',
    'service/enum',
    'directives/dropdownlist',
    'directives/modal',
    'directives/datepicker',
    'directives/combo',
],function(app){
    app.register.controller('orderFoodEditController', function($scope , orderFoodService, $routeParams, enums, $location){
        $scope.title = 'ویرایش سفارش';
        $scope.food = {};

        $scope.purchaseMethod = enums.purchaseMethod;

        orderFoodService.getById($routeParams.id)
            .then(function(data){
                $scope.orderFood = data;
            });

        $scope.save = function(){
            orderFoodService.post($scope.orderFood)
                .then(function(result){
                    debugger;
                    $location.path('OrderFoods/Edit/'+ result.Id);
                }).catch(function(error){

                });
        }

        $scope.winOption = {};

        $scope.open = function(){
            $scope.winOption.show();
        }
    });
});
