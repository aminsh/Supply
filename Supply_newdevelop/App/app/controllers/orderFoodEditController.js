define(['app',
    'service/rest/orderFoodService',
    'service/enum',
    'directives/dropdownlist',
    'directives/modal',
    'directives/datepicker',
    'directives/combo',
    'directives/grid'
],function(app){
    app.register.controller('orderFoodEditController', function($scope , orderFoodService, $routeParams, enums, $location, $ocModal){
        $scope.title = 'ویرایش سفارش';
        $scope.food = {};
        $scope.orderLoaded = false;

        $scope.purchaseMethod = enums.purchaseMethod;

        orderFoodService.getById($routeParams.id)
            .then(function(data){
                $scope.orderLoaded = true;
                $scope.orderFood = data;
            });

        $scope.save = function(){
            orderFoodService.post($scope.orderFood)
                .then(function(result){
                    debugger;
                    $location.path('OrderFoods/Edit/'+ result.Id);
                }).catch(function(error){

                });
        }

        $scope.currentDetail = null;
        $scope.gridDetailOption = {};

        $scope.detailColumns = [
            {name: 'row', title: '#' ,width: 80},
            {name: 'food.title', title: 'کالا'},
            {title: 'تعداد', template: '<span>#= qty# #= scale#</span>'},
            {name: 'price', title: 'مبلغ', format: '{0:n0}'}
        ];

        $scope.detailCommands = [
            {
                title: 'حذف',
                action: function(current){
                    orderFoodService.removeDetail($scope.orderFood.id, current.id)
                        .then(function(result){
                            $scope.gridDetailOption.refresh();
                        })
                        .catch(function(error){
                            console.error(error);
                        });

                },
                imageClass: "k-icon k-i-close"
            },
            {
                title: 'ویرایش',
                action: function(current){
                    orderFoodService.getDetailById($scope.orderFood.id, current.id)
                        .then(function(data){
                            $scope.currentDetail = {
                                editMode: 'edit',
                                id: data.id,
                                foodId: data.food.id,
                                qty: data.qty,
                                price: data.price
                            };
                            $scope.winOption.title = 'ویرایش ردیف';
                            $scope.winOption.show();
                        });
                    $scope.$apply();
                },
                imageClass: "k-icon k-i-pencil"
            }
        ];

        $scope.afterFoodSelect = function(item){
            $scope.currentDetail.price = item.price;
            $scope.$apply();
            debugger;
        }

        $scope.addDetail = function(){
            $scope.currentDetail = {
                editMode: 'new',
                foodId: null,
                qty: 0,
                price: 0
            };
            $scope.winOption.title = 'ردیف جدید';
            $scope.winOption.show();
        }

        $scope.saveDetail = function(){
            if($scope.currentDetail.editMode == 'new'){
                orderFoodService.addDetail($scope.orderFood.id, $scope.currentDetail)
                    .then(function(result){
                        $scope.currentDetail = null;
                        $scope.winOption.hide();
                        $scope.gridDetailOption.refresh();
                    })
                    .catch(function(error){

                    });
            }else{
                orderFoodService.updateDetail($scope.orderFood.id, $scope.currentDetail.id, $scope.currentDetail)
                    .then(function(result){
                        $scope.currentDetail = null;
                        $scope.winOption.hide();
                        $scope.gridDetailOption.refresh();
                    })
                    .catch(function(error){

                    });
            }
        }

        $scope.cancelDetail = function(){
            $scope.currentDetail = null;
            $scope.winOption.hide();
        }
        $scope.winOption = {title: ''};

        $scope.open = function(){
            $scope.winOption.show();
        }

        $scope.openModal = function(){
            $ocModal.open({
                id: 'tempModal',
                template: '<div class="text-center modal-body"><button class="btn btn-danger" oc-modal-close="\'Text from close btn\'">{{ testVar }}</button></div>',
                controller: 'TestCtrl',
                cls: 'slide-down',
                onClose: function(a, b) {
                    console.log('on close callback:', a, b);
                },
                init: {
                    testVar: 'Close this or wait 5s'
                }
            })
        }

    });
});
