var helper = helper || {};

$(function () {

    window.isNumeric = function (input) {
        return (input - 0) == input && (input + '').replace(/^\s+|\s+$/g, "").length > 0;
    };

    window.clearNoNumber = function (input) {
        if (input == undefined) return 0;
        input = input.toString();
        var inputlist = input.split('');
        var value = '';
        inputlist.foreach(function(item) {
            value += isNumeric(item) || item === '.' || item === '-' ? item : '';
        });
       
        return value;
    };
    
});