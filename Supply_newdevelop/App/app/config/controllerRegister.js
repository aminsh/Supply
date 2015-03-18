define(['app'], controllerRegister);

function controllerRegister(app) {
    return function(ctrlName , action) {
        app.register.controller(ctrlName, ['$scope', '$rootScope', action]);
    }  
}