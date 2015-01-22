var helper = helper || {};

$(function() {

    
    ko.observableArray.fn.removeEntity = function (entity) {
        if (entity.entityAspect.entityState == "Added") {
            entity.entityAspect.rejectChanges();
            //this(this.filter(function(item) {
            //    return item.entityAspect.entityState != "Detached";
            //}));
            this.remove(entity);
            return;
        }

        entity.entityAspect.setDeleted();
        
        var filter = this.filter(function (item) {
            return item.entityAspect.entityState != "Deleted";
        });

        this(filter);
    };

    ko.observableArray.fn.addEntity = function (context, entityname, initialValue) {
        var newEntity = context.addEntity(entityname, initialValue);
        this.push(newEntity);
        return newEntity;
    };
    
    ko.observableArray.fn.executeQuery = function (context, query) {
        var list = this;
        return context.executeQuery(query).then(function(data) {
            list(data.results);
        });
    };

    ko.observableArray.fn.executeQueryLocally = function(context, query) {
        var list = this;
        list(context.executeQueryLocally(query));
    };

    ko.observable.fn.executeQuery = function(context, query) {
        var list = this;
        return context.executeQuery(query).then(function(data) {
            list(data.results[0]);
        });
    };
    
    ko.observable.fn.executeQueryLocally = function (context, query) {
        var list = this;
        list(context.executeQueryLocally(query)[0]);
    };
    
    ko.observable.fn.addEntity = function (context, entityname, initialValue) {
        var newEntity = context.addEntity(entityname, initialValue);
        this(newEntity);
        return newEntity;
    };
    
    ko.observable.fn.removeEntity = function (entity) {
        entity.entityAspect.setDeleted();
        this(undefined);
    };
});