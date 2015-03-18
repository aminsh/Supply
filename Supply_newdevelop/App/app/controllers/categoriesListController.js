define([
    'app',
    'service/rest/categoryService',
    'directives/imageuploader',
    'directives/modal'
], function(app){

    app.register.controller('categoriesListController',function($scope,categoryService){
        $scope.title = 'مدیریت محصولات';
        $scope.categories = [];
        $scope.currentCategory = {};
        $scope.selectedImage = {
            Key: '',
            BigUrl: '',
            SmallUrl: 's'
        };

        function init(){
            categoryService.get()
                .then(function(result){
                    $scope.categories = result
                        .select(function(item){
                            item.canShowProduct = false;
                            return item;
                        });

                    if(!$scope.$$phase)
                        $scope.$apply();
            });
        }

        init();

        $scope.save = function(form){
            debugger;
            categoryService.save($scope.categories)
                .then(function(result){
                    $scope.categories = result;
                });
        };

        $scope.addCategory = function(){
            $scope.categories.push({
                id: 0,
                name: '',
                image: {key: '', bigUrl: 'app/content/images/noPic.jpg', smallUrl: 'app/content/images/noPic.jpg'},
                products: []
            });
        };

        $scope.removeCategory = function(category){
            $scope.categories.remove(category);
        };

        $scope.addProduct = function(category){
            category.products.push({
                id: 0,
                name: '',
                image: {}
            });
        };

        $scope.removeProduct = function(category , product){
            category.products.remove(product);
        };

        $scope.expandCategory = function(category){
            category.canShowProduct = !category.canShowProduct;
        };

        $scope.afterUploadAction = function(image){
            var img = image.first();
            $scope.selectedImage.Key = img.Key;
            $scope.selectedImage.BigUrl = img.BigUrl;
            $scope.selectedImage.SmallUrl = img.SmallUrl;
        };

        $scope.assignImageToCategory = function(category , img){
            debugger;
            var image = category.image;

            image.key = img.Key;
            image.bigUrl = img.BigUrl;
            image.smallUrl = img.SmallUrl;
            
            $scope.modalOptions.hide();
        }

        $scope.cancelAssignImageToCategory = function(){
            $scope.currentCategory = {};
        };

        $scope.selectImage = function(category){
            $scope.currentCategory = category;
            $scope.modalOptions.show();
        };

        $scope.closeModal = function(){
            $scope.modalOptions.hide();
        };

        $scope.modalOptions = {  };
    });
});

