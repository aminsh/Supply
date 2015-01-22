var helper = helper || {};

$(function () {

    Array.prototype.removeAll = function () {
        while (this.length != 0) {
            this.shift();
        }
    };
    
    Array.prototype.remove = function () {
        var what,
            args = arguments,
            len = args.length,
            i;
        while (len && this.length) {
            what = args[--len];
            while ((i = this.indexOf(what)) !== -1) {
                this.splice(i, 1);
            }
        }
        return this;
    };


    Array.prototype.count = function (callback) {
        if (callback == undefined)
            return this.length;
        var filters = this.filter(callback);
        return filters.length;
    };

    Array.prototype.any = function (callback) {
        if(callback == undefined)
            return this.count() != 0;
        var filters = this.filter(callback);
        return filters.count() != 0;
    };

    Array.prototype.foreach = function(callback) {
        for (var i = 0; i < this.count(); i++) {
            var item = this[i];
            callback(item);
        }
    };

    Array.prototype.filter = function(callback) {
        var filters = [];

        this.foreach(function(item) {
            if (callback(item))
                filters.push(item);
        });

        return filters;
    };

    Array.prototype.first = function(callback) {
        if (!this.any())
            return null;
        
        if (callback == undefined)
            return this[0];
        
        var filters = this.filter(callback);

        return filters.any() ? filters[0] : null;
    };
    
    Array.prototype.last = function (callback) {
        if (!this.any())
            return null;

        if (callback == undefined)
            return this[this.count()-1];

        var filters = this.filter(callback);

        return filters.any() ? filters[filters.count() - 1] : null;
    };
    
    Array.prototype.select = function (callback) {
        if (!this.any())
            return [];

        var target = [];

        this.foreach(function (item) {
            target.push(callback(item));
        });

        return target;
    };

    
    Array.prototype.contains = function(param) {
        var source = this;
        var isValid = false;

        source.foreach(function(item) {
            if (item == param)
                isValid = true;
        });

        return isValid;
    };

    helper.isArray = function(param) {
        return Object.prototype.toString.call(param) === '[object Array]';
    };
});