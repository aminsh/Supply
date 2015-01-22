define(['durandal/system', 'services/logger'],
    function (system,logger) {
        var datacontext = {
            
        };

        return datacontext;

        function init() {
            
        }

        init();
    });






helper.datacontext = function() {
    var observablesList = ko.observableArray(),
        hasChanges = ko.observable(false),
        manager = new breeze.EntityManager(window.getFullPath("/api/Supply")),
        init = function() {
            manager.hasChangesChanged.subscribe(function () {
                hasChanges(manager.hasChanges());
            });
        },
        query = function (pluralEntityname) {
            return breeze.EntityQuery.from(pluralEntityname);
        },
        executeQuery = function(query) {
            return manager.executeQuery(query)
                .fail(function (error) {
                    helper.note.error(error.message);
                });
        },
        executeQueryLocally = function(query) {
            return manager.executeQueryLocally(query);
        },
        addEntity = function (entityname, initialValue) {
            type = manager.metadataStore.getEntityType(entityname);
            newEntity = type.createEntity(initialValue);
            manager.addEntity(newEntity);
 
            return newEntity;
        },
        saveChanges = function () {
            if (hasChanges() == false) return 0;
            var changes = manager.getChanges();
                
            return manager.saveChanges().then(function () {
                helper.note.successDefault();
                hasChanges(false);

            }).fail(function (error) {
                helper.note.error(error.message);
            });
        },
        cancelChanges = function () {
            manager.rejectChanges();
        },
        addToList= function(observable) {
            observablesList.push(observable);
        }

    init();