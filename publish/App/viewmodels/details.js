define(['services/logger'], function (logger) {
    var vm = {
        activate: activate,
        canDeactivate: canDeactivate,
        title: 'Details View'
    };

    return vm;

    //#region Internal Methods
    function activate() {
        //logger.log('Details View Activated', null, 'details', true);
        return true;
    }

    function canDeactivate() {
        //logger.log('Details View DeActivated', null, 'details', true);
        return true;
    }
    //#endregion
});