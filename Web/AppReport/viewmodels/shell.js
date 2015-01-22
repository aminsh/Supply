define(['durandal/system', 'plugins/router', 'services/logger', 'viewmodels/tools/periodSelector'],
    function (system, router, logger, periodSelector) {
        var currentUser = ko.observable();
        var currentPerid;
        var shell = {
            activate: activate,
            attached: attached,
            router: router,
            periodSelector: periodSelector,
            currentUser: currentUser,
            currentPerid: helper.defaults.currentPeriodTitle,
            changePeriod: function() {
                alert('You are change period');
                helper.defaults.currentPeriodTitle('lksjljdflkjasld');
            },
            logoff: logoff
        };
        
        return shell;

        //#region Internal Methods
        function activate() {
            helper.ajax.getCurrentUser(function(user) {
                helper.defaults.setCurrentUser(user);
                currentUser(user.FullName);
            });
            helper.ajax.getCurrentPeriod(function (period) {
                helper.defaults.setCurrentPeriod(period);
                
            });

            periodSelector.init();
            return boot();
        }

        function logoff() {
            helper.ajax.doLogoff(function() {
                window.location = window.location;
            });
        }
        function attached() {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 100) {
                    $('.scrollup').fadeIn();
                } else {
                    $('.scrollup').fadeOut();
                }
            });

            $('.scrollup').click(function () {
                $("html, body").animate({ scrollTop: 0 }, 600);
                return false;
            });
        }
        
        function boot() {
            
            log('سیستم بارگزاری شد ...!', null, true);

            router.on('router:route:not-found', function (fragment) {
                logError('No Route Found', fragment, true);
            });

            var routes = [
                { route: '', moduleId: 'home', title: 'صفحه اصلی', nav: 1 },
                { route: 'confirm(/:key)', moduleId: 'confirm', title: 'تایید', nav: 1 },
                { route: 'supplyReview', moduleId: 'supplyReview', title: '', nav: 1 }
            ];
            
            return router.makeRelative({ moduleId: 'viewmodels' }) // router will look here for viewmodels by convention
                .map(routes)            // Map the routes
                .buildNavigationModel() // Finds all nav routes and readies them
                .activate();            // Activate the router
        }

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }

        function logError(msg, data, showToast) {
            logger.logError(msg, data, system.getModuleId(shell), showToast);
        }
        //#endregion
    });