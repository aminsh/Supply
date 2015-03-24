define(['app'], function(app){
    app.register.directive('window', function(){
        return {
            restrict: 'E',
            template: '<div ng-transclude></div>',
            transclude: true,
            scope: {
                title: '@',
                width: '@',
                close: '&',
                option: '='
            },
            link: function(scope, element, attrs){
                var win = $(element)
                win.kendoWindow({
                    width: '300px',
                    height: '300px',
                    title: attrs.title,
                    actions: ['Close'],
                    modal: true
                });

                if(!isNullOrEmpty(scope.option)){
                    scope.option.open = function(){
                        win.data("kendoWindow").open();
                    }

                    scope.option.close = function(){
                        win.data("kendoWindow").close();
                    }
                }

            }
        }
    });
});
