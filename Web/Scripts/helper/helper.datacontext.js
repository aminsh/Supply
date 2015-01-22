    var helper = helper || {};
$(function () {
    helper.validator = (function () {
        var customValidator = {
            stringLength: function (entityName, propName) {
                var stringLengthDefinition = helper.modelInfo.getValidatorByName(entityName, propName, 'stringLength');

                var sl = new breeze.Validator(
                    "stringLength",
                    function (value, context) {
                        if (value == null) return true;
                        return value.length <= stringLengthDefinition.MaxLength && value.length >= stringLengthDefinition.MinLength;
                    },
                    {
                        messageTemplate: ""
                    });
                return sl;
            }
        },
        correctCustomValidator = function (entityName, propName, validators) {
            validators.foreach(function (item) {
                if (item.name == 'maxLength') {
                    validators.remove(item);
                    validators.push(customValidator.stringLength(entityName, propName));
                }
            });

        },
        validationErrorsobservable = function (entity) {

            var prop = ko.observable(false);
            //var errors = ko.observableArray();
            entity.errors = ko.observableArray();
            
            var onChange = function () {
                entity.errors.removeAll();
                entity.entityAspect.getValidationErrors().foreach(function (item) {
                    entity.errors.push(item);
                });
                var hasError = entity.entityAspect.getValidationErrors().length > 0;
                if (prop() === hasError) {
                    // collection changed even though entity net error state is unchanged
                    prop.valueHasMutated(); // force notification
                } else {
                    prop(hasError); // change the value and notify
                }
                entity.hasValidationErrors(prop());
            };

            onChange();             // check now ...
            entity.entityAspect // ... and when errors collection changes
                .validationErrorsChanged.subscribe(onChange);

           //entity.errors = errors;
        }

        return {
            customValidator: customValidator,
            correctCustomValidator: correctCustomValidator,
            validationErrorsobservable: validationErrorsobservable
        };
    })();
    helper.datacontext = (function () {
        var manager = new breeze.EntityManager(window.getFullPath("/api/Supply")),
            hasChanges = ko.observable(false),
            query = function (pluralEntityname) {
                return breeze.EntityQuery.from(pluralEntityname);
            },
            predicate = function(fieldName,op,value) {
                return breeze.Predicate.create(fieldName, op, value);
            },
            predicates = function (fieldName, filterOp, linkOp, values) {
                values = ko.toJS(values);
                var preds = [];
                values.foreach(function (item) {
                    preds.push(breeze.Predicate.create(fieldName, filterOp, item));
                });

                if (linkOp === 'or')
                    return breeze.Predicate.or(preds);
                else
                    return breeze.Predicate.and(preds);
            },
            executeQuery = function (query) {
                return manager.executeQuery(query)
                    .fail(function (error) {
                        helper.note.error(error.message);
                    });
            },
            executeQueryLocally = function (query) {
                return manager.executeQueryLocally(query);
            },
            addEntity = function (entityname, initialValue) {
                    type = manager.metadataStore.getEntityType(entityname);
                    newEntity = type.createEntity(initialValue);
                    manager.addEntity(newEntity);

                    return newEntity;
            },
            saveChanges = function (localcallback) {

                function checkLcalcallback(resultType,data) {
                    if (localcallback == undefined)
                        return;
                    if (resultType === 'success')
                        if (localcallback.success != undefined)
                            localcallback.success(data);
                    if (resultType === 'fail')
                        if (localcallback.fail != undefined)
                            localcallback.fail(data);
                }
                if (hasChanges() == false) return 0;
                var changes = manager.getChanges();

                return manager.saveChanges().then(function (result) {
                    result.entities.foreach(function(entity) {
                        entity.errors.removeAll();
                        entity.hasValidationErrors(false);
                    });
                    helper.note.successDefault();
                    hasChanges(false);

                    checkLcalcallback('success', result);

                }).fail(function (error) {
                    helper.note.error('ذخیره سازی با خطا مواجه شد ...');

                    try {
                        var err = eval(error.message);
                        var entity = manager.getChanges().first(function (item) {
                            return item.ID() == err.key;
                        });

                        entity.errors.removeAll();
                        entity.errors.push({ errorMessage: err.message });
                        entity.hasValidationErrors(true);

                        var msg = error.message;
                        helper.note.error(msg);
                        
                        checkLcalcallback('fail', error);
                        
                    } catch(e) {
                        helper.note.error(error.message);
                    } 
                    
                });
            },
            cancelChanges = function () {
                manager.rejectChanges();
                helper.note.info('به درخواست کاربر عملیات لغو شد');
            }, 
            getErrorMessages = function (error) {
                try {
                    //foreach entity with a validation error
                    return error.entitiesWithErrors.map(function (entity) {
                        // get each validation error
                        return entity.entityAspect.getValidationErrors().map(function (valError) {
                            // return the error message from the validation
                            return valError.errorMessage;
                        }).join('; <br/>');
                    }).join('; <br/>');
                }
                catch (e) { }
                return 'validation error';
            },
            createExpandedField = function () {
                var store = manager.metadataStore;

                var expand = {};
                
                expand.RequestGood = function () {
                    this.TotalPrice = ko.computed({
                        read: function () {
                            var total = 0;
                            this.RequestDetailGoods.foreach(function (item) {
                                total += item.TotalPrice();
                            });
                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.SumEffectiveCostGoods = ko.computed({
                        read: function () {
                            var total = 0;
                            if (this.EffectiveCostGoods == undefined)
                                return total;
                            if (this.EffectiveCostGoods.count() == 0)
                                return total;
                            this.EffectiveCostGoods.foreach(function (item) {
                                var value = item.Cost();
                                if (value == 0) return;
                                if (item.CostType() == null) return;

                                if (item.CostType().NatureCost() == 'Positive')
                                    value = value * 1;
                                if (item.CostType().NatureCost() == 'Negative')
                                    value = value * -1;
                                total += value;
                            });

                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.TotalPriceAndEffectiveCost = ko.computed({
                        read: function () {
                            var total = 0;
                            this.RequestDetailGoods.foreach(function (item) {
                                total += item.TotalPriceAndEffectiveCost();
                            });
                            return total + this.SumEffectiveCostGoods();
                        },
                        deferEvaluation: true
                    }, this),
                    this.hasInventory = ko.computed({
                        read: function () {
                            if (this.RequestDetailGoods() == undefined)
                                return false;
                            if (!this.RequestDetailGoods.any())
                                return false;
                            return !this.RequestDetailGoods.any(function(item) {
                                return item.Qty() > item.InventoryQty();
                            });
                        },
                        deferEvaluation: true
                    }, this),
                    this.ShowDetail = ko.observable(false),
                    this.CanShowLetter = ko.observable(false),
                    this.hasValidationErrors = ko.observable(false)
                }
                expand.RequestService = function () {
                    this.TotalPrice = ko.computed({
                        read: function () {
                            var total = 0;
                            this.RequestDetailServices.foreach(function (item) {
                                total += item.TotalPriceTemp();
                            });
                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.SumEffectiveCostServices = ko.computed({
                        read: function () {
                            var total = 0;
                            if (this.EffectiveCostServices == undefined)
                                return total;
                            if (this.EffectiveCostServices.count() == 0)
                                return total;
                            this.EffectiveCostServices.foreach(function (item) {
                                var value = item.Cost();
                                if (value == 0) return;
                                if (item.CostType() == null) return;

                                if (item.CostType().NatureCost() == 'Positive')
                                    value = value * 1;
                                if (item.CostType().NatureCost() == 'Negative')
                                    value = value * -1;
                                total += value;
                            });

                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.TotalPriceAndEffectiveCost = ko.computed({
                        read: function () {
                            var total = 0;
                            this.RequestDetailServices.foreach(function (item) {
                                total += item.TotalPriceAndEffectiveCost();
                            });
                            return total + this.SumEffectiveCostServices();
                        },
                        deferEvaluation: true
                    }, this),
                    this.ShowDetail = ko.observable(false),
                    this.hasValidationErrors = ko.observable(false)
                }
                expand.RequestFood = function () {
                    this.TotalPrice = ko.computed({
                        read: function () {
                            var total = 0;
                            this.RequestDetailFoods.foreach(function (item) {
                                total += item.TotalPrice();
                            });
                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.TotalPriceTemp = ko.computed({
                        read: function () {
                            var total = 0;
                            this.RequestDetailFoods.foreach(function (item) {
                                total += (item.Qty() * item.UnitPrice());
                            });
                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.SumEffectiveCostFoods = ko.computed({
                        read: function () {
                            var total = 0;
                            if (this.EffectiveCostFoods == undefined)
                                return total;
                            if (this.EffectiveCostFoods.count() == 0)
                                return total;
                            this.EffectiveCostFoods.foreach(function (item) {
                                var value = item.Cost();
                                if (value == 0) return;
                                if (item.CostType() == null) return;

                                if (item.CostType().NatureCost() == 'Positive')
                                    value = value * 1;
                                if (item.CostType().NatureCost() == 'Negative')
                                    value = value * -1;
                                total += value;
                            });

                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.TotalPriceAndEffectiveCost = ko.computed({
                        read: function () {
                            var total = 0;
                            this.RequestDetailFoods.foreach(function (item) {
                                total += item.TotalPriceAndEffectiveCost();
                            });
                            return total + this.SumEffectiveCostFoods();
                        },
                        deferEvaluation: true
                    }, this),
                    this.ShowDetail = ko.observable(false),
                    this.hasValidationErrors = ko.observable(false)
                }

                expand.RequestVehicle = function () {
                    this.TotalPriceTemp = ko.computed({
                        read: function () {
                            var total = 0;
                            this.RequestDetailVehicles.foreach(function (item) {
                                total += item.TotalPriceTemp();
                            });
                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.SumEffectiveCostVehicles = ko.computed({
                        read: function () {
                            var total = 0;
                            if (this.EffectiveCostVehicles == undefined)
                                return total;
                            if (this.EffectiveCostVehicles.count() == 0)
                                return total;
                            this.EffectiveCostVehicles.foreach(function (item) {
                                var value = item.Cost();
                                if (value == 0) return;
                                if (item.CostType() == null) return;

                                if (item.CostType().NatureCost() == 'Positive')
                                    value = value * 1;
                                if (item.CostType().NatureCost() == 'Negative')
                                    value = value * -1;
                                total += value;
                            });

                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.TotalPriceAndEffectiveCost = ko.computed({
                        read: function () {
                            var total = 0;
                            this.RequestDetailVehicles.foreach(function (item) {
                                total += item.TotalPriceAndEffectiveCost();
                            });
                            return total + this.SumEffectiveCostVehicles();
                        },
                        deferEvaluation: true
                    }, this),
                    this.ShowDetail = ko.observable(false),
                    this.hasValidationErrors = ko.observable(false)
                }
                expand.RequestTicket = function () {
                    this.TotalPriceTemp = ko.computed({
                        read: function () {
                            var total = 0;
                            this.RequestDetailTickets.foreach(function (item) {
                                total += item.TotalPriceTemp();
                            });
                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.SumEffectiveCostTickets = ko.computed({
                        read: function () {
                            var total = 0;
                            if (this.EffectiveCostTickets == undefined)
                                return total;
                            if (this.EffectiveCostTickets.count() == 0)
                                return total;
                            this.EffectiveCostTickets.foreach(function (item) {
                                var value = item.Cost();
                                if (value == 0) return;
                                if (item.CostType() == null) return;

                                if (item.CostType().NatureCost() == 'Positive')
                                    value = value * 1;
                                if (item.CostType().NatureCost() == 'Negative')
                                    value = value * -1;
                                total += value;
                            });

                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.TotalPriceAndEffectiveCost = ko.computed({
                        read: function () {
                            var total = 0;
                            this.RequestDetailTickets.foreach(function (item) {
                                total += item.TotalPriceAndEffectiveCost();
                            });
                            return total + this.SumEffectiveCostTickets();
                        },
                        deferEvaluation: true
                    }, this),
                    this.ShowDetail = ko.observable(false),
                    this.hasValidationErrors = ko.observable(false)
                }

                expand.RequestDetailGood = function () {
                    this.TotalPrice = ko.computed({
                        read: function () {
                            return this.UnitPrice() * this.Qty();
                        },
                        write: function(value) {
                            
                        },
                        deferEvaluation: true
                    }, this),
                    this.SumEffectiveCostGoodDetails = ko.computed({
                        read: function () {
                            var total = 0;
                            if (this.EffectiveCostGoodDetails == undefined)
                                return total;
                            if (this.EffectiveCostGoodDetails.count() == 0)
                                return total;
                            this.EffectiveCostGoodDetails.foreach(function (item) {
                                var value = item.Cost();
                                if (value == 0) return;
                                if (item.CostType() == null) return;

                                if (item.CostType().NatureCost() == 'Positive')
                                    value = value * 1;
                                if (item.CostType().NatureCost() == 'Negative')
                                    value = value * -1;
                                total += value;
                            });

                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.TotalPriceAndEffectiveCost = ko.computed({
                        read: function () {
                            return this.TotalPrice() + this.SumEffectiveCostGoodDetails();
                        },
                        deferEvaluation: true
                    }, this),
                    this.InventoryQty = ko.observable(-1),
                    this.ShowDetail = ko.observable(false),
                    this.hasValidationErrors = ko.observable(false)

                }
                expand.RequestDetailService = function () {
                    this.TotalPriceTemp = ko.computed({
                        read: function () {
                            return this.UnitPrice() * this.Qty();
                        },
                        deferEvaluation: true
                    }, this),
                    this.SumEffectiveCostServiceDetails = ko.computed({
                        read: function () {
                            var total = 0;
                            if (this.EffectiveCostServiceDetails == undefined)
                                return total;
                            if (this.EffectiveCostServiceDetails.count() == 0)
                                return total;
                            this.EffectiveCostServiceDetails.foreach(function (item) {
                                var value = item.Cost();
                                if (value == 0) return;
                                if (item.CostType() == null) return;

                                if (item.CostType().NatureCost() == 'Positive')
                                    value = value * 1;
                                if (item.CostType().NatureCost() == 'Negative')
                                    value = value * -1;
                                total += value;
                            });

                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.SumSmallCostServiceDetails = ko.computed({
                        read: function () {
                            var total = 0;
                            if (this.SmallCostServiceDetails == undefined)
                                return total;
                            if (this.SmallCostServiceDetails.count() == 0)
                                return total;
                            this.SmallCostServiceDetails.foreach(function (item) {
                                total += item.Cost();
                            });

                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.TotalPriceAndEffectiveCost = ko.computed({
                        read: function () {
                            return this.TotalPriceTemp() + this.SumSmallCostServiceDetails();
                        },
                        deferEvaluation: true
                    }, this),
                    this.ShowDetail = ko.observable(false),
                    this.hasValidationErrors = ko.observable(false)

                }
                expand.RequestDetailFood = function () {
                    this.TotalPriceTemp = ko.computed({
                        read: function () {
                            return this.UnitPrice() * this.Qty();
                        },
                        deferEvaluation: true
                    }, this),
                    this.SumEffectiveCostFoodDetails = ko.computed({
                        read: function () {
                            var total = 0;
                            if (this.EffectiveCostFoodDetails == undefined)
                                return total;
                            if (this.EffectiveCostFoodDetails.count() == 0)
                                return total;
                            this.EffectiveCostFoodDetails.foreach(function (item) {
                                var value = item.Cost();
                                if (value == 0) return;
                                if (item.CostType() == null) return;

                                if (item.CostType().NatureCost() == 'Positive')
                                    value = value * 1;
                                if (item.CostType().NatureCost() == 'Negative')
                                    value = value * -1;
                                total += value;
                            });

                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.SumSmallCosts = ko.computed({
                        read: function () {
                            var total = 0;
                            if (this.SmallCosts == undefined)
                                return total;
                            if (this.SmallCosts.count() == 0)
                                return total;
                            this.SmallCosts.foreach(function (item) {
                                total += item.Cost();
                            });

                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.TotalPriceAndEffectiveCost = ko.computed({
                        read: function () {
                            return this.TotalPriceTemp() + this.SumEffectiveCostFoodDetails();
                        },
                        deferEvaluation: true
                    }, this),
                    this.ShowDetail = ko.observable(false),
                    this.hasValidationErrors = ko.observable(false)

                }
                expand.RequestDetailVehicle = function () {
                    this.TotalPriceTemp = ko.computed({
                        read: function () {
                            return this.UnitPrice() * this.Qty();
                        },
                        deferEvaluation: true
                    }, this),
                    this.SumEffectiveCostVehicleDetails = ko.computed({
                        read: function () {
                            var total = 0;
                            if (this.EffectiveCostVehicles == undefined)
                                return total;
                            if (this.EffectiveCostVehicles.count() == 0)
                                return total;
                            this.EffectiveCostVehicles.foreach(function (item) {
                                var value = item.Cost();
                                if (value == 0) return;
                                if (item.CostType() == null) return;

                                if (item.CostType().NatureCost() == 'Positive')
                                    value = value * 1;
                                if (item.CostType().NatureCost() == 'Negative')
                                    value = value * -1;
                                total += value;
                            });

                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.SumSmallCostVehicleDetails = ko.computed({
                        read: function () {
                            var total = 0;
                            if (this.SmallCostVehicleDetails == undefined)
                                return total;
                            if (this.SmallCostVehicleDetails.count() == 0)
                                return total;
                            this.SmallCostVehicleDetails.foreach(function (item) {
                                total += item.Cost();
                            });

                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.TotalPriceAndEffectiveCost = ko.computed({
                        read: function () {
                            return this.TotalPriceTemp() + this.SumEffectiveCostVehicleDetails();
                        },
                        deferEvaluation: true
                    }, this),
                    this.ShowDetail = ko.observable(false),
                    this.hasValidationErrors = ko.observable(false)
                };
                expand.RequestDetailTicket = function () {
                    this.TotalPriceTemp = ko.computed({
                        read: function () {
                            return this.GoOnPrice() + this.ReturnPrice();
                        },
                        deferEvaluation: true
                    }, this),
                    this.SumEffectiveCostTicketDetails = ko.computed({
                        read: function () {
                            var total = 0;
                            if (this.EffectiveCostTicketDetails == undefined)
                                return total;
                            if (this.EffectiveCostTicketDetails.count() == 0)
                                return total;
                            this.EffectiveCostTicketDetails.foreach(function (item) {
                                var value = item.Cost();
                                if (value == 0) return;
                                if (item.CostType() == null) return;

                                if (item.CostType().NatureCost() == 'Positive')
                                    value = value * 1;
                                if (item.CostType().NatureCost() == 'Negative')
                                    value = value * -1;
                                total += value;
                            });

                            return total;
                        },
                        deferEvaluation: true
                    }, this),
                    this.TotalPriceAndEffectiveCost = ko.computed({
                        read: function () {
                            return this.TotalPriceTemp() + this.SumEffectiveCostTicketDetails();
                        },
                        deferEvaluation: true
                    }, this),
                    this.ShowDetail = ko.observable(false),
                    this.hasValidationErrors = ko.observable(false)

                }

                expand.Input = function() {
                    this.ShowDetail = ko.observable(false),
                    this.hasValidationErrors = ko.observable(false)
                }
                
                expand.Output = function () {
                    this.ShowDetail = ko.observable(false),
                    this.hasValidationErrors = ko.observable(false)
                }
                
                expand.ConsumerSectionRequest = function() {
                    this.ShowDetail = ko.observable(false),
                   this.hasValidationErrors = ko.observable(false)
                }
                
                expand.User = function () {
                    this.ConfirmPassword = ko.observable(),
                    this.hasValidationErrors = ko.observable(false)
                }
                
                helper.ajax.getModelInfos('modelInfos', function (data) {
                    helper.modelInfos = data;
                    setMetadata();
                });

                function setMetadata() {
                    manager.fetchMetadata().then(function (parameters) {
                        var store = manager.metadataStore;
                        var entities = store.getEntityTypes();

                        var entityName = '';
                        var entity;
                        var propName = '';
                        var prop;

                        entities.foreach(doEntity);

                        function doEntity(item) {
                            entityName = item.shortName;

                            if (item.defaultResourceName == undefined)
                                store.setEntityTypeForResourceName(helper.modelInfo.getPluralNameByEntity(entityName), item);
                            
                            if (item.defaultResourceName == '')
                                store.setEntityTypeForResourceName(helper.modelInfo.getPluralNameByEntity(entityName), item);
                            
                            if (entityName == 'Everyone')
                                store.setEntityTypeForResourceName('Everyones', item);
                            

                            entity = item;
                            item.dataProperties.foreach(doProp);

                            var base =
                                expand[entityName] === undefined
                                    ? function () { this.hasValidationErrors = ko.observable(false); }
                                    : expand[entityName];

                            store.registerEntityTypeCtor(
                                    entityName,
                                    base,
                                    helper.validator.validationErrorsobservable);
                        }

                        function doProp(item) {
                            propName = item.name;
                            prop = item;
                            helper.validator.correctCustomValidator(entityName, propName, item.validators);
                            item.validators.foreach(doVld);
                        }

                        function doVld(item) {
                            var errorMessage = helper.modelInfo.getErrorMessage(entityName, propName, item.name);
                            if (errorMessage != '')
                                item.context.messageTemplate = errorMessage;
                        }

                    });
                }
                
            },
            createField = function (entityName, expandedEntity) {
                var store = manager.metadataStore;
                store.registerEntityTypeCtor(entityName, expandedEntity);
            }

        return {
            init: (function () {
                manager.hasChangesChanged.subscribe(function () {
                    hasChanges(manager.hasChanges());
                });
                
                createExpandedField();
                
            })(),
            manager: manager,
            hasChanges: hasChanges,
            query: query,
            executeQuery: executeQuery,
            executeQueryLocally: executeQueryLocally,
            addEntity: addEntity,
            saveChanges: saveChanges,
            cancelChanges: cancelChanges,
            createField: createField,
            predicate: predicate,
            predicates: predicates
        };
    })();

    helper.pager = function (datacontext, observableList) {


        var context = datacontext,
            list = observableList,
            query,
            queries = [],
            setQuery = function(q) {
                query = q;
            },
            setQueries = function(qs) {
                queries = qs;
            },
            setCallback = function(cb) {
                callback = cb;
            },
            setCallbackBeforeLoad = function(cb) {
                callbackBeforeLoad = cb;
            },
            pageSize = ko.observable(10),
            pageSizeOptions = [10, 20, 30, 50, 100],
            currentPage = ko.observable(0),
            alldata = ko.observable(false),
            changeAllData = function (value) {
                if (value == undefined)
                    alldata(false);

                alldata(value);
            },
            pages = ko.observableArray([
                    { page: "Prev", text: "قبلی" },
                    { page: "1", text: "1" },
                    { page: "2", text: "2" },
                    { page: "3", text: "3" },
                    { page: "4", text: "4" },
                    { page: "5", text: "5" },
                    { page: "6", text: "6" },
                    { page: "7", text: "7" },
                    { page: "8", text: "8" },
                    { page: "9", text: "9" },
                    { page: "10", text: "10" },
                    { page: "Next", text: "بعدی" }
            ]).reverse(),
            callback,
            callbackBeforeLoad,
            load = function (item) {
                if (alldata()) {
                    return list.executeQuery(context, query);
                }

                if (item == undefined) {
                     if (currentPage() == 0)
                         currentPage(1);
                } else {
                    if (item.hasOwnProperty('page')) {
                        if (item.page == 'Prev') {
                            if (currentPage() != 1) {
                                currentPage(currentPage() - 1);
                            }
                        }
                        else if (item.page == 'Next') {
                            currentPage(currentPage() + 1);
                        } else {
                            currentPage(parseInt(item.page));
                        }
                    }
                }

                if (callbackBeforeLoad != undefined) {
                    callbackBeforeLoad();
                }
                
                var skipValue = (currentPage() - 1) * pageSize();

                if(!isNullOrEmpty(query)){
                    var q = query;
                    q = q.skip(skipValue).take(pageSize());
                
                    if (callback == undefined)
                        return list.executeQuery(context, q);
                    else
                        context.executeQuery(q).then(callback);
                }
                
                if (queries.any()) {
                    queries.foreach(function(q) {
                        q = q.skip(skipValue).take(pageSize());
                        if (callback != undefined)
                            context.executeQuery(q).then(callback);
                    });
                }
            },
            loadManually = function (item) {
                if (alldata()) {
                    return list.executeQuery(context, query);
                }

                if (item == undefined)
                    currentPage(1);
                else {
                    if (item.page == 'Prev') {
                        if (currentPage() != 1) {
                            currentPage(currentPage() - 1);
                        }
                    }
                    else if (item.page == 'Next') {
                        currentPage(currentPage() + 1);
                    } else {
                        currentPage(parseInt(item.page));
                    }
                }

                var skipValue = (currentPage() - 1) * pageSize();

                var q = query;
                q = q.skip(skipValue).take(pageSize());

                return context.executeQuery(q);
            },
            loadLocally = function () {
                if (alldata()) {
                    list.executeQueryLocally(context, query);
                    return;
                }

                var skipValue = (currentPage() - 1) * pageSize();

                var q = query;
                q = q.orderBy('ID').skip(skipValue).take(pageSize());

                list.executeQueryLocally(context, q);
            },
            buildPager = function (ctrl) {
                ctrl.html('');
            }

        pageSize.subscribe(function() {
            currentPage(0);
            if(query != undefined)
                load();
        });

        return {
            alldata: alldata,
            changeAllData: changeAllData,
            query: query,
            setQuery: setQuery,
            setQueries: setQueries,
            setCallback: setCallback,
            setCallbackBeforeLoad: setCallbackBeforeLoad,
            pageSize: pageSize,
            pageSizeOptions: pageSizeOptions,
            pages: pages,
            currentPage: currentPage,
            callback: callback,
            load: load,
            loadManually: loadManually,
            loadLocally: loadLocally,
            buildPager: buildPager
        };

    }
});



