define(['app',
    'directives/grid',
    'service/rest/foodService'],function(app){
    app.register.controller('foodListController', function($scope, $location,foodService){
       $scope.title = 'میوه و شیرینی';

        $scope.columns = [
            {name: 'title', title: 'عنوان'},
            {name: 'price', title: 'قیمت'},
            {name: 'scale', title: 'واحد اندازه گیری'},
        ];

        $scope.commands = [
            {
                 title: 'حذف',
                 action: function(current){
                     foodService.remove(current.id)
                         .then(function(result){
                             $scope.gridOption.refresh();
                         })
                         .catch(function(error){
                             console.error(error);
                         });

                 },
                 imageClass: "k-icon k-i-close"
            },
            {
                title: 'ویرایش',
                action: function(current){
                    $location.path('Foods/Edit/'+ current.id);
                    $scope.$apply();
                },
                imageClass: "k-icon k-i-pencil"
            }
        ];

        $scope.gridOption = {};


    });
});
