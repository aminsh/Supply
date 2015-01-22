var helper = helper || {};

$(function() {
	//observableArray
    
	//filter
	ko.observableArray.fn.filter = function (callback) {
		return ko.utils.arrayFilter(this(), callback);
	};

	//foreeach
    ko.observableArray.fn.foreach = function(callback) {
        ko.utils.arrayForEach(this(), callback);
    };

    ko.observableArray.fn.any = function(callback) {
        return this().any(callback);
    };
    
    ko.observableArray.fn.first = function (callback) {
        return this().first(callback);
    };
    
    ko.observableArray.fn.count = function() {
        return this().length;
    };

    ko.observableArray.fn.select = function(callback) {
        return this().select(callback);
    };
    
    ko.observable.fn.unwrap = function() {
        return ko.utils.unwrapObservable(this);
    };

    ko.getValue = function(obj) {
        if (typeof obj == 'function')
            return obj();
        return obj;
    };

    ko.setValue = function(obj,value) {
        if (typeof obj == "function")
            obj(value);
        obj = value;
    };

    ko.getObservableArray = function(array) {
        array.foreach(function(item) {
            item = ko.getObservable(item);
        });

        return array;                                                                                                                                                                                                                                                   
    };
    
    ko.getObservable = function(obj) {
        var keys = getKeys(obj);
        keys.foreach(function(key) {
            obj[key] = new ko.observable(obj[key]);
        });

        return obj;
    };
    ko.getPropertyNameBinding = function(element) {
        var dataBind = element.attributes['data-bind'].nodeValue;
        var propertyName = dataBind.match(/value\s*:\s*(?:{.*,?\s*data\s*:\s*)?([^{},\s]+)/);
        var propName;
        if (propertyName && propertyName.length)
            propName = propertyName[1];
        else {
            propertyName = dataBind.match(/text\s*:\s*(?:{.*,?\s*data\s*:\s*)?([^{},\s]+)/);
            if (propertyName && propertyName.length)
                propName = propertyName[1];
        }

        if (propName != undefined) {
            return propName.replaceAll('()', '');
        }
        throw new Error('binding name not find in getPropertyNameBinding function');
    };
    
    ko.bindingHandlers.dateString = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = valueAccessor(),
                allBindings = allBindingsAccessor();
            var valueUnwrapped = ko.utils.unwrapObservable(value);
            var pattern = allBindings.datePattern || 'MM/dd/yyyy';
            //$(element).text(valueUnwrapped.toString(pattern));
            $(element).text(valueUnwrapped.toPersian());
        }
    }
    
    ko.bindingHandlers.enumDisplay = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = valueAccessor(),
                allBindings = allBindingsAccessor();

            var enumtype = value.Type;
            var enumValue = value.value();

            helper.ajax.get('getEnum', enumtype, function (data) {
                data.foreach(function(item) {
                    if (item.Name == enumValue) {
                        $(element).text(item.DisplayName);
                        return;
                    }
                        
                });
                
            });


        }
    }
    
    ko.bindingHandlers.statusShow = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = valueAccessor();
            var $el = $(element);
            
            if (value() == 'Cancel') {
                $el.removeClass('approved');
                $el.removeClass('pendding');
                $el.addClass('canceled');
            }
            
            if (value() == 'Temporary') {
                $el.removeClass('approved');
                $el.removeClass('canceled');
                $el.addClass('pendding');
            }
            
            if (value() == 'Confirm') {
                $el.removeClass('pendding');
                $el.removeClass('canceled');
                $el.addClass('approved');
            }

                
        }
    }
    ko.bindingHandlers.myDatePicker = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            //var value = valueAccessor(),
            //    allBindings = allBindingsAccessor();
            //var valueUnwrapped = ko.utils.unwrapObservable(value);
            //$(element).val(valueUnwrapped.toPersian());
            //var pattern = allBindings.datePattern || 'MM/dd/yyyy';
            //$(element).text(valueUnwrapped.toString(pattern));
            $(element).css('width', function() {
                return 100;
            });
            $(element).datepicker({
                changeMonth: true,
                changeYear: true,
                showButtonPanel: true,
                dateFormat: 'yy/mm/dd'
            });
            
            $("#ui-datepicker-div").css("z-index", "1");
        }
    }
    

    ko.bindingHandlers['value'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var isBound = viewModel.entityType != undefined;
            var attrs = {};
            var converter;
            
            // set bound prop works ....
            if (isBound) {
                attrs = getAttributes(element, valueAccessor, allBindingsAccessor, viewModel);
                
                if (attrs.isRequired)
                    $(element).attr('required', 'required');
                
                if (attrs.type.toLowerCase() == 'Double'.toLowerCase()) {
                    converter = { value: float, name: 'float' };
                }
                if (attrs.type.toLowerCase() == 'DateTime'.toLowerCase()) {
                    converter = { value: persianDate };

                    $(element).css('width', function() {
                        return 80;
                    });
                    $(element).datepicker({
                        changeMonth: true,
                        changeYear: true,
                        showButtonPanel: true,
                        dateFormat: 'yy/mm/dd'
                    });

                    $("#ui-datepicker-div").css("z-index", "9999");
                }

            }                
            

            var eventName = allBindingsAccessor()["valueUpdate"] || "change";

            var handleEventAsynchronously = false;
            if ((ko.utils.Xa || ko.utils.stringStartsWith)(eventName, "after")) {
                handleEventAsynchronously = true;
                eventName = eventName.substring("after".length);
            }
            var runEventHandler = handleEventAsynchronously
                ? function(handler) { setTimeout(handler, 0) }
                : function(handler) { handler() };

            ko.utils.registerEventHandler(element, eventName, function () {
                runEventHandler(function () {
                    var modelValue = valueAccessor();
                    var elementValue = ko.selectExtensions.readValue(element);

                    if (converter == undefined) {
                        eval("converter = {" + (element.getAttribute("data-converter") || "") + "}");
                        if (converter && converter.value) converter.name = 'float';
                    }

                    if (converter && converter.value) elementValue = converter.value.value(elementValue.toString());


                    if (ko.isWriteableObservable(modelValue)) {
                        if (converter.name === 'float') {
                            if (modelValue() === elementValue) $(element).val(float.display(elementValue));
                            modelValue(elementValue === '' ? 0 : elementValue);
                        } else {
                            modelValue(elementValue);
                        }
                        
                        
                    } else {
                        var allBindings = allBindingsAccessor();
                        if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['value'])
                            allBindings['_ko_property_writers']['value'](elementValue);
                    }
                });
            });
            
            //if (isBound)
            //    setBound.init(element, valueAccessor, allBindingsAccessor, viewModel);
            //else if (element.getAttribute('data-converter') != null) {
            //    needConverter.init(element, valueAccessor, allBindingsAccessor, viewModel);
            //}   
        },
        'update': function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var isBound = viewModel.entityType != undefined;
            var attrs = {};
            var converter;
            
            if (isBound) {
                attrs = getAttributes(element, valueAccessor, allBindingsAccessor, viewModel);
                
                if (attrs.type.toLowerCase() === 'Double'.toLowerCase()) {
                    converter = { value: float };
                }
                
                if (attrs.type.toLowerCase() === 'DateTime'.toLowerCase()) {
                    converter = { value: persianDate };
                }
            }
            
            var newValue = ko.utils.unwrapObservable(valueAccessor());
            var elementValue = ko.selectExtensions.readValue(element);
            var valueHasChanged = (newValue !== elementValue);


            // JavaScript's 0 == "" behavious is unfortunate here as it prevents writing 0 to an empty text box (loose equality suggests the values are the same). 
            // We don't want to do a strict equality comparison as that is more confusing for developers in certain cases, so we specifically special case 0 != "" here.
            if ((newValue === 0) && (elementValue !== 0) && (elementValue !== "0"))
                valueHasChanged = true;

            if (valueHasChanged) {
                if (converter == undefined) {
                    eval("converter = {" + (element.getAttribute("data-converter") || "") + "}");
                }

                if (converter && converter.value) newValue = converter.value.display(newValue);

                var applyValueAction = function () { ko.selectExtensions.writeValue(element, newValue); };
                applyValueAction();

                // Workaround for IE6 bug: It won't reliably apply values to SELECT nodes during the same execution thread
                // right after you've changed the set of OPTION nodes on it. So for that node type, we'll schedule a second thread
                // to apply the value as well.
                var alsoApplyAsynchronously = element.tagName == "SELECT";
                if (alsoApplyAsynchronously)
                    setTimeout(applyValueAction, 0);
            }

            // For SELECT nodes, you're not allowed to have a model value that disagrees with the UI selection, so if there is a
            // difference, treat it as a change that should be written back to the model
            if (element.tagName == "SELECT") {
                elementValue = ko.selectExtensions.readValue(element);
                if (elementValue !== newValue)
                    ko.utils.triggerEvent(element, "change");
            }

        }
    };
    ko.bindingHandlers['text'] = {
        'update': function (element, valueAccessor,allBindingsAccessor, viewModel) {
            var isBound = viewModel.entityType != undefined && !ko.getPropertyNameBinding(element).contains('$root');
            
            var attrs = {};
            var converter;
            
            // set bound prop works ....
            if (isBound) {
                attrs = getAttributes(element, valueAccessor, allBindingsAccessor, viewModel);
                
                if (attrs.type.toLowerCase() === 'Double'.toLowerCase()) {
                    converter = { text: float };
                }

                if (attrs.type.toLowerCase() === 'DateTime'.toLowerCase()) {
                    converter = { text: persianDate };
                }
            }

            var value = ko.utils.unwrapObservable(valueAccessor());
            if ((value === null) || (value === undefined))
                value = "";
            
            if (!(converter && converter.text)) {
                eval("converter = {" + (element.getAttribute("data-converter") || "") + "}");
                if (!(converter && converter.text))
                    if (typeof value == 'number')
                            converter = { text: float };
            } 
            
            if (converter && converter.text) value = converter.text.display(value);

            typeof element.innerText == "string" ? element.innerText = value
                                                 : element.textContent = value;
        }
    };
    
    window.float = function () {
        return {
            display: function (value) {
                value =  isNaN(value)? 0 : parseFloat(clearNoNumber(value));
                var toks = (value || 0).toFixed(3).replace('-', '').split('.');
                var display = $.map(toks[0].split('').reverse(), function(elm, i) {
                    return [(i % 3 == 0 && i > 0 ? ',' : ''), elm];
                }).reverse().join('');

                if (toks.count() > 1)
                    display += parseFloat(toks[1]) == 0 ? '' : '.' + toks[1];
                
                return value < 0 ? '(' + display + ')' : display;
            },
            value: function (value) {
                if (value === '') return value;
                var decimal;
                if (('' + value).contains('.'))
                    decimal = clearNoNumber(('' + value).split('.')[1]);
                else
                    decimal = '';
                
                value = (isNaN(clearNoNumber(value)) ? 0 : parseFloat(clearNoNumber(value))).toString();
                value = value + (decimal === '' ? '' : '.' + decimal);
                return parseFloat(value.replace(/[^0-9.-]/, ''));
            }
        };
    }();

    window.persianDate = function () {
        return {
            display: function (value) {
                if (value == null)
                    return '';
                if (value == '')
                    return '';
                return value.toPersian();
            },
            value: function (value) {
                if (value === '') return null;
               return  helper.date.persianToDate(value);
            }
        };
    }();

    function getAttributes(element, valueAccessor, allBindingsAccessor, viewModel) {
        var entityName = viewModel.entityType.shortName;
        var propName = ko.getPropertyNameBinding(element);
        var dataProperties = viewModel.entityType.dataProperties;
        var type;
        //var type = dataProperties.first(function (item) {
        //    return item.name == propName;
        //}).dataType.name;
        try {
            var proplist = propName.split('.');
            if (proplist.count() == 1) {
                type = dataProperties.first(function(item) {
                    return item.name == propName;
                }).dataType.name;
            } else {
                proplist.foreach(function(item) {
                    var prop = dataProperties.first(function(prp) {
                        return prp.name == item;
                    });
                    if (prop == null) {
                        prop = dataProperties.first(function(prp) {
                            return prp.name == item + 'ID';
                        });

                        dataProperties = prop.relatedNavigationProperty.entityType.dataProperties;
                    } else {
                        if (prop.relatedNavigationProperty == undefined)
                            type = prop.dataType.name;
                        else
                            dataProperties = prop.relatedNavigationProperty.entityType.dataProperties;
                    }
                });
            }
            //dataProperties = dataProperties.first(function(item) {
            //    return item.name == propName;
            //});

            if (type == undefined) throw new Error('type in ' + propName + 'is not found ...');

            var isRequired = helper.modelInfo.getValidatorByName(entityName, propName, 'required') != null || false;

            return {
                entityName: entityName,
                propName: propName,
                dataProperties: dataProperties,
                type: type,
                isRequired: isRequired
            };
        } catch(e) {
            return {
                entityName: '',
                propName: '',
                dataProperties: null,
                type: '',
                isRequired: false
            };

        }
    }


});