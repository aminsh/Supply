define(['app'],function(app){
    app.register.directive('imageuploader', function($http){
        return{
            restrict: 'E',
            template: '<input class="form-control" type="file" ng-model="key">',
            replace: true,
            scope:{
              key: '=',
              afterupload:'&'
            },
            link: function(scope, element, attrs){

                element.bind('change', function(){
                    var formData = new FormData();
                    formData.append('file', element[0].files[0]);

                    $http.post('/api/image/upload', formData, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                        .success(function(data){
                            if (scope.afterupload != undefined)
                                scope.afterupload({image: data});
                            element.val('');
                        })
                        .error(function(error){
                            console.error(error);
                        });
                });
            }
        }
    })
});
