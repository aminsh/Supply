define(['app'],function(app){
    app.register.factory('foodService', function($http , $q){
        return{
            get: function(){
                var deferred = $q.defer();

                $http.get('/api/foods')
                    .success(function(data){
                        deferred.resolve(data);
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            getById: function(id){
                var deferred = $q.defer();

                $http.get('/api/foods/' + id)
                    .success(function(data){
                        deferred.resolve(data);
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            post: function(food){
                var deferred = $q.defer();


                $http.post('/api/foods/', food)
                    .success(function(){
                        deferred.resolve();
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            put: function(food){
                var deferred = $q.defer();

                $http.put('/api/foods/', food)
                    .success(function(){
                        deferred.resolve();
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            remove: function(id){
                var deferred = $q.defer();

                $http.delete('/api/foods/' + id)
                    .success(function(){
                        deferred.resolve();
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            }
        }
    });
});
