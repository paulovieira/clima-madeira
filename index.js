// the initial module is where we make global wide configurations (load other modules, set global variables, etc)
var Path = require('path');

// the global rootPath will be used for every require() that is not a module in node_modules
global.rootPath = Path.normalize(__dirname) + "/";

// load general purpose modules
require('pretty-error').start();
require('colors');

// if there is no environment, set the default one ("production") (see the diferent configuration in /config)
// this must be done before the config module is required
if(process.env.NODE_ENV !== "dev" && process.env.NODE_ENV !== "dev-no-auth"){
	process.env.NODE_ENV = "production";
}

// load the main server module; this is where the Hapi server object is created
require(global.rootPath + "server/server.js");


// detect and find memory leaks - https://github.com/lloyd/node-memwatch
// TODO: log to a leak file
var memwatch = require('memwatch');

memwatch.on('leak', function(info) { 
	console.log("possible memory leak:\n", info);
});