

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
    var requestTypes = ko.observableArray();

    var init = function () {
        var q = context.query('ConsumerSectionRequests');
        q = q.where('Status', '==', 'Created');

        var navigarions = [
            "Section",
            "Person",
            "ConsumerSectionRequestDetails",
            "ConsumerSectionRequestDetails.Passenger"
        ];

        q = q.expand(navigarions);

        pager().setQuery(q);
        pager().changeAllData(false);
        return pager().load();
    };

    var save = function () {
        if (hasChanges())
            context.saveChanges();
    };

    var cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            pager().loadLocally();
        }
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
        item.Status('ConfirmLevel2');
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
        item.ShowDetail(!item.ShowDetail());
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
    
    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var pager = ko.observable();

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        attached: attached,
        title: 'تایید کارشناس دوم',
        hasChanges: hasChanges,
        requests: requests,
        requestTypes: requestTypes,
        pager: pager,
        init: init,
        save: save,
        cancel: cancel,
        viewController: viewController,
        changeAccepted: changeAccepted,
        rejectRequest: rejectRequest,
        confirmRequest: confirmRequest,
        changeAccept: changeAccept,
        changeShowStatus: changeShowStatus,
        getRequestTypeCss: getRequestTypeCss,
        getRquestTypeDisplay: getRquestTypeDisplay,
        changeRequestType: changeRequestType
    };


});

