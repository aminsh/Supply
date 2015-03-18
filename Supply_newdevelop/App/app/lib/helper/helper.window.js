window.getKeys = function (obj) {
    var keys = [];
    for (key in obj) {
        keys.push(key);
    }

    return keys;
};

window.isNullOrEmpty = function (obj) {
    if (obj == undefined) return true;
    if (obj === '') return true;
    if (obj == null) return true;

    return false;
};

window.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

window.thumbFilename = function (filename) {
    if (filename == undefined)
        return '';

    if (filename == '')
        return '';

    var dot = filename.lastIndexOf(".");
    if (dot == -1)
        return "";

    var extension = filename.substr(dot, filename.length);


    filename = filename.replace(extension, "");
    filename = filename.replace("~", "");

    return filename + "_Thumb" + extension;
};

window.isNumeric = function (input) {
    return (input - 0) == input && (input + '').replace(/^\s+|\s+$/g, "").length > 0;
};

window.clearNoNumber = function (input) {
    if (input == undefined) return 0;
    input = input.toString();
    var inputlist = input.split('');
    var value = '';
    inputlist.foreach(function (item) {
        value += isNumeric(item) || item === '.' || item === '-' ? item : '';
    });

    return value;
};

window.isOddNumber = function(number) {
    var isOdd = number % 2 != 0;
    return isOdd;
};

window.isEvenNumber = function (number) {
    var isEven = number % 2 == 0;
    return isEven;
};

window.newGuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

window.startLoading = function () {
    var newId = newGuid();

    var waitingTag = '<div id="' + newId + '" class="isloading-overlay waiting" ' +
        'style="position:fixed; left:0; top:0; z-index: 10010;  width: 100%; height: 100%;" />';
    $("body").prepend(waitingTag);
    $('.isloading-overlay').html('<div class="ui large active inverted dimmer"><div class="ui large text loader">لطفا چند لحظه صبر کنید</div></div>');

    setTimeout(function () {
        $('#' + newId).remove();
    }, 60000);
};

window.endLoading = function () {
    $('.waiting').remove();
};

window.startSectionLoding = function (element) {
    var loading = '<div id="segment" class="ui active inverted dimmer"><div class="ui text loader"></div></div>';
    element.append(loading);

    element.addClass('ui segment');
};

window.endSectionLoding = function (element) {
    element.removeClass('ui segment');
    element.find('#segment').remove();
};
