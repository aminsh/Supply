
define(['services/logger', 'durandal/app', 'plugins/router'],
function (logger, app, router) {
    var context = helper.datacontext;
    
    var currentMaster = ko.observable();
    
    var masterType = '';  //master || detail
    var masterName = ''; //like RequestGood , RequestDetailGood
    
    var add = function() {
        var initValue = {};

        var propName = getMasterPropName();
        
        initValue[propName + 'ID'] = currentMaster().ID();
        initValue[propName] = currentMaster();
        var entityName = 'SmallCost'
            + masterName
            + (masterType === 'detail' ? 'Detail' : '');
        var newEntity = context.addEntity(entityName, initValue);

        return newEntity;
    };

    var remove = function(item) {
        item[getMasterPropName()](null);

        if (item.entityAspect.entityState == 'Added')
            item.entityAspect.rejectChanges();

        item.entityAspect.setDeleted();
    };

    var isSmallCostsOpen = ko.observable(false);
    var openSmallCost = function() {
        isSmallCostsOpen(true);
    };

    var setMasterInfo = function(type,name) {
        masterType = type;
        masterName = name;
    };

    var getMasterPropName = function () {
        return 'Request'
            + (masterType === 'detail' ? 'Detail' : '')
            + masterName;
    };

    var getListName = function() {
        return 'SmallCost'
            + masterName
            + (masterType === 'detail' ? 'Detail' : '')
            + 's';
    };

    return {
        add: add,
        remove: remove,
        currentMaster: currentMaster,
        isSmallCostsOpen: isSmallCostsOpen,
        openSmallCost: openSmallCost,
        setMasterInfo: setMasterInfo,
        getListName: getListName
    };


});
