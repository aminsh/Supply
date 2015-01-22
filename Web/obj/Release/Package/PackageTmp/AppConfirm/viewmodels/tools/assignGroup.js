
define(['services/logger', 'durandal/app', 'plugins/router'],
function (logger, app, router) {

    var assignGroup = {
        masterName: '',
        master: null,
        grpPurchasingOfficer: ko.observable(),
        grpDoneDate: ko.observable(),
        grpSection: ko.observable()
    };

    assignGroup.setMasterInfo = function(master, name) {
        assignGroup.master = master;
        assignGroup.masterName = name;
    };
    
    assignGroup.doAssign = function () {
        if (assignGroup.grpPurchasingOfficer()) {
            var po = assignGroup.grpPurchasingOfficer();
            assignGroup.master.foreach(function (item) {
                item.PurchasingOfficer(po);
                item.PurchasingOfficerID(po.ID());
            });

            assignGroup.grpPurchasingOfficer(null);
        }

        if (assignGroup.grpSection()) {
            var s = assignGroup.grpSection();
            assignGroup.master.foreach(function (item) {
                item.Section(s);
                item.SectionID(s.ID());
            });

            assignGroup.grpSection(null);
        }

        if (assignGroup.grpDoneDate()) {
            var dd = assignGroup.grpDoneDate();
            var detailPropName = 'RequestDetail' + assignGroup.masterName + 's';

            assignGroup.master.foreach(function (r) {
                r[detailPropName].foreach(function (item) {
                    item.DoneDate(dd);
                });
            });
            assignGroup.grpDoneDate(null);
        }
    };
    
    return assignGroup;

});
