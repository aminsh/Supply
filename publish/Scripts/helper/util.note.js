/// <reference path="../toastr.js" />
var helper = helper || {};
$(function () {
    
   
    

   
    ////Breeze
    
    helper.context = (function () {
        var serviceName = '/api/PurchasingOfficer',
            manager = new breeze.EntityManager(serviceName),
            query = function(entity,observableArray) {
                var q = breeze.EntityQuery.from(entity);
                return manager.executeQuery(q).then(function (data) {
                    observableArray(data.results);
                }).fail(function (error) {
                    myUtil.note.error(error.message);
                });
            },
            saveChanges = function() {
                manager.saveChanges().then(function() {
                    myUtil.note.successDefult();
                    hasChanges(false);
                }).fail(function(error) {
                    myUtil.note.error(error.message);
                });
            },
            cancelChanges = function() {
                manager.rejectChanges();
                myUtil.note.info("به درخواست کاربر عملیات لغو شد");
            },
            sethasChanges=function(observable) {
                manager.entityChanged.subscribe(function() {
                    observable(manager.hasChanges());
                });
            },
            addEntity = function (entity,value) {
                var type = manager.metadataStore.getEntityType(entity);
                var newEntity = type.createEntity(value);
                manager.addEntity(newEntity);
                return newEntity;
                
            },
            hasChanges = ko.observable(false)
            
        manager.hasChangesChanged.subscribe(function () {
            hasChanges(manager.hasChanges());
        });
        return {
            manager: manager,
            query: query,
            saveChanges: saveChanges,
            sethasChanges: sethasChanges,
            hasChanges: hasChanges,
            cancelChanges: cancelChanges,
            addEntity: addEntity
        };
    })();

    //myUtil.datacontext = function(entityname, observableArray) {
    //    var servicename = "/api/" + entityname,
    //        manager = new breeze.EntityManager(servicename),
    //        list = observableArray,
    //        mainList = observableArray,
    //        hasChanges = ko.observable(false),
    //        query = function() {

    //        },
    //        addEntity = function(value) {
    //            var type = manager.metadataStore.getEntityType(entityname);
    //            var newEntity = type.createEntity(value);
    //            manager.addEntity(newEntity);
    //            return newEntity;
    //        },
    //        removeEntity = function (entity) {
    //            if (entity.ntityAspect.entityState == "Added") {
    //                list.remove(entity);
    //                return;
    //            }
                    
    //            entity.entityAspect.setDeleted();
                
    //            var filter = ko.utils.arrayFilter(self.purchasingOfficers(), function (item) {
    //                return item.entityAspect.entityState != "Deleted";
    //            });

    //            list(filter);
    //        },
    //        saveChanges = function() {
    //            return manager.saveChanges().then(function() {
    //                myUtil.note.successDefult();
    //                hasChanges(false);
    //                mainList(list);
    //            }).fail(function(error) {
    //                myUtil.note.error(error.message);
    //            });
    //        },
    //        cancelChanges = function() {
    //            manager.rejectChanges();
    //            list(mainList());
    //            var filter = ko.utils.arrayFilter(list, function (p) {
    //                return p.entityAspect.entityState != "Detached";
    //            });
    //            list(filter);
    //            myUtil.note.info("به درخواست کاربر عملیات لغو شد");
    //        }

    //    return {
    //        query: query,
    //        saveChanges: saveChanges,
    //        hasChanges: hasChanges,
    //        cancelChanges: cancelChanges,
    //        addEntity: addEntity
    //    };


    //}

});