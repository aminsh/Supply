
define(['services/logger', 'durandal/app', 'plugins/router'],
function (logger, app, router) {

    var calc = {
        prices: ko.observableArray(),
        qty: ko.observable(0),
        unitPrice: ko.observable(0),
        canPriceCalShow: ko.observable(false),
        currentItem: null
    };

    calc.init = function (item) {
        //var item = selectedRequestGoodDetail();
        calc.currentItem = item;
        calc.qty(item.Qty());
        calc.prices.removeAll();
        calc.canPriceCalShow(true);
    };

    calc.addPrice = function () {
        calc.prices.push({ price: ko.observable(0) });
    };

    calc.removePrice = function (item) {
        calc.prices.remove(item);
    };

    calc.sum = ko.computed(function () {
        var sum = 0;
        calc.prices.foreach(function (item) {
            sum += parseFloat(item.price());
        });

        return sum;
    });

    calc.calculatePrice = ko.computed(function () {
        calc.unitPrice(calc.sum() / calc.qty());
        return calc.unitPrice();
    });

    calc.confirm = function () {
        calc.currentItem.UnitPrice(calc.unitPrice());
        calc.currentItem.Qty(calc.qty());
        calc.canPriceCalShow(false);
    };

    calc.cancel = function () {
        calc.canPriceCalShow(false);
    };
    
    return calc;

});
