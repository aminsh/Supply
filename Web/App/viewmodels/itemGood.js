
      
define(['services/logger',
  'services/common',
  'durandal/app',
  'plugins/router',
  'services/viewController'],
function (logger, com, app, router, viewController) {

    var activate = function () {
        itemGoodpager(new helper.pager(context, itemGoods));
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

    var itemGoods = ko.observableArray([]);
    var titleSearch = ko.observable('');
    var noSearch = ko.observable('');
    
    var init = function () {
        var q = context.query('ItemGoods');
        
        if (titleSearch() != '') {
            q = q.where('Title', 'contains', titleSearch());
        }

        if (noSearch() != '') {
            q = q.where('No', 'contains', noSearch());
        }
        
        var navigarions = [
            "Scale"
        ];

        q = q.expand(navigarions);

        itemGoodpager().setQuery(q);
        itemGoodpager().changeAllData(false);
        itemGoodpager().setCallback(function (data) {
            debugger;
            var results = data.results;
            results.foreach(function(item) {
                item.canShowDetail = ko.observable(false);
            });
            itemGoods(results);
        });
        return itemGoodpager().load();
    };
    
    
    var add = function () {
        var newEntity = context.addEntity('ItemGood');
        newEntity.canShowDetail = ko.observable(true);

        itemGoods.push(newEntity);
    };

    var remove = function (item) {
        itemGoods.removeEntity(item);
    };

    var save = function () {
        if (hasChanges())
            context.saveChanges();
    };
    
    var cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            itemGoodpager().loadLocally();
        }
    };

    var context = helper.datacontext;
    var hasChanges = context.hasChanges;
    var itemGoodpager = ko.observable();

    var changeShowDetail = function(item) {
        item.canShowDetail(!item.canShowDetail());
    };
    
    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        attached: attached,
        title: 'کالا',
        hasChanges: hasChanges,
        itemGoods: itemGoods,
        titleSearch: titleSearch,
        noSearch: noSearch,
        ItemGoodpager: itemGoodpager,
        init: init,
        add: add,
        remove: remove,
        save: save,
        cancel: cancel,
        viewController: viewController,
        changeShowDetail: changeShowDetail
    };


});
   
