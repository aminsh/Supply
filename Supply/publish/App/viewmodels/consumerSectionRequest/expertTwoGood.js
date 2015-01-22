

define(['services/logger',
  'services/common',
  'durandal/app',
  'plugins/router',
  'services/viewController'],
function (logger, com, app, router, viewController) {

    var activate = function () {
        pager(new helper.pager(context, requests));

        helper.ajax.get('getEnum', 'ConsumerSectionRequestType',
            function(data) {
                requestTypes(data);
            });
        
        return init();
    };
    var canDeactivate = function () {
        if (hasChanges()) {
            var title = 'آیا مایل به ادامه عملیات هستید ؟';

            var msg = 'ترک صفحه و لغو تغییرات';

            return app.showMessage(title, msg, ['Yes', 'No'])
                .then(checkAnswer);
        }
        return true;

        function checkAnswer(selectedOption) {
            if (selectedOption === 'Yes') {
                cancel();
            }
            return selectedOption;
        }
    };

    var deactivate = function () {
        com.deactivate();
    };
    var attached = function () {
    };

    var requests = ko.observableArray([]);
    var reqs = ko.observableArray([]);
    var requestTypes = ko.observableArray();

    var init = function () {
        var q = context.query('RequestGoods');
        q = q.where('Status', '==', 'RequestGood');

        var navigarions = [
            "Section",
            "Person",
            "RequestDetailGoods",
            "RequestDetailGoods.ItemGood"
        ];

        q = q.expand(navigarions);

        pager().setQuery(q);
        pager().changeAllData(false);
        pager().setCallback(function(data) {
            var results = data.results;
            results.foreach(function(item) {
                item.RequestDetailGoods.foreach(function(rdg) {
                    rdg.isSelected = ko.observable(false);
                    if (rdg.ItemGood().No() == '000') {
                        rdg.ItemGood(null);
                        rdg.ItemGoodID(null);
                    }
                        
                });
            });

            requests(results);
        });
        return pager().load();
    };

    var save = function () {
        if (hasChanges())
            context.saveChanges();
    };

    var saveRequest = function(item,callbackAfterUpdate) {
        var items = [];
        if (!item.entityAspect.entityState.isUnchanged())
            items.push(item);
        item.RequestDetailGoods.foreach(function (rdg) {
            if (!rdg.entityAspect.entityState.isUnchanged())
                items.push(rdg);
        });

        context.manager.saveChanges(items)
            .then(function() {
                helper.note.successDefault();
                callbackAfterUpdate();
            })
            .fail(function(error) {
                helper.note.error(error.errorMessage);
            });
    };
    var cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            pager().loadLocally();
        }
    };

    var goToOrderAll = function (item) {
        item.HasOrder(true);
        item.Status('Order');
        item.RequestDetailGoods.foreach(function (rdg) {
                rdg.IsOrder(true);
        });
        saveRequest(item, function() {
            requests.remove(item);
        });
    };

    var goToOrderSelectedRows = function (item) {
        item.HasOrder(true);
        item.RequestDetailGoods.foreach(function(rdg) {
            if (rdg.isSelected())
                rdg.IsOrder(true);
        });
        saveRequest(item, function () {
            requests.remove(item);
        });
    };
    
    var goToOrderLessInventory = function (item) {
        item.HasOrder(true);
        item.RequestDetailGoods.foreach(function (rdg) {
            if (rdg.InventoryQty() < rdg.Qty())
                rdg.IsOrder(true);
        });
        saveRequest(item, function () {
            requests.remove(item);
        });
    };

    var goToOutputInventory = function (item) {
        //item.IsFast(true);
        //item.Status('Confirm');
        ////item.Status('CreateOutputInventory');
        //saveRequest(item, function () {
        //    helper.note.success('درخواست جاری با حواله انبار شماره 400 صادر شد');
        //    requests.remove(item);
        //});

        //$.ajax('/api/Inventory/CreateOutputInventory', {
        //    dataType: "json",
        //    contentType: "application/json",
        //    cache: false,
        //    data: item.ID(),
        //    type: 'POST'
        //}).done(function(data) {
        //    helper.note.success('درخواست جاری با حواله انبار شماره 400 صادر شد');
        //    requests.remove(item);
        //}).fail(function(error) {
        //    alert('Error ....');
        //});

        function success(data) {
            helper.note.success('درخواست جاری با حواله انبار شماره 0 صادر شد');
            requests.remove(item);
        }

        function error(data) {
            helper.note.error(data.ExceptionMessage);
        }
        amplify.request('createOutputInventory', { requestGoodID: item.ID() },success,error);
    };
    
    var rejectRequest = function (item) {
        item.Status('Rejected');
        context.manager.saveChanges([item])
            .then(function () {
                requests.remove(item);
                helper.note.successDefault();
            });
    };

    var changeAccepted = function (item) {
        item.IsAcceped(!item.IsAcceped());
    };

    var confirmRequest = function (item) {
        item.Status('ConfirmLevel3');
        var items = item.ConsumerSectionRequestDetails();
        context.manager.saveChanges(items)
            .then(function () {
                context.manager.saveChanges([item]).then(function () {
                    requests.remove(item);
                    helper.note.successDefault();
                });
            });
    };

    var changeAccept = function (item) {
        item.IsAccepted(!item.IsAccepted());
    };

    var changeShowStatus = function (item) {
        //item.RequestDetailGoods.foreach(function(rg) {
        //    $.ajax('/api/Inventory/GetInventrory', {
        //        dataType: "json",
        //        contentType: "application/json",
        //        cache: false,
        //        type: 'GET'
        //    }).done(function (data) {
        //        rg.InventoryQty(data);
        //    }).fail(function (error) {
        //        alert('Error ....');
        //    });
        //});

        item.ShowDetail(!item.ShowDetail());
    };

    var getInventoryQty = function (item) {
        item.InventoryQty(-2);
        helper.ajax.getInventory(item.ItemGoodID(), function(data) {
            item.InventoryQty(data);
        });
        //$.ajax('/api/Inventory/GetInventrory', {
        //    dataType: "json",
        //    contentType: "application/json",
        //    cache: false,
        //    type: 'GET'
        //}).done(function (data) {
        //    item.InventoryQty(data);
        //}).fail(function (error) {
        //    alert('Error ....');
        //});
    };
    var getRequestTypeCss = function(item) {
        if (item.Name === 'Good')
            return { 'icon-shopping-cart': true };
        //if (item.Name === 'Food')
        //    return { 'Food': true };
        if (item.Name === 'Service')
            return { 'icon-wrench': true };
        if (item.Name === 'Vehicle')
            return { 'icon-cog': true };
        if (item.Name === 'Ticket')
            return { 'icon-plane': true };
        return { 'icon-chevron-left': true };
    };
    var getRquestTypeDisplay = function(name) {
        return requestTypes().first(function(item) {
            return item.Name === name;
        }).DisplayName;
    };

    var changeRequestType = function(item,parent) {
        parent.ConsumerSectionRequestType(item.Name);
    };

    var getTitle = function(obj) {
        if (isNullOrEmpty(obj))
            return '';
        return obj;
    };

    var itemGoodAfterUpdate = function (item) {
        if(item.InventoryQty()<=0)
            getInventoryQty(item);
    };
    
    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var pager = ko.observable();

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        attached: attached,
        title: 'درخواست کالا',
        hasChanges: hasChanges,
        requests: requests,
        requestTypes: requestTypes,
        pager: pager,
        init: init,
        save: save,
        saveRequest: saveRequest,
        cancel: cancel,
        viewController: viewController,
        changeAccepted: changeAccepted,
        rejectRequest: rejectRequest,
        confirmRequest: confirmRequest,
        changeAccept: changeAccept,
        changeShowStatus: changeShowStatus,
        getRequestTypeCss: getRequestTypeCss,
        getRquestTypeDisplay: getRquestTypeDisplay,
        changeRequestType: changeRequestType,
        getTitle: getTitle,
        getInventoryQty: getInventoryQty,
        itemGoodAfterUpdate: itemGoodAfterUpdate,
        goToOrderAll: goToOrderAll,
        goToOutputInventory: goToOutputInventory
    };


});

