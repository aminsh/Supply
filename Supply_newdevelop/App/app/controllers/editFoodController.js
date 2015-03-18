define(['app','service/rest/foodService'], function(app){
    app.register.controller('editFoodController', function($scope, $routeParams, foodService){
        $scope.food = {};

        var editMode = '';

        if(isNullOrEmpty($routeParams.id)){
            $scope.food = {
                title: '',
                price: 0,
                des: ''
            };

            editMode = 'new';
        }else{
            foodService.getById($routeParams.id)
                .then(function(data){
                    $scope.food = data;
                });
            editMode = 'edit';
        }

        $scope.save = function(){
            if(editMode == 'new'){
                foodService.post($scope.food)
                    .then(function(result){

                }).catch(function(error){

                });
            }
        };

        $scope.remove = function(){

        };

    });
});
