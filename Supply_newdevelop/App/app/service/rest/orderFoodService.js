define(['app'],function(app){
    app.register.factory('orderFoodService', function($http , $q){
        return{
            get: function(){
                var deferred = $q.defer();

                $http.get('/api/orderFoods')
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

                $http.get('/api/orderFoods/' + id)
                    .success(function(data){
                        deferred.resolve(data);
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            details: function(id){
                var deferred = $q.defer();

                $http.get('/api/orderFoods/' + id + '/details')
                    .success(function(data){
                        deferred.resolve(data);
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            getDetailById: function(id, detailId){
                var deferred = $q.defer();

                $http.get('/api/orderFoods/' + id + '/details/' + detailId)
                    .success(function(data){
                        deferred.resolve(data);
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            post: function(orderFood){
                var deferred = $q.defer();


                $http.post('/api/orderFoods/', orderFood)
                    .success(function(result){
                        deferred.resolve(result);
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            put: function(orderFood){
                var deferred = $q.defer();

                $http.put('/api/orderFoods/', orderFood)
                    .success(function(){
                        deferred.resolve();
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            assignOfficer: function(id , data){
                var deferred = $q.defer();

                $http.post('/api/orderFoods/' + id + 'assignOfficer', data)
                    .success(function(){
                        deferred.resolve();
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            close: function(id , data){
                var deferred = $q.defer();

                $http.put('/api/orderFoods/' + id + '/close', data)
                    .success(function(){
                        deferred.resolve();
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            addDetail: function(id , data){
                var deferred = $q.defer();

                $http.post('/api/orderFoods/' + id + '/details', data)
                    .success(function(){
                        deferred.resolve();
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            updateDetail: function(id ,detailId,data){
                var deferred = $q.defer();

                $http.put('/api/orderFoods/' + id + '/details/' + detailId, data)
                    .success(function(){
                        deferred.resolve();
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            removeDetail: function(id ,detailId){
                var deferred = $q.defer();

                $http.delete('/api/orderFoods/' + id + '/details/' + detailId)
                    .then(function(){
                        deferred.resolve();
                    })
                    .catch(function(){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            updateExtraCost: function(id ,detailId ,  data){
                var deferred = $q.defer();

                $http.put('/api/orderFoods/' + id + '/details/' + detailId + '/extraCost', data)
                    .success(function(){
                        deferred.resolve();
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            updateCostDetail: function(id ,detailId ,  data){
                var deferred = $q.defer();

                $http.put('/api/orderFoods/' + id + '/details/' + detailId + '/costDetail', data)
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
