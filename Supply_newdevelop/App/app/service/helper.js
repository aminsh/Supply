define(['app'], function(app){

    app.register.factory('helper',function($resource,$http, $q){
        debugger;
        var getKeys = function(obj) {
            var keys = [];
            for (key in obj) {
                keys.push(key);
            }
            return keys;
        };

        return{
            watch: function(scope,obj){
                getKeys(obj).forEach(function(key){
                    scope.$watch(obj[key] ,function(a,b){
                        debugger;
                    });
                });
            }
        }
    });
});
