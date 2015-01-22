define(function() {
    var submit = function(action,data) {
        var options = {
            dataType: "json",
            contentType: "application/json",
            cache: false,
            type: "POST"
        };

        if (!isNullOrEmpty(data))
            options.data = data;
        
        var url = 'api/' + action;

        return $.ajax(url, options);
    };

    var query = function (action, data) {
        var options = {
            dataType: "json",
            contentType: "application/json",
            cache: false,
            type: "GET"
        };

        if (!isNullOrEmpty(data))
            options.data = data;

        var url = '/api/' + action;

        return $.ajax(url, options);
    };

    return {        
        submit: submit,
        query: query
    };
});