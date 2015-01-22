var helper = helper || {};

$(function () {
    
    helper.note = (function() {
        var success = function(message) {
            toastr.success(message,
                {
                    positionClass: "toast-top-left"
                });
        },
        successDefault = function() {
            success("عملیات با موفقیت انجام شد");
        },
        info = function (message) {
            toastr.info(message,
                {
                    positionClass: "toast-top-left"
                });
        },
        error = function (message) {
            toastr.error(message,
                {
                    positionClass: "toast-top-left"
                });

        },
        warning = function (message) {
            toastr.warning(message,
                {
                    positionClass: "toast-top-left"
                });
        }
        
        return {
            success: success,
            successDefault: successDefault,
            info: info,
            error: error,
            warning: warning
        };
    })();
});