define(['app'],function(app){
    app.register.directive('combo', function(){
        return {
          restrict: 'E',
          template: '<div></div>',
          scope: {
              url: '@',
              valueprop: '@',
              displayprop: '@',
              placeholder: '@',
              model: '='
          },
          link: function(scope, element, attrs){
              var combo = $(element).kendoComboBox({
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
                              debugger;
                              return response.Data;
                          }
                      }
                  },
                  select: function(e){
                      var dataItem = this.dataItem(e.item.index());
                      scope.model = dataItem[attrs.valueprop];
                      scope.$apply();
                  }
              }).data("kendoComboBox");

              scope.$watch('model', function(newValue){
                  combo.value(newValue);
              });
          }
        };
    })
});
