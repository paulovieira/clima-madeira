var Hapi = require('hapi'),
    Nunjucks = require('hapi-nunjucks'),
    _ = require('underscore'),

    settings = require(global.rootPath + 'config/server.js'),
    utils = require(global.rootPath + "server/common/utils.js");


// 1. create a server with the options defined in the main server's settings file
var server = new Hapi.Server(settings.serverOptions);

server.connection({
    host: settings.host,
    port: settings.port
});


// 2. configure views and template engine
server.views(settings.viewsOptions);

Nunjucks.configure(global.rootPath + 'server/views', {
    watch: true
    //    autoescape: true 
});

Nunjucks.addGlobal("lang", "pt");


// 3. register the plugins
utils.registerPlugins(server);


// 4. add the routes (for views and files)
server.route(require(global.rootPath + 'server/routes/assets-routes.js'));
server.route(require(global.rootPath + 'server/routes/base-routes.js'));


// 5. add the API routes

// read every module in the server/api directory (load-all.js uses require-directory, which
// will read all the modules in that directory and create an object holding them all)
var apiRoutesArray = _.values(require(global.rootPath + "server/api/load-all.js"));

// register the API routes (which were defined as hapi plugin objects)
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


// 6. Start the server
server.start(function() {
    console.log("Server started: \n" +
        "    protocol:".blue + " " + server.info.protocol + "\n" +
        "    host:".blue + " " + server.info.host + "\n" +
        "    port:".blue + " " + server.info.port + "\n" +
        "    uri:".blue + " " + server.info.uri + "\n" +
        "    address:".blue + " " + server.info.address);
});
