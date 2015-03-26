define(['app', 'kendo'],function(app){
    app.register.directive('combo', function(){
        return {
          restrict: 'E',
          replace: true,
          template: '<input ng-model="model" />',
          scope: {
              url: '@',
              valueprop: '@',
              displayprop: '@',
              placeholder: '@',
              width: '@',
              model: '=',
              select: '&'
          },
          link: function(scope, element, attrs){

              var input = $(element);
              input.css('width', attrs.width);
              input.css('display', 'block');

              console.log('...');
              console.log(input.kendoComboBox);

              var combo = input.kendoComboBox({
                  placeholder: attrs.placeholder,
                  dataTextField: attrs.displayprop,
                  dataValueField: attrs.valueprop,
                  filter: "contains",
                  autoBind: false,
                  minLength: 2,
                  dataSource: {
                      type: "json",
                      serverFiltering: true,
                      transport: {
                          read: {
                              url: attrs.url
                          },
                          parameterMap: function (options) {
                              return kendo.stringify(options);
                          }
                      },
                      schema:{
                          parse: function(response){
                              return response.Data;
                          }
                      }
                  },
                  select: function(e){
                      var dataItem = this.dataItem(e.item.index());
                      scope.model = dataItem[attrs.valueprop];
                      scope.$apply();

                      if(!isNullOrEmpty(scope.select)){
                          scope.select({item: dataItem});
                      }
                  },
                  change: function(e){
                      if(isNullOrEmpty(combo.value())){
                          scope.model = null;
                          scope.$apply();
                      }
                  }
              }).data("kendoComboBox");

              scope.$watch('model', function(newValue){
                  combo.value(newValue);
              });
          }
        };
    })
});
