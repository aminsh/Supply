define(['app',
    'service/rest/orderFoodService',
    'service/enum',
    'directives/dropdownlist',
    'directives/modal',
    'directives/datepicker',
    'directives/combo',
],function(app){
    app.register.controller('orderFoodNewController', function($scope , orderFoodService, enums, $location){
        $scope.title = 'سفارش جدید';

        $scope.purchaseMethod = enums.purchaseMethod;

        $scope.orderFood = {
            date: '',
            sectionId: null,
            consumerId: null,
            requester: null,
            purchaseMethod: ''
        };

        $scope.save = function(){
            orderFoodService.post($scope.orderFood)
                .then(function(result){
                    debugger;
                    $location.path('OrderFoods/Edit/'+ result.Id);
                }).catch(function(error){

                });
        }
    });
});
