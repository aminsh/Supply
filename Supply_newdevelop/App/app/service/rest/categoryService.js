define(['app'],function(app){
    app.register.factory('categoryService', function($http , $q){
       return{
           get: function(){
               var deferred = $q.defer();

               $http.get('/api/categories')
                   .success(function(data){
                       var categories = data.select(function(item){return new category(item);});
                       deferred.resolve(categories);
                   })
                   .error(function(error){
                       deferred.reject(error);
                   });

               return deferred.promise;
           },
           getById: function(id){
               var deferred = $q.defer();

               $http.get('/api/categories/' + id)
                   .success(function(data){
                       var categories = new category(data);
                       deferred.resolve(categories);
                   })
                   .error(function(error){
                       deferred.reject(error);
                   });

               return deferred.promise;
           },
           post: function(category){
               var deferred = $q.defer();

               var cat = {
                   Id: category.id,
                   Name: category.name,
                   ImageKey: category.image.key,
                   Products: category.products.select(function(p){
                       return {
                           Id: p.id,
                           Name: p.name,
                           ImageId: p.imageId,
                           Price: p.price
                       }})
               };
               $http.post('/api/categories/', cat)
                   .success(function(){
                       deferred.resolve();
                   })
                   .error(function(error){
                       deferred.reject(error);
                   });

               return deferred.promise;
           },
           put: function(category){
               var deferred = $q.defer();

               var cat = {
                   Id: category.id,
                   Name: category.name,
                   ImageKey: category.image.key,
                   Products: category.products.select(function(p){
                       return {
                           Id: p.id,
                           Name: p.name,
                           ImageId: p.imageId,
                           Price: p.price
                       }})
               };
               $http.put('/api/categories/', cat)
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

               $http.delete('/api/categories/', id)
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

    function category(item){
        var self = this;

        self.id = item.Id;
        self.name = item.Name;
        self.image = isNullOrEmpty(item.Image)
            ? null
            :{key: item.Image.Key, bigUrl: item.Image.BigUrl, smallUrl: item.Image.SmallUrl};
        self.price = item.Price;
        self.products = isNullOrEmpty(item.Products)
            ? []
            : item.Products.select(function(p){return new product(p);});
    }

    function product(item){
        var self = this;

        self.id = item.Id;
        self.name = item.Name;
        self.price = item.Price;
        self.imageId = item.ImageId;
        self.imageUrl = item.ImageUrl;
    }
});
