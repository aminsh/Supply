var helper = helper || {};

$(function () {

    helper.modelInfos = [];

    helper.modelInfo = (function() {
        var getErrorMessage = function(entityName,propName,vldName) {
            var validator = getValidatorByName(entityName, propName, vldName);
            if (validator == null)
                return '';
            return validator.ErrorMessage;
        },
        getEntityByName = function(entityName) {
            var entity = helper.modelInfos.first(function(item) {
                return item.Name == entityName;
            });

            return entity;
        },
        getPropByName = function (entityName,propName) {
            var entity = getEntityByName(entityName);
            if (entity == null)
                return null;
            var prop = entity.Columns.first(function(item) {
                return item.Name == propName;
            });

            return prop;
        },
        getPropType = function (entityName, propName) {
            var prop = getPropByName(entityName, propName);
            return prop.Type;
        }
        getValidatorByName = function (entityName, propName, vldName) {
            var prop = getPropByName(entityName, propName);
            if (prop == null)
                return null;
            var validator = prop.Validators.first(function(item) {
                return item.Name.toLowerCase() === vldName.toLowerCase();
            });

            return validator;
        },
       getPluralNameByEntity  = function(entityName) {
           var entity = getEntityByName(entityName);

           return entity.PluralName;
       },
       getDisplayColumnByEntity = function(entityName) {
           var entity = getEntityByName(entityName);
           if (entity != null)
               return entity.DisplayColumn;
           return '';
       }

        return {
            getErrorMessage: getErrorMessage,
            getEntityByName: getEntityByName,
            getPropByName: getPropByName,
            getPropType: getPropType,
            getValidatorByName: getValidatorByName,
            getPluralNameByEntity: getPluralNameByEntity,
            getDisplayColumnByEntity: getDisplayColumnByEntity
        };
    })();
});