define(['app',
    'service/rest/foodService',
    'directives/combo',

], function(app){
    app.register.controller('editFoodController', function($scope, $routeParams, foodService, $location){
        $scope.title = '';
        $scope.food = {};

        var editMode = '';

        if(isNullOrEmpty($routeParams.id)){
            $scope.food = {
                title: '',
                price: 0,
                des: ''
            };

            editMode = 'new';
           $scope.title = 'میوه و شیرینی جدید';
        }else{
            foodService.getById($routeParams.id)
                .then(function(data){
                    $scope.food = data;
                });
            editMode = 'edit';
            $scope.title = 'ویرایش میوه و شیرینی';
        }


        $scope.save = function(){
            if(editMode == 'new'){
                foodService.post($scope.food)
                    .then(function(result){
                        $location.path('/Foods');

                }).catch(function(error){
                        console.error(error);
                });
            }
            else{
                foodService.put($scope.food)
                    .then(function(result){
                        $location.path('/Foods');
                    })
                    .catch(function(error){
                        console.error(error);
                    });
            }
        };

        $scope.remove = function(){
            foodService.remove($scope.food.id)
                .then(function(result){
                    $location.path('/Foods');
                }).catch(function(error){
                    console.error(error);
                });
        };

    });
});
