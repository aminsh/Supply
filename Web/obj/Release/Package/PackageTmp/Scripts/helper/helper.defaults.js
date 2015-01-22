var helper = helper || {};

$(function () {

    helper.defaults = (function () {
        var
        currentUser = ko.observable(),
        currentPeriod = ko.observable(),
        currentPeriodTitle = ko.observable('');
        setCurrentUser = function (user) {
            currentUser(user);
        },
        setCurrentPeriod = function (period) {
            period.DateFrom = new Date(period.DateFrom);
            period.DateTo = new Date(period.DateTo);
            period.Title = period.DateFrom.toPersian() + ' ... ' + period.DateTo.toPersian();
            currentPeriodTitle(period.Title);
            currentPeriod(period);
        }

        return {
            currentUser: currentUser,
            currentPeriod: currentPeriod,
            currentPeriodTitle: currentPeriodTitle,
            setCurrentPeriod: setCurrentPeriod,
            setCurrentUser: setCurrentUser
        };

    })();

});