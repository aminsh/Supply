var helper = helper || {};

$(function () {
    
    helper.getFullPath = function (relativePath) {
        //return window.location.origin;
        var root = helper.config.urlRoot.get();
        if (root != "") root = "/" + root;
        
        if (relativePath.startsWith("/"))
            return root + relativePath;
        else
            return root + "/" + relativePath;
    };
    
    window.getFullPath = function (relativePath) {
        //return window.location.origin + "/" + relativePath;
        var root = helper.config.urlRoot.get().replace("/", "");;
        if (root != "") root = "/" + root;
        
        if (relativePath.startsWith("/"))
            return root + relativePath;
        else
            return root + "/" + relativePath;
    };

    window.getKendoDataSourceForEnum = function(enumName) {
        return {
            type: 'application/json',
            transport: {
                read: window.getFullPath('api/Enum/GetEnums/' + enumName)
            }};
    };
    
    window.getKendoDataSource = function (entityName) {
        return {
            type: 'application/json',
            serverFiltering: true,
            serverPaging: true,
            pageSize: 20,
            transport: {
                read: {
                    url: window.getFullPath('/api/Supply/' + entityName)
                },
                parameterMap: function (options, operation) {
                    var paramMap = kendo.data.transports.odata.parameterMap(options);
                    delete paramMap.$inlinecount;
                    delete paramMap.$format;

                    return paramMap;
                }
            }
        };
    };

    window.getKeys = function(obj) {
        var keys = [];
        for (key in obj) {
            keys.push(key);
        }

        return keys;
    };

    window.isNullOrEmpty = function(obj) {
        if (obj == undefined) return true;
        if (obj === '') return true;
        if (obj == null) return true;

        return false;
    };
});