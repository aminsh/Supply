define(['app',
    'service/rest/categoryService',
    'directives/imageuploader',
    'directives/modal'], function(app){
    app.register.controller('categoryEditController', function($scope, $routeParams, categoryService ,$location){
        var editMode = '';

        $scope.category = {}
        $scope.selectedImage = {
            Key: '',
            BigUrl: '',
            SmallUrl: 's'
        };

        if(isNullOrEmpty($routeParams.id)){
            $scope.title = 'گروه محصولات جدید';
            editMode = 'new';

            $scope.category = {
                id: 0,
                name: '',
                image: {key: '', bigUrl: 'app/content/images/noPic.jpg', smallUrl: 'app/content/images/noPic.jpg'},
                products: []
            }
        }
        else{
            $scope.title = 'ویرایش گروه محصولات';
            editMode = 'edit';

            categoryService.getById($routeParams.id)
                .then(function(result){
                    $scope.category = result;
                })
        }

        $scope.save = function(form){
            if(editMode == 'new')
                categoryService.post($scope.category)
                    .then(function(){
                        $location.path('/ProductManagement');
                    });
            else
                categoryService.put($scope.category)
                    .then(function(){
                        $location.path('/ProductManagement');
                    });
        }

        $scope.remove = function(){
            categoryService.remove($scope.category.id)
                .then(function(){
                    $location.path('/ProductManagement');
                });
        }

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
