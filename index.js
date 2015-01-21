var Path = require('path');
global.rootPath = Path.normalize(__dirname) + "/";

var Hapi = require('hapi'),
    Hoek = require('hoek'),
    Nunjucks = require('hapi-nunjucks'),
    _ = require('underscore'),

    settings = require(global.rootPath + 'config/server.js'),
    utils = require(global.rootPath + "server/common/utils.js");

require('pretty-error').start();
require('colors');





/*
console.log( utils.flattenObj(obj, "contents") );
delete obj["contents"];
console.log(obj)
*/


// 1. Create a server with the host, port, and options defined in the main server's settings file
var server = new Hapi.Server(settings.serverOptions);
server.connection({
    host: settings.host,
    port: settings.port
});

// 2. Configure views
server.views(settings.viewsOptions);

Nunjucks.configure(global.rootPath + 'server/views', {
    watch: true
    //    autoescape: true 
});

Nunjucks.addGlobal("lang", "pt");


// 3. Register the plugins
utils.registerPlugins(server);


// 4. Add the various routes; add the pre-requisite methods to each route
//require('./server/config/addPrerequisites.js')(routeTable);

// add the routes to the server
server.route(require(global.rootPath + 'server/routes/assets-routes.js'));
server.route(require(global.rootPath + 'server/routes/base-routes.js'));


// 5. Add the API routes

// read every module in the api directory (in server/api/index.js, require-directory is used to read 
// all the files in the directory); this will create an object of modules
var apiRoutesArray = _.values(require(global.rootPath + "server/api"));

// register the API routes (defined in separate modules as hapi plugin objects)
server.register(
    apiRoutesArray, 
    {
        routes: {
            prefix: "/api"
        }
    },
    function(err) {
        if (err) {
            throw err;
        }
    }
);



/*


server.ext('onRequest', function (request, next) {

    var routePath = request.path,
        toExclude = ["partials", "images", "css", "fonts", "js"];

	var showMessage = true;

    for(var i=0, l=toExclude.length; i<l; i++){
        if(routePath.indexOf(toExclude[i]) >= 0){ showMessage = false; }
    }

    if(showMessage){
		console.log("-------------- begin request ---------------");
		console.log("			onRequest (path: " + request.path + ", method: " + request.method + " )");
    }

	next();
});
server.ext('onPreAuth', function (request, next) {
    var routePath = request.path,
        toExclude = ["partials", "images", "css", "fonts", "js"];

	var showMessage = true;

    for(var i=0, l=toExclude.length; i<l; i++){
        if(routePath.indexOf(toExclude[i]) >= 0){ showMessage = false; }
    }

    if(showMessage){
		console.log("			onPreAuth (path: " + request.path + ", method: " + request.method + " )");
    }

	next();
});

*/


// 5. Start the server
server.start(function() {
    console.log("Server started: \n" +
        "    protocol:".blue + " " + server.info.protocol + "\n" +
        "    host:".blue + " " + server.info.host + "\n" +
        "    port:".blue + " " + server.info.port + "\n" +
        "    uri:".blue + " " + server.info.uri + "\n" +
        "    address:".blue + " " + server.info.address);

});



