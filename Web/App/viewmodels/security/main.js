
define(['services/logger',
  'services/common',
  'durandal/app',
  'plugins/router',
  'services/viewController',
  'modal/subjectMngr',
  'modal/subjectSelect2'],
function (logger, com, app, router, viewController, subjectMngr, subjectSelect) {

    var activate = function () {
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

    var users = ko.observableArray([]);
    var roles = ko.observableArray([]);
    var subjects = ko.observableArray([]);

    var currentRole = ko.observable();
    
    var init = function () {
        var q = context.query('Users');

        context.executeQuery(q).then(function(data) {
            var results = data.results;

            results.foreach(function(item) {
                item.isExpanded = ko.observable(false);
            });

            users(results);
        });
        users.executeQuery(context, q);

        var qSubject = context.query('Subjects');
        context.executeQuery(qSubject)
            .then(function(data) {
                var results = data.results;
                results.foreach(function(item) {
                    item.isSelected = ko.observable(false);
                });
                subjects(results);
            });
        var qRole = context.query('Roles');
        var navigarions = [
            "UserInRoles",
            "UserInRoles.User",
            "RolePermits",
            "RolePermits.Subject",
        ];

        qRole = qRole.expand(navigarions);

        context.executeQuery(qRole).then(function(data) {
            var results = data.results;
            results.foreach(function(item) {
                item.canShowDetail = ko.observable(false);
                item.isEditing = ko.observable(false);
            });

            roles(results);
        });
    };

    var canUsersExpand = ko.observable(false);
    var canShowSubjectLookup = ko.observable(false);
    var canShowSubjectManagement = ko.observable(false);
    
    var changeUsersExpand = function() {
        canUsersExpand(!canUsersExpand());
    };

    var changeShowSubjectManagement = function() {
        canShowSubjectManagement(!canShowSubjectManagement());
    };

    var showSubjectManagement = function () {
        subjectMngr.show();
    };
    
    var user = {};

    user.expand = function(item) {
        item.isExpanded(!item.isExpanded());
    };
    
    var addRole = function () {
        var newEntity = context.addEntity('Role', {Name: 'Role1',RoleType: 'Normal'});
        newEntity.canShowDetail = ko.observable(false);
        newEntity.isEditing = ko.observable(true);
        roles.push(newEntity);
    };
    
    var editRole = function(item) {
        item.isEditing(true);
    };

    var cancelEditingRole = function (item) {
        if (item.entityAspect.entityState == "Added")
            roles.remove(item);
        item.entityAspect.rejectChanges();
        item.isEditing(false);
    };

    var saveRole = function(item) {
        context.manager.saveChanges([item]).then(function() {
            helper.note.successDefault();
            item.isEditing(false);
        }).fail(function(error) {
            helper.note.error(error);
        });
    };

    var changeShowDetailRole = function(item) {
        item.canShowDetail(!item.canShowDetail());
    };
    
    var addUserInRole = function(user, role) {
        var isUserExists = role.UserInRoles().any(function(item) {
            return item.UserID() == user.ID();
        });

        if (isUserExists)
            return;
        var newEntity = context.addEntity('UserInRole',
            {
                UserID: user.ID(),
                User: user,
                RoleID: role.ID(),
                Role: role
            });
        role.canShowDetail(true);
    };

    var removeUserInRole = function(item) {
        item.UserID(null);
        item.User(null);
        item.RoleID(null);
        item.Role(null);
        item.entityAspect.setDeleted();
    };
    var removeRole = function (item) {
        var title = 'آیا مایل به ادامه عملیات هستید ؟';
        var msg = 'حذف گروه کاربری جاری';
        app.showMessage(title, msg, ['Yes', 'No'])
            .then(function (answer) {
                if (answer == 'Yes') {
                    if (item.entityAspect.entityState == "Added") {
                        item.entityAspect.rejectChanges();
                    } else {
                        item.entityAspect.setDeleted();
                        context.manager.saveChanges([item]).then(function() {
                            roles.remove(item);
                        });
                    }
                }
            });
    };

    var addSubject = function() {
        subjects.addEntity(context, 'Subject', {});
    };

    var saveSubject = function() {
        context.manager.saveChanges(subjects());
    };

    var cancelSubject = function() {
        subjects.foreach(function(item) {
            item.entityAspect.rejectChanges();
        });
    };

    var removeRolePermit = function (item) {
        item.Role(null);
        item.RoleID(null);
        item.entityAspect.setDeleted();
    };
    var save = function () {
        if (hasChanges())
            context.saveChanges();
    };
    
    var cancel = function () {
        if (hasChanges()) {
            context.cancelChanges();
            //Entitypager().loadLocally();
        }
    };

    var context = helper.datacontext;
    var hasChanges = context.hasChanges;

    var selectSubject = function() {
        var selectedSubjects = subjects.filter(function(item) {
            return item.isSelected();
        });
        selectedSubjects.foreach(function(item) {
            context.addEntity('RolePermit', {
                Role: currentRole(),
                RoleID: currentRole().ID(),
                Subject: item,
                SubjectID: item.ID()
            });
        });
        canShowSubjectLookup(false);
        subjects.foreach(function(item) {
            item.isSelected(false);
        });
        
    };

    var assignSubjectToRole = function(role) {
        subjectSelect.show(role);
    };
    
    return {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        attached: attached,
        title: 'مدیریت امنیت',
        hasChanges: hasChanges,
        users: users,
        roles: roles,
        subjects: subjects,
        canUsersExpand: canUsersExpand,
        canShowSubjectLookup: canShowSubjectLookup,
        canShowSubjectManagement: canShowSubjectManagement,
        init: init,
        user: user,
        addRole: addRole,
        editRole: editRole,
        cancelEditingRole: cancelEditingRole,
        addUserInRole: addUserInRole,
        removeUserInRole: removeUserInRole,
        removeRole: removeRole,
        saveRole: saveRole,
        addSubject: addSubject,
        saveSubject: saveSubject,
        cancelSubject: cancelSubject,
        removeRolePermit: removeRolePermit,
        save: save,
        cancel: cancel,
        viewController: viewController,
        changeUsersExpand: changeUsersExpand,
        changeShowDetailRole: changeShowDetailRole,
        changeShowSubjectManagement: changeShowSubjectManagement,
        showSubjectManagement: showSubjectManagement,
        assignSubjectToRole: assignSubjectToRole,
        selectSubject: selectSubject
    };


});
   
