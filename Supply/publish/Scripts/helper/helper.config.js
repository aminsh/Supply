var helper = helper || {};

$(function () {

  helper.config = (function () {
    var _urlRoot = '/';
      var urlRoot = {
          get: function() {
              return _urlRoot;
          },
          set: function(value) {
              _urlRoot = value;
          }
      };
      
      return {
          urlRoot: urlRoot
      };

  })();

});