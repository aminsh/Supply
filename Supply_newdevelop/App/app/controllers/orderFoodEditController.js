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
            {name: 'row', title: '#' ,width: 50},
            {name: 'food.title', title: 'کالا',width: 200},
            {title: 'تعداد', template: '<span>#= qty# #= scale#</span>',width: 120},
            {name: 'price', title: 'مبلغ', format: '{0:n0}' , width: 120}
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
            },
            {
                title: 'هزینه اضافه',
                action: function(current){
                    $scope.extraCostOption.detailId = current.id;
                    $scope.extraCostOption.show();
                    orderFoodService.getExtraCost($scope.orderFood.id, current.id)
                        .then(function(result){
                            $scope.extraCost =  result || [];
                        })
                    $scope.$apply();
                }
            },
            {
                title: 'ریز هزینه',
                action: function(current){
                    $scope.costDetailOption.detailId = current.id;
                    $scope.costDetailOption.show();
                    orderFoodService.getCostDetail($scope.orderFood.id, current.id)
                        .then(function(result){
                            $scope.costDetail =  result || [];
                        })
                    $scope.$apply();
                }
            },
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

        $scope.letters = [];
        $scope.letterOption = {};

        $scope.openLetter = function(){
            orderFoodService.letters($scope.orderFood.id)
                .then(function(letters){
                    $scope.letters = letters;
                });
            $scope.letterOption.show();

        }

        $scope.addLetter = function(){
            $scope.letters.push({
                number: '',
                date: '',
                performer: '',
                performerId: ''
            })
        }
        $scope.removeLetter = function(letter){
            $scope.letters.remove(letter);
        };

        $scope.saveLetters = function(){
            orderFoodService.updateLetters($scope.orderFood.id, $scope.letters)
                .then(function(result){
                    $scope.letterOption.hide();
                })
                .catch(function(error){});
        }

        $scope.officerOption = {};

        $scope.officer = {
            officerId: null,
            date: ''
        };

        $scope.openOfficer = function(){
            $scope.officerOption.show();
        }

        $scope.saveOfficer = function(){
            orderFoodService.assignOfficer($scope.orderFood.id, $scope.officer)
                .then(function(result){
                    $scope.officerOption.hide();
                })
                .catch(function(error){});
        }

        $scope.extraCostOption = {detailId: 0};

        $scope.extraCost = [];

        $scope.currnetExtraCost = {};

        $scope.addExtraCost = function(){
            var ex = {
                costTypeId: null,
                cost: 0,
                nature: 0
            };
            $scope.currnetExtraCost = ex;

            $scope.extraCost.push(ex);
        }

        $scope.removeExtraCost = function(item){
            $scope.extraCost.remove(item);
        }

        $scope.saveExtraCost = function(){
            orderFoodService.updateExtraCost($scope.orderFood.id, $scope.extraCostOption.detailId, $scope.extraCost)
                .then(function(result){
                    $scope.extraCostOption.hide();
                })
        }

        $scope.costDetailOption = {detailId: 0};

        $scope.costDetail = [];

        $scope.addCostDetail = function(){
            var cd = {
                des: '',
                cost: 0
            };

            $scope.costDetail.push(cd);
        }

        $scope.removeCostDetail = function(item){
            $scope.costDetail.remove(item);
        }

        $scope.saveCostDetail = function(){
            orderFoodService.updateCostDetail($scope.orderFood.id, $scope.costDetailOption.detailId, $scope.costDetail)
                .then(function(result){
                    $scope.costDetailOption.hide();
                })
        }
    });
});
