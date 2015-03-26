define(['app', 'kendo'],function(app){
    app.directive('numeric', function(){
        return {
            restrict: 'E',
            template: '<input ng-model="model"/>',
            replace: true,
            scope: {
                model: '=',
                isprice: '@'
            },
            link: function(scope, element, attrs){
                var option = {
                    decimals: 0,
                    change: function(){
                        scope.model = this.value();
                    }
                };

                if(attrs.isprice == 'true')
                    option.format = 'n0';
                else
                    option.format = '0';

                $(element).kendoNumericTextBox(option);

                var numerictextbox = $(element).data("kendoNumericTextBox");

                scope.$watch('model',function(newValue){
                    numerictextbox.value(newValue);
                });
            }
        }
    })
})
