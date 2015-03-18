define(['app'],function(app){
    app.register.directive('noTag', function(){
        return {
            restrict: "E",
            replace: true,
            transclude: 'element',
//            template:'<ng-transclude ng-transclude></ng-transclude>'
        };
    });




});
