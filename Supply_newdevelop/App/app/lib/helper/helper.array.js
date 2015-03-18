Array.prototype.filter = function(predicate) {
    return Enumerable.From(this).Where(predicate).ToArray();
};



Array.prototype.first = function(predicate) {
    return Enumerable.From(this).First(predicate);
};

Array.prototype.last = function(predicate) {
    return Enumerable.From(this).Last(predicate);
};

Array.prototype.select = function(predicate) {
    return Enumerable.From(this).Select(predicate).ToArray();
};

Array.prototype.selectMany = function(predicate) {
    return Enumerable.From(this).SelectMany(predicate);
};

Array.prototype.skip = function(count) {
    return Enumerable.From(this).Skip(count).ToArray();
};

Array.prototype.skip = function (count) {
    return Enumerable.From(this).Skip(count).ToArray();
};

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

window.isArray = function(obj) {
    return angular.isArray(obj);
};
