var helper = helper || {};

$(function () {

    String.prototype.startsWith = function (str) {
        return this.indexOf(str) == 0;
    };
    
    String.prototype.endsWith = function (str) {
        return this.lastIndexOf(str) == 0;
    };
    
    String.prototype.contains = function (str) {
        return this.indexOf(str) != -1;
    };
    
    String.prototype.trim = function() {
         return this.replace(/^\s+|\s+$/g, '');
    };

    String.prototype.ltrim = function() {
         return this.replace(/^\s+/, '');
    };

    String.prototype.rtrim = function() {
         return this.replace(/\s+$/, '');
    };

    String.prototype.fulltrim = function() {
         return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
    };
    
    String.prototype.replaceAll = function (token, newToken, ignoreCase) {
        var _token;
        var str = this + "";
        var i = -1;

        if (typeof token === "string") {

            if (ignoreCase) {

                _token = token.toLowerCase();

                while ((
                    i = str.toLowerCase().indexOf(
                        token, i >= 0 ? i + newToken.length : 0
                    )) !== -1
                ) {
                    str = str.substring(0, i) +
                        newToken +
                        str.substring(i + token.length);
                }

            } else {
                return this.split(token).join(newToken);
            }

        }
        return str;
    };

});