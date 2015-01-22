var helper = helper || {};

$(function () {

    amplify.request.define("getEnum", "ajax", {
        url: window.getFullPath("api/Enum/GetEnums/{enum}"), 
        type: "GET",
        dataType: "json",
        cache: "persist"
    });
    
    amplify.request.define("wcf", "ajax", {
        url: window.getFullPath("http://localhost:3000/HRService.svc/People"),
        type: "GET",
        dataType: "odata",
        cache: "persist"
    });
    
    amplify.request.define("modelInfos", "ajax", {
        url: window.getFullPath("api/ModelInfo/GetModelInfos"),
        type: "GET",
        dataType: "json",
        cache: "persist"
    });
    
    amplify.request.define("getCurrentUser", "ajax", {
        url: window.getFullPath("api/Defaults/CurrentUser"),
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        charset:'utf-8'
    });
    
    amplify.request.define("getCurrentPeriod", "ajax", {
        url: window.getFullPath("api/Defaults/CurrentPeriod"),
        type: "GET",
        dataType: "json",
        
    });
    
    amplify.request.define("getInventory", "ajax", {
        url: window.getFullPath("api/Inventory/GetInventrory/{itemGoodID}"),
        type: "GET",
        dataType: "json"
    });
    
    amplify.request.define("createOutputInventory", "ajax", {
        url: window.getFullPath("api/Inventory/GetCreateOutput/{requestGoodID}"),
        type: "GET",
        dataType: "json"
    });
    
    amplify.request.define("createInputInventory", "ajax", {
        url: window.getFullPath("api/Inventory/GetCreateInput/{requestGoodID}"),
        type: "GET",
        dataType: "json"
    });
    
    amplify.request.define("logoff", "ajax", {
        url: window.getFullPath("api/Account/Logoff"),
        type: "POST",
        dataType: "json"
    });
    helper.ajax = (function () {
        var get = function(resouseId,enumName,calback) {
            amplify.request(resouseId, { enum: enumName }, calback);
        },
        getModelInfos = function(resourceId,calback) {
            amplify.request(resourceId, {}, calback);
        },
        getWcf = function(calback) {
            amplify.request("wcf", calback);
        },
        getCurrentUser = function (callback) {
            amplify.request('getCurrentUser', callback);
        },
        getCurrentPeriod = function (callback) {
            amplify.request('getCurrentPeriod', callback);
        },
        getInventory = function(itemGoodId,callback) {
            amplify.request('getInventory', { itemGoodID: itemGoodId }, callback);
        },
        doLogoff = function(callback) {
            amplify.request('logoff', callback);
        }
        
        return {
            get: get,
            getWcf: getWcf,
            getModelInfos: getModelInfos,
            getCurrentUser: getCurrentUser,
            getCurrentPeriod: getCurrentPeriod,
            getInventory: getInventory,
            doLogoff: doLogoff
        };
    })();
});