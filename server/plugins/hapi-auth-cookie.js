  // PLUGIN: Hapi Auth Cookie

// Cookie authentication provides a simple cookie-based session management.
// https://github.com/hapijs/hapi-auth-cookie
var chalk = require("chalk");

var internals = {};





module.exports = function registerHapiAuthCookie(server){

    // 12 * 60 * 60 * 1000 = 12 hours
    internals.cache = server.app.cache = server.cache({ segment: 'sessions',  expiresIn: 12 * 60 * 60 * 1000 });

    internals.validateFunc = function (session, callback) {
debugger;
        internals.cache.get(session.sid, function (err, cached) {
debugger;
            if (err) {
                console.log(chalk.bgRed("    validateFunc @ hapi-auth-cookie: error to get data from catbox"));
                return callback(err, false);
            }

            if (!cached) {
                console.log(chalk.bgRed("    validateFunc @ hapi-auth-cookie: received cookie but it's invalid. Authentication failed."));
                return callback(null, false);
            }

            console.log(chalk.bgGreen("    validateFunc @ hapi-auth-cookie: received valid cookie. Authentication succeeded."));
            return callback(null, true, cached.account)
        })
    };


    server.register(
        {
            register: require('hapi-auth-cookie'),
            options: {}
        },
        function (err) {

            if (err){ throw err; }

            console.log("plugin registered: hapi-auth-cookie");

            server.auth.strategy('session', 'cookie', 'try', {
                password: 'jfuiewbfuiwebw',
                cookie: 'sid',
//              redirectTo: '/xyz',  // if authentication fails, redirect; if not set, will simply return a forbidden message
//                redirectOnTry: false,
                isSecure: false,
                clearInvalid: true,  // if the session is expired, will delete the cookie in the browser (but if the cookie has expired, it will remain)
                validateFunc: internals.validateFunc,
            });

        }
    );


};


