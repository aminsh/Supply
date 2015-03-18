
function contactUsController(vm) {
    vm.name = "amin sheikhi";
    vm.phone = "09126408566";

    vm.sendMessage = function() {
        alert('Message will be sent ...');
    };
}

define(['config/controllerRegister'],
    function (register) {
        register('contactUsController', contactUsController);
    });