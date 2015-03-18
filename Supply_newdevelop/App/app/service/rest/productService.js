define(['app', 'model/product'],function(app){
    app.register.factory('productService',function($http, $q , product){
        return{
            get: function(){
                var deferred = $q.defer();

                return $http.get('/api/products')
                    .success(function(data){
                        var products = data.select(function(item){return new product(item);});
                        deferred.resolve(products);
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            One: function(id){
                var deferred = $q.defer();
                return $http.get('/api/products/' + id)
                    .success(function(result){
                        deferred.resolve(result)
                    })
                    .error(function(error){
                        deferred.reject(error)
                    });

                return deferred.promise;
            },
            post: function(product){

            },
            put: function(product){

            },
            delete: function(product){

            }
        }
    });
});
