
      
define(['services/logger',
  'services/common',
  'durandal/app',
  'plugins/router',
  'services/viewController'],
function (logger, com, app, router, viewController) {

    var activate = function () {
        pager(new helper.pager(context, requests));
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
    
    var init = function () {
        var q = context.query('RequestGoods');
        q = q.where('Status', '==', 'Created');
        
        var navigarions = [
            "Section",
            "Person",
            "RequestDetailGoods"
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
   
