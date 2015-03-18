define({
    load: function (name, req, onload, config) {
       dataContext.onReady(function(){
          onload();
      });

    }
})
