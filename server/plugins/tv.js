// PLUGIN: TV - an interactive debug console plugin for hapi

// TV is a simple web page in which developers can view server logs for their requests.
// https://github.com/hapijs/tv

/*
var config = require("config");

module.exports = function registerTv(server){

    server.register(
        {
            register: require('tv'),
            options: {
                host: config.get("host"),
                port: config.get("port") + 1,
                endpoint: config.get("debugEndpoint")
            }
        }, 
        function (err) {
            if (err){ throw err; }
        }
    );
};
*/