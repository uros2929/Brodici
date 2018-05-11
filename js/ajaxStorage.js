var ajaxStorage = (function () {
    var method = 'POST',
        user = 'branko';

    function get(key, callback) {
        load("get", key, {}, callback);
    }

    function set(key, data, callback) {
        load("set", key, data, callback);
    }

    function load(action, key, data, callback) {
        if (method !== 'GET' && method !== 'POST') {
            return "Jedini podržani metodi su POST i GET";
        }

        var request = new XMLHttpRequest();
        request.open(method, "http://frontend.tutor.rs/backend/ajax.php", true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE) {
                if (request.status == 200) {
                    result = request.responseText;
                    callback(result);
                }
                else if (request.status == 400) {
                    alert('There was an error 400');
                }
                else {
                    alert('something else other than 200 was returned');
                }
            }
        };

        request.send("data=" + encodeURI(JSON.stringify(data))
            + "&user=" + encodeURI(JSON.stringify(user))
            + "&action=" + encodeURI(JSON.stringify(action))
            + "&key=" + encodeURI(JSON.stringify(key))
        );
    }

    return {
        get: get,
        set: set
    }
})();
