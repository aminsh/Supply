define(['services/logger', 'plugins/router'], function (logger, router) {
    var vm = {
        activate: activate,
        title: 'صفحه اصلی'
    };

    return vm;
    
    
    function activate() {
        return true;
    } 
});