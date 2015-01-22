
      
define(['services/logger',
  'services/common',
  'durandal/app',
  'plugins/router',
  'services/viewController'],
function (logger, com, app, router, viewController) {

    var activate = function (key) {
        pager(new helper.pager(context, requests));
        return init(key);
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

    var requests = [
        { type: 'Good', list: ko.observableArray(), loadStatus: ko.observable('notLoad') },
        { type: 'Service', list: ko.observableArray(), loadStatus: ko.observable('notLoad') },
        { type: 'Food', list: ko.observableArray(), loadStatus: ko.observable('notLoad') },
        { type: 'Ticket', list: ko.observableArray(), loadStatus: ko.observable('notLoad') }
    ];
        
    var totalRequests= ko.observableArray();
    var currentRequestType = ko.observable();
    
    var init = function (type) {
        var q = context.query('TotalRequestsForSupplyManager');

        return context.executeQuery(q)
            .then(function (data) {
                var results = data.results;
                totalRequests(ko.getObservableArray(results));
                if (!isNullOrEmpty(type)) {
                    currentRequestType(
                        results.first(function(r) {
                            return r.Name == type;
                        }
                        ));
                    loadRequest();
                }
            });
    };

    var loadRequest = function () {
        var type = currentRequestType().Name();
        var q = context.query('Request' + type + 's');
        q = q.where('Status', '==', 'ConfirmSection');

        var navigarions = [
            "Section",
            "Person",
            "RequestDetail" + type + "s"
        ];


        q = q.expand(navigarions);
        
        var requestType = requests.first(function(r) {
            return r.type == type;
        });

        requestType.loadStatus('loading');
        
        var list = requestType.list;
        
        context.executeQuery(q)
            .then(function (data) {
                var results = data.results;
                list(results);
                requestType.loadStatus('loaded');
            });
    };

    var changeRequestType = function(item) {
        currentRequestType(item);

        var req = requests.first(function(r) {
            return r.type == item.Name();
        });

        if (req.loadStatus() == 'notLoad')
            loadRequest();
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

    var saveRequest = function (item, callbackAfterUpdate) {
        var items = [];
        if (!item.entityAspect.entityState.isUnchanged())
            items.push(item);
        item.RequestDetailGoods.foreach(function (rdg) {
            if (!rdg.entityAspect.entityState.isUnchanged())
                items.push(rdg);
        });

        context.manager.saveChanges(items)
            .then(function () {
                //helper.note.successDefault();
                callbackAfterUpdate();
            })
            .fail(function (error) {
                helper.note.error(error.errorMessage);
            });
    };
    
    var rejectRequest = function(item) {
        item.Status('Cancel');
        context.manager.saveChanges([item])
            .then(function() {
                requests.remove(item);
                helper.note.successDefault();
            });
    };

    var changeAccepted = function(item) {
        item.IsCancel(!item.IsCancel());
    };
    

    var confirmRequest = function (item) {
        item.Status('RequestGood');

        saveRequest(item,function() {
            requests.remove(item);
            helper.note.successDefault();
        });
    };

    var changeAccept = function(item) {
        item.IsCancel(!item.IsCancel());
    };

    var changeShowStatus = function(item) {
        item.ShowDetail(!item.ShowDetail());
    };
    
    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var pager = ko.observable();

    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        attached: attached,
        title: 'تایید معاونت تدارکات',
        hasChanges: hasChanges,
        requests: requests,
        pager: pager,
        init: init,
        save: save,
        cancel: cancel,
        viewController: viewController,
        changeAccepted: changeAccepted,
        rejectRequest: rejectRequest,
        confirmRequest: confirmRequest,
        changeAccept: changeAccept,
        changeShowStatus: changeShowStatus 
    };


});
   
