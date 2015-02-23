// the initial module is where we make global wide configurations (load other modules, set global variables, etc)
var Path = require('path');

// the global rootPath will be used for every require() that is not a module in node_modules
global.rootPath = Path.normalize(__dirname) + "/";

// load general purpose modules
require('pretty-error').start();
require('colors');

// set there is no environment, set the default one ("debug") (see the diferent configuration in /config/env.js)
if(process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "debug-no-auth"){
	console.log("xxx");
	process.env.NODE_ENV = "debug";
}

// load the main server module; this is where the Hapi server object is created
require(global.rootPath + "server/server.js");

