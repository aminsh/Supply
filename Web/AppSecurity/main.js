// Maps the files so Durandal knows where to find these.
require.config({
    paths: {
        'text': '../Scripts/text',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions'
    }
});

// Durandal 2.x assumes no global libraries. It will ship expecting 
// Knockout and jQuery to be defined with requirejs. .NET 
// templates by default will set them up as standard script
// libs and then register them with require as follows: 
define('jquery', function () { return jQuery; });
define('knockout', ko);

define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'plugins/router', 'services/logger'], boot);

function boot (app, viewLocator, system, router, logger) {

    // Enable debug message to show in the console 
    system.debug(true);

    app.title = 'تدارکات';

    app.configurePlugins({
        router: true,
        dialog: true,
        widget: {
            kinds: ['multiSelect', 'multiSelectEnum', 'monthSelector', 'seasonSelector', 'currentDateSelector']
        }
    });
    
    app.start().then(function () {
        toastr.options.positionClass = 'toast-top-left';
        toastr.options.backgroundpositionClass = 'toast-top-left';

        // When finding a viewmodel module, replace the viewmodel string 
        // with view to find it partner view.
        // [viewmodel]s/sessions --> [view]s/sessions.html
        // Defaults to viewmodels/views/views. 
        // Otherwise you can pass paths for modules, views, partials
        viewLocator.useConvention();
        
        //Show the app by setting the root view model for our application.
        app.setRoot('viewmodels/shell', 'entrance');
        
        //for conflict jquery ui & bootstrap js 
        var btn = $.fn.button.noConflict();
        $.fn.btn = btn;

        var bootstrapTooltip = $.fn.tooltip.noConflict();
        $.fn.bstooltip = bootstrapTooltip;

        //for styling tooltip
        $(document).tooltip({
            position: {
                my: "center bottom-20",
                at: "center top",
                using: function (position, feedback) {
                    $(this).css(position);
                    $("<div>")
                    .addClass("arrow")
                    .addClass(feedback.vertical)
                    .addClass(feedback.horizontal)
                    .appendTo(this);
                }
            }
        });
    });
};