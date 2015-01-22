$(function () {
    var unwrap = ko.utils.unwrapObservable;
    
    ko.bindingHandlers.autocomplete = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var $element = $(element),
                value = valueAccessor(),
                context = helper.datacontext,
                displayProp = value.displayProp,
                modelProp = value.modelProp,
                pluralEntityName = value.pluralEntityName || viewModel.entityType.defaultResourceName,
                allData = value.allData,
                options = { autoFocus: true },
                data = value.data,
                minLength = value.minLength == undefined ? 2 : value.minLength,
                dataStatus = value.data == undefined ? 'remote' : 'local';

            options.minLength = minLength;
            
            options.select = function(event, ui) {
                modelProp(ui.item.label);
                //$element.val(ui.item.label);
                return false;
            };

            options.focus = function(event, ui) {
                return false;
            };
            
            options.change = function (event, ui) {
                if (!ui.item) {
                    modelProp(input.val());
                    return false;
                }
                input.val(ui.item.label);
                return false;
            };
            
            options.source = function (request, response) {
                var displays = displayProp.split(',');

                if (dataStatus == 'local')
                    runLocal();
                else if (dataStatus == 'remote')
                    runRemote();

                return;

                function runLocal() {
                    var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term.trim()), "i");
                    response($.map(data, function (item) {
                        //var label = "";
                        //displays.foreach(function (p) {
                        //    label = label == "" ? item[p]() : label + " " + item[p]();
                        //});
                        if (!request.term.trim() || matcher.test(item[displayProp]))
                            return {
                                label: item[displayProp],
                                //value: item['ID'](),
                                //item: item
                            };
                    }));
                }

                function runRemote() {
                    var q = context.query(pluralEntityName).using(context.manager);

                    if (request.term.trim() != "") {
                        var preds = [];
                        displays.foreach(function (p) {
                            preds.push(breeze.Predicate.create(p, "contains", request.term));
                        });
                        
                        var pred = breeze.Predicate.or(preds);
                        
                        q = q.where(pred);
                        q = q.orderBy('ID').take(20);
                    }

                    context.executeQuery(q)
                        .then(function (data) {
                            response($.map(data.results, function (item) {
                                var label = "";
                                displays.foreach(function (p) {
                                    label = label == "" ? item[p]() : label + " " + item[p]();
                                });
                                return {
                                    label: label,
                                    value: label
                                };
                            }));
                        }).
                        fail(function(error) {
                            alert(error);
                        });
                }

            };
            var input = $element;
            input.autocomplete(options);
            input.autocomplete("option", "position", { my: "right top", at: "right bottom" });
            var ml = input.autocomplete("option", "minLength");

        },
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = valueAccessor();
            var modelProp = value.modelProp;
            var displayProp = value.displayProp;
            var $element = $(element);
            
            if (modelProp()) {
                //var item = modelProp();
                //var displays = displayProp.split(',');
                //var label = "";
                //displays.foreach(function (p) {
                //    label = label == "" ? item[p]() : label + " " + item[p]();
                //});

                $element.val(modelProp());
            }

        }
    };
    
    ko.bindingHandlers.combo = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var $element = $(element),
                value = valueAccessor(),
                context = helper.datacontext,
                displayProp = value.displayProp,
                valueProp = value.valueProp || ko.observable(),
                modelProp = value.modelProp,
                pluralEntityName = value.pluralEntityName,
                expands = value.expands || [],
                allData = value.allData,
                options = { autoFocus: true },
                data = value.data,
                minLength = value.minLength == undefined ? 2 : value.minLength,
                take = value.take || 20,
                dataStatus = value.data == undefined ? 'remote' : 'local',
                entityName = value.entityName || viewModel.entityType.shortName;
            

            
                var propNames = element.attributes['data-bind'].nodeValue
                    .match(/modelProp\s*:\s*(?:{.*,?\s*data\s*:\s*)?([^{},\s]+)/);
            
                var propName = (propNames && propNames[1]) ? propNames[1] : 'modelProp is not defined ....';
            
            if (value.pluralEntityName == undefined) {
                pluralEntityName = viewModel.entityType.navigationProperties
                    .first(function(item) {
                        return item.name == propName;
                    }).entityType.defaultResourceName;
            }

            var query = value.query || context.query(pluralEntityName);
            
            var isRequired = helper.modelInfo.getValidatorByName(entityName, propName, 'required') != null || false;
            
            if (isRequired)
                $(element).attr('required', 'required');
            
            options.minlength = minLength;
            
            options.select = function (event, ui) {
                input.val(ui.item.label);
                modelProp(ui.item.item);
                valueProp(ui.item.value);
                return false;
            };

            options.focus = function (event, ui) {
                return false;
            };

            options.change = function (event, ui) {
                if (!ui.item) {
                    input.val('');
                    modelProp(null);
                    valueProp(null);
                    return false;
                }
                input.val(ui.item.label);
                return false;
            };

            options.source = function (request, response) {
                var displays = displayProp.split(',');

                if (dataStatus == 'local')
                    runLocal();
                else if (dataStatus == 'remote')
                    runRemote();

                return;

                function runLocal() {
                    var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term.trim()), "i");
                    response($.map(data(), function (item) {
                        var label = "";
                        displays.foreach(function (p) {
                            label = label == "" ? item[p]() : label + " " + item[p]();
                        });
                        if (!request.term.trim() || matcher.test(label)) {
                            return  {
                                label: label,
                                value: item.hasOwnProperty('ID') ? item['ID']() : label,
                                item: item
                            };
                        }
                    }));
                }

                function runRemote() {
                    var q = query;
                    if (!(take == 0 || take == -1))
                        q = q.take(take);
                    q = q.expand(expands);
                    
                    if (request.term.trim() != "") {
                        var preds = [];
                        displays.foreach(function (p) {
                            preds.push(breeze.Predicate.create(p, "contains", request.term));
                        });
                        var pred = breeze.Predicate.or(preds);
                        q = q.where(pred);
                        q = q.orderBy('ID');
                    }

                    context.executeQuery(q)
                        .then(function (data) {
                            response($.map(data.results, function (item) {
                                //item.entityAspect.entityState = "Detached";
                                var label = "";
                                displays.foreach(function (p) {
                                    label = label == "" ? item[p]() : label + " " + item[p]();
                                });
                                return {
                                    label: label,
                                    value: item['ID'](),
                                    item: item
                                };
                            }));
                        });
                }

            };
            
            this.wrapper = $("<span>")
               .addClass("custom-combobox")
               .insertAfter($element);

            //Move input($element) to wrapper
            this.wrapper.prepend($element);
            var input = $element;
            
            input
                //.css('width', '90%')
                //.attr("title", "")
                .addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-right ");
            input.autocomplete(options).data("ui-autocomplete")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<a>" + item.label + "</a>")
                    .appendTo(ul);
            };

            input.autocomplete("option", "position", { my: "right top", at: "right bottom" });
            
            if (!allData) {
                input.addClass('ui-corner-left');
                return;
            }
            var wasOpen = false;

           
            
            $("<a>")
            .attr("tabIndex", -1)
            .tooltip()
            .appendTo(this.wrapper)
            .mousedown(function () {
                wasOpen = input.autocomplete("widget").is(":visible");
            })
            .button({
                icons: {
                    primary: "ui-icon-triangle-1-s"
                },
                text: false
            })
            .removeClass("ui-corner-all")
            .addClass("custom-combobox-toggle ui-corner-left").click(function () {
                input.focus();

                if (wasOpen) {
                    return;
                }

                input.autocomplete("search", " ");
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = valueAccessor();
            var modelProp = value.modelProp;
            var displayProp = value.displayProp;
            var $element = $(element);
            var callbackAfterUpdate = value.callbackAfterUpdate;

            if (modelProp()) {
                var item = modelProp();
                var displays = displayProp.split(',');
                var label = "";
                displays.foreach(function (p) {
                    label = label == "" ? item[p]() : label + " " + item[p]();
                });

                $element.val(label);
                $element.attr('title', label);

                if (callbackAfterUpdate != undefined)
                    callbackAfterUpdate(viewModel);
            } else {
                $element.val('');
                $element.attr('title', '');
            }
        }
    };

    ko.bindingHandlers.enumDisplay = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = valueAccessor(),
                allBindings = allBindingsAccessor();

            var propName = ko.getPropertyNameBinding(element);

            var enumtype = viewModel.entityType.dataProperties.first(function(item) {
                return item.name === propName;
            }).enumType.replace('Edm.Self.', '');
            
            var enumValue = value.value();

            helper.ajax.get('getEnum', enumtype, function (data) {
                data.foreach(function (item) {
                    if (item.Name == enumValue) {
                        $(element).text(item.DisplayName);
                        return;
                    }

                });

            });


        }
    };

    ko.bindingHandlers.enumCombo = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = valueAccessor(),
                allBindings = allBindingsAccessor(),
                $element = $(element),
                options = { autoFocus: true };
            var enumtype = value.Type;
            var isbound = viewModel.hasOwnProperty('entityType');
            
            if (isbound) {
                var entityName = viewModel.entityType.shortName,
                propName = ko.getPropertyNameBinding(element),
                isRequired = helper.modelInfo.getValidatorByName(entityName, propName, 'required') != null || false;
                
                if (isRequired)
                    $(element).attr('required', 'required');

                enumtype = viewModel.entityType.dataProperties.first(function(item) {
                    return item.name === propName;
                }).enumType.replace('Edm.Self.', '');
            }
            
            var enumValue = value.value;
            
            options.select = function (event, ui) {
                input.val(ui.item.label);
                enumValue(ui.item.value);
                
                return false;
            };

            options.focus = function (event, ui) {
                input.val(ui.item.label);
                return false;
            };

            options.change = function (event, ui) {
                if (!ui.item) {
                    input.val('');
                    enumValue(null);
                    
                    return false;
                }
                input.val(ui.item.label);
                return false;
            };
            
            options.source = function (request, response) {
                helper.ajax.get('getEnum', enumtype, function (data) {
                    response($.map(data, function(item) {
                        return {
                            label: item.DisplayName,
                            value: item.Name
                        };
                    }));
                });
            };
            
            this.wrapper = $("<span>")
               .addClass("custom-combobox")
               .insertAfter($element);

            //Move input($element) to wrapper
            this.wrapper.prepend($element);
            var input = $element;

            input
                //.css('width', '90%')
                .addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-right ");
            input.autocomplete(options).data("ui-autocomplete")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<a>" + item.label + "</a>")
                    .appendTo(ul);
            };

            input.autocomplete("option", "position", { my: "right top", at: "right bottom" });
            
            var wasOpen = false;

            $("<a>")
            .attr("tabIndex", -1)
            .tooltip()
            .appendTo(this.wrapper)
            .mousedown(function () {
                wasOpen = input.autocomplete("widget").is(":visible");
            }).button({
                icons: {
                    primary: "ui-icon-triangle-1-s"
                },
                text: false
            })
            .removeClass("ui-corner-all")
            .addClass("custom-combobox-toggle ui-corner-left").click(function () {
                input.focus();

                if (wasOpen) {
                    return;
                }

                input.autocomplete("search", " ");
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = valueAccessor(),
                allBindings = allBindingsAccessor();

            var enumtype = value.Type;
            var enumValue = value.value();

            helper.ajax.get('getEnum', enumtype, function (data) {
                data.foreach(function (item) {
                    if (item.Name == enumValue) {
                        $(element).val(item.DisplayName);
                        $(element).attr('title', item.DisplayName);
                        return;
                    }

                });

            });


        }
    };
    
    ko.bindingHandlers.dialog = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = valueAccessor(),
                allBindings = allBindingsAccessor();

            var removableOnDeativate = value.removableOnDeativate == undefined ? false : value.removableOnDeativate;
            if (removableOnDeativate) $(element).addClass('removableOnDeativate');

            var isOpen = value.isOpen == undefined ? ko.observable(false) : value.isOpen;
            var title = value.title == undefined ? '' : value.title;
            var minWidth = value.minWidth == undefined ? 400 : value.minWidth;
            var minHeight = value.minHeight == undefined ? 400 : value.minHeight;
            var maxHeight = value.minHeight == undefined ? 1000 : value.maxHeight;
            var maxWidth = value.minWidth == undefined ? 1000 : value.maxWidth;
            var my = value.my || 'left top';
            var at = value.at || 'left bottom';
            var parent = value.parent || window;
            var model = value.modal || false;
            var resizable = value.resizable || true;

            $(element).dialog({
                autoOpen: false,
                close: function (event, ui) {
                    isOpen(false);
                },
                title: title,
                position: { my: my, at: at, of: window },
                minWidth: minWidth,
                minHeight: minHeight,
                maxWidth: maxWidth,
                maxHeight: maxHeight,
                modal: model,
                resizable : resizable
            });
            
            $("#ui-datepicker-div").css("z-index", "9999");

            if (isOpen()) {
                $(element).dialog('open');
            } else {
                $(element).dialog('close');
            }
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = valueAccessor(),
                allBindings = allBindingsAccessor();

            var isOpen = value.isOpen;

            if (isOpen()) {
                $(element).dialog('open');
            } else {
                $(element).dialog('close');
            }

        }
    };

    ko.bindingHandlers.fadeVisible = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var shouldDispley = valueAccessor();
            $(element).toggle(shouldDispley);
        },
        update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var shouldDispley = valueAccessor(),
                allBindings = allBindingsAccessor(),
                duration = allBindings.fadeDuration || 500;

            shouldDispley ? $(element).fadeIn(duration) : $(element).fadeOut(duration);
        }
    };
    
    ko.bindingHandlers.slideVisible = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var shouldDispley = valueAccessor();
            $(element).toggle(shouldDispley);
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var shouldDispley = valueAccessor(),
                allBindings = allBindingsAccessor(),
                duration = allBindings.slideDuration || 500;
            
            shouldDispley ? $(element).slideDown(duration) : $(element).slideUp(duration);
        }
    };
    
    ko.bindingHandlers.slideSurroundedVisible = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var shouldDispley = valueAccessor();
            $(element).toggle(shouldDispley);
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var shouldDispley = valueAccessor(),
                allBindings = allBindingsAccessor(),
                duration = allBindings.slideDuration || 500;

            shouldDispley ? $(element).show('slide',duration) : $(element).hide('slide',duration);
        }
    };
    
    ko.bindingHandlers.checkboxImage = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var $el = $(element),
                settings = valueAccessor();

            $el.addClass('checkbox');

            $el.click(function () {
                if (settings.checked) {
                    settings.checked(!settings.checked());
                }
            });

            ko.bindingHandlers.checkboxImage.update(
                element, valueAccessor, allBindingsAccessor, viewModel);
        },
        update: function (element, valueAccessor) {
            var $el = $(element),
                settings = valueAccessor(),
                enable = (settings.enable !== undefined) ? unwrap(settings.enable()) : true,
                checked = (settings.checked !== undefined) ? unwrap(settings.checked()) : true;

            $el.prop('disabled', !enable);

            checked ? $el.addClass('selected') : $el.removeClass('selected');
        }
    };

    ko.bindingHandlers.effect = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var $element = $(element);
            var value = valueAccessor;
                
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var $element = $(element);
            var value = valueAccessor().value;
            var effectType = allBindingsAccessor().effectType;
            var transferTo = allBindingsAccessor().transferTo;
            valueAccessor().value(value());
            var options = {};
            // some effects have required parameters
            if (effectType === "scale") {
                options = { percent: 0 };
            } else if (effectType === "transfer") {
                options = { to: transferTo, className: "ui-effects-transfer" };
            } else if (effectType === "size") {
                options = { to: { width: 200, height: 60 } };
            }

            $element.effect(effectType, options, 500, callback);
            
            function callback() {
                setTimeout(function () {
                    $element.removeAttr("style").hide().fadeIn();
                }, 1000);
            };
        }
    };

    var _dragged;
    
    ko.bindingHandlers.drag = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var dragElement = $(element);
            var options = valueAccessor().options || {};
            if (!options.hasOwnProperty('start')) {
                options.start = function() {
                    _dragged = valueAccessor().source;
                };
            }
            //var options = {
            //    helper: 'clone',
            //    start: function () {
            //        _draged = value;
            //    }
            //};

            dragElement.draggable(options);
        }
    };
    
    ko.bindingHandlers.drop = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var dropElement = $(element);
            var dropCallback = valueAccessor().dropCallback;
            var target = valueAccessor().target;
            var options = valueAccessor().options || {};
            //var dropCallback = valueAccessor().dropCallback;
            options.drop = function(event, ui) {
                dropCallback(_dragged, target);
            };
            //var options = {
            //    drop: function (event, ui) {
            //        dropCallback(_draged);
            //    }
            //};

            dropElement.droppable(options);
        }
    };

    ko.bindingHandlers.position = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var parent = $(element);
            var value = valueAccessor();
            var target = value.target;
            var options = value.options;

            options.of = $(value.parent) || parent;

            $(target).position(options);
        }
    };
});