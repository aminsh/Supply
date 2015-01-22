      
define(['services/logger',
  'services/common',
  'durandal/app',
  'plugins/router',
  'services/viewController'],
function (logger, com, app, router, viewController) {

    var activate = function () {
       
    };
    var canDeactivate = function () {
        return true;
    };

    var deactivate = function () {
        com.deactivate();
    };
    var viewAttached = function () {
    };

    var clearTemp = function() {
        localStorage.clear();
        helper.note.info('اطلاعات موقت حذف شد');
    };

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        viewAttached: viewAttached,
        title: 'تنظیمات',
        clearTemp: clearTemp
    };


});
   
