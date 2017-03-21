let cheerio = require('cheerio');
let request = require('request');

let LOGIN = "thomas.munoz30@gmail.com";
let PASSWORD = "****";

var cookie = request.jar();

let getForm = function(callback){
    request({
        url: 'https://smartcampus.wifirst.net/sessions/new',
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
          url:'https://smartcampus.wifirst.net/sessions',
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

let validateConnection = function(callback){
    request({
        url : "https://connect.wifirst.net/?perform=true",
        jar: cookie
    }, callback);
};

connect((err, http, body) => {
    validateConnection((error, response, body) => {
        let $ = cheerio.load(body);
        let username = $("input[name='username']").attr('value');
        let password = $("input[name='password']").attr('value');
        console.log("Username : " + username);
        console.log("Password : " + password);
    });
});

