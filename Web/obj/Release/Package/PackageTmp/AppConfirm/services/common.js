define(['durandal/system'],
    function (system) {
        var common = {};

        common.activate = function() {

        };

        common.deactivate = function() {
            $('.k-window, .k-overlay, .removableOnDeativate').remove();
        };
        
        return common;
    });