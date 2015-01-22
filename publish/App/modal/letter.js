define(['plugins/dialog', 'knockout'], function (dialog, ko) {
    var letter = function (master) {
        this.context = helper.datacontext;
        this.master = ko.observable(master);
        
        var prop = master.entityType.navigationProperties.first(function (p) {
            return p.name.startsWith('LetterRequest');
        });

        this.list = master[prop.name];
        
    };

    letter.prototype.attached = function() {

    };
    
    letter.prototype.add = function () {
        var initValue = {
            Date: new Date(),
            PerformerSectionID: null,
            PerformerSection: null
        };

        var masterName = this.master().entityType.shortName;

        initValue[masterName + 'ID'] = this.master().ID();
        initValue[masterName] = this.master();
        var entityName = 'Letter' + masterName;
        var newEntity = this.context.addEntity(entityName, initValue);
        return newEntity;
    };

    letter.prototype.remove = function(parent,item) {
        var masterName = parent.master().entityType.shortName;
        item[masterName](null);
        item[masterName + 'ID'](null);
        item.entityAspect.setDeleted();
    };
    
    letter.prototype.canDeactivate = function () {
        return true;
    };

    letter.show = function (master) {
        return dialog.show(new letter(master));
    };

    letter.prototype.close = function() {
        dialog.close(this);
    };
    
    return letter;
});