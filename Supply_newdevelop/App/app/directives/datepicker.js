define(['app',
    'date-datepicker', 'date-fa-Ir'
], function(app){
    app.register.directive('datepicker', function(){
       return {
           restrict: 'E',
           template: '<input ng-model="model" value="1392/08/10" style="width:150px;" />',
           replace: true,
           scope: {
               model: '=',
               readonly: '@'
           },
           link: function(scope, element, attrs){
               kendo.culture("fa-IR");

               var datepicker = $(element);
               datepicker.kendoDatePicker({
                   change: function(e){
                       var year = this.value().jalalidate[0];
                       var month = this.value().jalalidate[1] + 1;
                       var day = this.value().jalalidate[2];

                       scope.model = year + '/' + month + '/' + day;
                       scope.$apply();
                   }
               });
               var datepicker = datepicker.data("kendoDatePicker");

              scope.$watch('model', function(newValue){
                  var date = JalaliDate.parse(newValue);
                  datepicker.value(date);
              });
           }
       };
    });
});
