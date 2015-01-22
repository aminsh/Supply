define(['durandal/system'],
    function (system) {
        var viewController = {
            viewTypes: ko.observableArray([
                ko.observable({ name: 'icon', title: 'نمای شمایی' }), //for template data
                ko.observable({ name: 'list', title: 'نمای لیست' }), //for table tag
                ko.observable({ name: 'detail', title: 'نمای جزئیات' }) //for datail tag
            ]),
            currentView: ko.observable()
        };

        viewController.init = function () {
            viewController.currentView({ name: 'list', title: 'نمای لیست' });
        }();

        /// views like ['icon', 'list']
        viewController.chooseViews = function (views) {
            var viewTypes = [];
            viewController.viewTypes.foreach(function (item) {
                viewTypes.push(item);
            });
            
            viewController.viewTypes.removeAll();
            
            viewTypes.foreach(function(item) {
                var canAdd = views.any(function(v) {
                    return v == item().name;
                });

                if (canAdd)
                    viewController.viewTypes.push(item);
            });

            viewController.selectView(viewController.viewTypes().first()());
        };
        viewController.selectView = function (view) {
            viewController.currentView(view);
        };

        viewController.selectViewByName = function(viewName) {
            var view = viewController.viewTypes().first(function(item) {
                return item().name === viewName;
            })();
            viewController.selectView(view);
        };
        viewController.add = function(view) {
            viewController.viewTypes.push(view);
        };

        viewController.rebuild = function(views) {
            viewController.viewTypes.removeAll();
            views.foreach(function(view) {
                viewController.viewTypes.push(new ko.observable(view));
            });
        };

        viewController.createViewObject = function(name, title) {
            return { name: name, title: title };
        };
        
        return viewController;
    });