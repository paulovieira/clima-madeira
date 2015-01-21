// the initial module is where we make global wide configurations (load other modules, set global variables, etc)
var Path = require('path');

// the global rootPath will be used for every require() that is not a module in node_modules
global.rootPath = Path.normalize(__dirname) + "/";

// load general purpose modules
require('pretty-error').start();
require('colors');

// load the main server module; this is where the Hapi server object is created
require(global.rootPath + "server/server.js");

