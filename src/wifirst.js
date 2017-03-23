let cheerio = require('cheerio');
let request = require('request');

let cookie = request.jar();

let wifirst = {};

let error_url = "https://connect.wifirst.net/login_error";
let success_url = "https://apps.wifirst.net/?redirected=true";

wifirst.loadConfig = function(config){
    if(!config || !config.login || !config.password){
        console.error("Missing credentials");
        return;
    }

    wifirst.login = config.login;
    wifirst.password = config.password;
};


wifirst.getForm = function(callback){
    request({
        url: "https://smartcampus.wifirst.net/sessions/new",
        jar: cookie
    }, callback);
};

wifirst.retrieveCSRFToken = function(callback){
    wifirst.getForm((error, response, body) => {
        let $ = cheerio.load(body);
        let utf8 = $("#signin-form").find("input[name='utf8']").attr('value');
        let token = $("#signin-form").find("input[name='authenticity_token']").attr('value');

        callback(utf8, token);
    })
};

wifirst.connect = function(callback){
    wifirst.retrieveCSRFToken((utf8, token) => {
        request.post({
            url:"https://smartcampus.wifirst.net/sessions",
            form: {
                login: wifirst.login,
                password: wifirst.password,
                authenticity_token: token,
                utf8: utf8
            },
            jar: cookie
        }, function(err, httpResponse, body){
            callback(err, httpResponse, body);
        });
    });
};

wifirst.retrieveWifirstLogin = function(callback){
    wifirst.connect((e, http, body) => {
        request({
            url : "https://connect.wifirst.net/?perform=true",
            jar: cookie
        }, (error, response, body) => {
            let err = false;

            let $ = cheerio.load(body);
            let username = $("input[name='username']").attr('value');
            let password = $("input[name='password']").attr('value');

            if(!username || !password){
                err = "Wrong login/password";
            }

            callback(username, password, err);
        });
    });
};

wifirst.validateConnection = function(callback){
    wifirst.retrieveWifirstLogin((username, password, err) => {
        if(err){
           callback(err, "");
           return;
        }

        request.post({
            url: "https://wireless.wifirst.net:8090/goform/HtmlLoginRequest",
            form: {
                username : username,
                password: password,
                qos_class: 0,
                success_url: success_url,
                error_url: error_url
            },
            jar: cookie
        }, (err, httpResponse, body) => {
            let redirectUrl = httpResponse.toJSON().headers.location;

            if(error_url === redirectUrl.split('?')[0]){
                wifirst.fixDeviceLimit((err, body) => {
                    wifirst.validateConnection(callback);
                });

                return;
            }

            callback(err, body);
        })
    })
};

wifirst.fixDeviceLimit = function(callback){
    request({
        url: "https://connect.wifirst.net/?ignore_conflicts=true&reason=Device",
        jar: cookie
    }, (err, response, body) => {
        callback(err, body);
    });
};

wifirst.checkConnectivity = function(callback){
  request("http://monip.org", (err, response, body) => {
     callback(response.toJSON().request.uri.hostname === "monip.org");
  });
};

module.exports = wifirst;