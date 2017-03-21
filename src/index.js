let cheerio = require('cheerio');
let request = require('request');

let LOGIN = "thomas.munoz30@gmail.com";
let PASSWORD = "****";

let cookie = request.jar();

let getForm = function(callback){
    request({
        url: "https://smartcampus.wifirst.net/sessions/new",
        jar: cookie
    }, callback);
};

let retrieveCSRFToken = function(callback){
  getForm((error, response, body) => {
      let $ = cheerio.load(body);
      let utf8 = $("#signin-form").find("input[name='utf8']").attr('value');
      let token = $("#signin-form").find("input[name='authenticity_token']").attr('value');

      callback(utf8, token);
  })
};

let connect = function(callback){
  retrieveCSRFToken((utf8, token) => {
      request.post({
          url:"https://smartcampus.wifirst.net/sessions",
          form: {
              login: LOGIN,
              password: PASSWORD,
              authenticity_token: token,
              utf8: utf8
          },
          jar: cookie
      }, function(err, httpResponse, body){
         callback(err, httpResponse, body);
      });
  });
};

let retrieveWifirstLogin = function(callback){
    connect((err, http, body) => {
        request({
            url : "https://connect.wifirst.net/?perform=true",
            jar: cookie
        }, (error, response, body) => {
            let $ = cheerio.load(body);
            let username = $("input[name='username']").attr('value');
            let password = $("input[name='password']").attr('value');

            callback(username, password);
        });
    });
};

let validateConnection = function(callback){
  retrieveWifirstLogin((username, password) => {
      request.post({
          url: "https://wireless.wifirst.net:8090/goform/HtmlLoginRequest",
          form: {
              username : username,
              password: password,
              qos_class: 0,
              success_url: "https://apps.wifirst.net/?redirected=true",
              error_url: "https://connect.wifirst.net/login_error"
          },
          jar: cookie
      }, (err, httpResponse, body) => {
          callback(err, body);
      })
  })
};

let main = function(){
  validateConnection((err, body) => {
      if(err){
          console.log("An error has occurred");
          console.log(err);
      }
  });
};