#!/usr/bin/env node

let wifirst = require('./wifirst');
let cli = require('./cli');
let fs = require('fs');


let loadConfig = function(file){
    let obj = JSON.parse(fs.readFileSync(file, 'utf8'));

    if(!obj.login || !obj.password || !obj){
        console.error("Missing credentials in configuration file");
        process.exit(1);
    }

    return obj;
};

let main = function () {
    let config = cli();

    if(!config){
        config = "config.json";
    }

    wifirst.loadConfig(loadConfig(config));

    wifirst.validateConnection((err, body) => {
        wifirst.checkConnectivity((status) => {
            if(status){
                console.log("Successfully authenticated !");
            } else {
                console.log("An error has occurred");
                console.log(err);
            }
        });
    });
};

main();