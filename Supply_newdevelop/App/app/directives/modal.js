define(['app'],function(app){
    app.register.directive('modal',function(){
        return{
            restrict: 'E',
            replace: true,
            templateUrl: 'app/directives/templates/modal-template.html',
            scope:{
                options: '=',
                title: '@'
            },
            transclude: true,
            link: function(scope, element, attrs){
                debugger;

                if(isNullOrEmpty(scope.options))
                    return;

                scope.options.show = function(){
                    $(element).modal('show');
                    scope.options.isOpen = true;
                }

                scope.options.hide = function(){
                    $(element).modal('hide');
                    scope.options.isOpen = false;
                }

                scope.$apply('options.isOpen', function(a,b){
                    debugger;
                });
            }
        }
    });

    app.register.directive('modalbody',function(){
        return{
            restrict: 'E',
            replace: true,
            template: '<div ng-transclude class="modal-body"></div>',
            transclude: true
        }
    });

    app.register.directive('modalfooter',function(){
        return{
            restrict: 'E',
            replace: true,
            template: '<div ng-transclude class="modal-footer"></div>',
            transclude: true
        }
    });
});



