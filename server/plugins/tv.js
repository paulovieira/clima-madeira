// PLUGIN: TV - an interactive debug console plugin for hapi

// TV is a simple web page in which developers can view server logs for their requests.
// https://github.com/hapijs/tv

/*
var settings = require("../config/settings.js");

module.exports = function registerTv(server){

    server.register(
        {
            register: require('tv'),
            options: {
                host: settings.host,
                port: settings.port + 1,
                endpoint: settings.debugEndpoint
            }
        }, 
        function (err) {
            if (err){ throw err; }
        }
    );
};
*/