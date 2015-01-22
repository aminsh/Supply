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
                { route: 'purchasingOfficer', moduleId: 'purchasingOfficer', title: 'کارپرداز', nav: 1 },
                { route: 'requestGood/main', moduleId: 'requestGood/main', title: 'درخواست سفارش خرید کالا', nav: 1 },
                { route: 'requestService/main', moduleId: 'requestService/main', title: 'درخواست خدمات', nav: 1 },
                { route: 'requestFood/main', moduleId: 'requestFood/main', title: 'درخواست مواد غذایی', nav: 1 },
                { route: 'requestVehicle/main', moduleId: 'requestVehicle/main', title: 'درخواست نقلیه', nav: 1 },
                { route: 'requestTicket/main', moduleId: 'requestTicket/main', title: 'درخواست  بلیط', nav: 1 },
                { route: 'inventory/inventory', moduleId: 'inventory/inventory', title: 'رسید / حواله', nav: 1 },
                { route: 'inventory/output/main', moduleId: 'inventory/output/main', title: 'حواله', nav: 1 },
                { route: 'itemGood', moduleId: 'itemGood', title: 'کالا', nav: 1 },
                { route: 'itemService', moduleId: 'itemService', title: 'انواع خدمات', nav: 1 },
                { route: 'itemFood', moduleId: 'itemFood', title: 'انواع مواد غذایی', nav: 1 },
                { route: 'itemVehicle', moduleId: 'itemVehicle', title: 'انواع خدمات نقلیه', nav: 1 },
                { route: 'everyone', moduleId: 'everyone', title: 'اشخاص غیر سازمانی', nav: 1 },
                { route: 'section', moduleId: 'section', title: 'قسمت', nav: 1 },
                { route: 'stock', moduleId: 'stock', title: 'انبار', nav: 1 },
                { route: 'seller', moduleId: 'seller', title: 'فروشنده', nav: 1 },
                { route: 'costType', moduleId: 'costType', title: 'نوع هزینه', nav: 1 },
                { route: 'vehicleType', moduleId: 'vehicleType', title: 'نوع وسیله نقلیه', nav: 1 },
                { route: 'driver', moduleId: 'driver', title: 'راننده', nav: 1 },
                { route: 'vehicle', moduleId: 'vehicle', title: 'وسیله نقلیه', nav: 1 },
                { route: 'period', moduleId: 'period', title: 'دوره', nav: 1 },
                { route: 'defaultSetting', moduleId: 'defaultSetting', title: 'تنظیمات', nav: 1 },
                { route: 'requestGood/requestGoodReview', moduleId: 'requestGood/requestGoodReview', title: 'مرور درخواست کالا', nav: 1 },
                { route: 'requestService/requestReview/:requestType', moduleId: 'requestService/requestReview', title: 'مرود درخواست خدمات', nav: 1 },
                { route: 'scale', moduleId: 'scale', title: 'Home', nav: 1 },
                { route: 'tools/search', moduleId: 'tools/search', title: 'جستجوی پیشرفته', nav: 2 },
                { route: 'userDefinedCategory', moduleId: 'userDefinedCategory', title: 'دسته بندی سفارشی', nav: 2 },
                { route: 'security/main', moduleId: 'security/main', title: 'مدیریت امنیت', nav: 2 },
                { route: 'consumerSectionRequest/confirmOne', moduleId: 'consumerSectionRequest/confirmOne', title: 'تاییدیه', nav: 2 },
                { route: 'confirm/good/expertGood', moduleId: 'confirm/good/expertGood', title: 'کارشناس کالا', nav: 2 },
                { route: 'confirm/service/expertService', moduleId: 'confirm/service/expertService', title: 'کارشناس خدمات', nav: 2 },
                { route: 'confirm/expert/confirmExpert(/:id)', moduleId: 'confirm/expert/confirmExpert', title: 'کارشناسی', nav: 2 },
                { route: 'request/main', moduleId: 'request/main', title: 'درخواست تجمیعی', nav: 2 }
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