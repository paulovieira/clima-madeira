var Boom = require('boom');
var _ = require('underscore');
var UUID = require('node-uuid');
var Bcrypt = require("bcrypt");
var config = require('../config/settings.js');
var utils = require('../config/utils.js');

var BaseC = require("../models/baseModel.js").collection;

var handlers = {

    index: function(request, reply) {
        utils.logHandlerInfo("index", request);
debugger;

        return reply.redirect("/" + config.allowedLanguages[0]);
    },

    home: function(request, reply) {
        utils.logHandlerInfo("home", request);
debugger;

        // if the request is not authenticated, request.auth.credentials will be null
        request.auth.credentials = request.auth.credentials || {};

        var context = {
            isAuthenticated: request.auth.isAuthenticated,
            credentials: request.auth.credentials
        };

        var textsC = new BaseC();
        textsC
            .execute({
                query: {
                    command: "select * from texts_read()"
                },
                parse: utils.parseTextsArray
            })
            .done(
                function() {
                    context.texts = textsC.at(0).toJSON();
                    return reply.view('home', {
                        ctx: context
                    });
                },
                function() {
                    return reply(Boom.badImplementation());
                }
	        );
    },


    login: function(request, reply) {
        utils.logHandlerInfo("login", request);
debugger;

        if (request.auth.isAuthenticated) {
            console.log("loginForm handler: valid cookie, will now redirect to /" + request.params.lang + "/dashboard");
            return reply.redirect("/" + request.params.lang + "/dashboard");
        }

        var context = {
            page: "login",
            lfr: request.query.lfr || "" // login fail reason
        }

        var textsC = new BaseC();
        textsC
            .execute({
                query: {
                    command: "select * from texts_read()"
                },
                parse: utils.parseTextsArray
            })
            .done(
                function() {
                    context.texts = textsC.at(0).toJSON();
                    return reply.view('login', {
                        ctx: context
                    });
                },
                function() {
                    return reply(Boom.badImplementation());
                }
	        );
    },


    loginAuthenticate: function(request, reply){
        utils.logHandlerInfo("loginAuthenticate", request);
debugger;

		var email = request.payload.username, 
			password = request.payload.password,
			status_code;


        if (request.auth.isAuthenticated) {
console.log("loginAuthenticate handler: is already authenticated, will now redirect to /lang/dashboard");
            return reply.redirect("/" + request.params.lang + "/dashboard");
        }

/*
	Possible values for status_code/status_message:
	1 - "ok" (the provided username and password match)
	2 - "missing username or password" (won't even connect to the DB)
	3 - "username does not exist" 
	4 - "wrong password" (username exists but password doesn't match)
*/

		if(!email || !password){
			status_code = 2;
			return reply.redirect("/" + request.params.lang + "/login?lfr=" + status_code);
		}

        var usersC = new BaseC();
        usersC
            .execute({
                query: {
                    command: "select * from users_read($1)",
                    arguments: JSON.stringify([{email: email}])
                }
            })
            .done(
                function() {
debugger;
					if(usersC.length===0){
						status_code = 3;
						return reply.redirect("/" + request.params.lang + "/login?lfr=" + status_code);
					}

					Bcrypt.compare(password, usersC.at(0).get("pwHash"), function(err, res){
debugger;
						if(err){
							return reply(Boom.badImplementation());
						}

						if(res===false){
							status_code = 4;
							return reply.redirect("/" + request.params.lang + "/login?lfr=" + status_code);
						}

						// if we get here, the username and password match
                        console.log("    authentication succeeded!".green);

	                	var credentials = {
                            id: usersC.at(0).get("id"),
	                		firstName: usersC.at(0).get("firstName"),
	                		lastName: usersC.at(0).get("lastName"),
	                		email: usersC.at(0).get("email")
	                	};

	                	// set the session in the internal cache (Catbox with memory adapter)
	    				var uuid = UUID.v4();
	    				request.server.app.cache.set(uuid, { account: credentials }, 0, function (err) {
debugger;
					        if (err) {
					            return reply(err);
					        }

					        request.auth.session.set({ sid: uuid });

                            console.log("    session was set in catbox".green);
							console.log("    will now redirect to /lang/dashboard");

					        return reply.redirect("/" + request.params.lang + "/dashboard");
						});
					});

                },
                function() {
                    return reply(Boom.badImplementation());
                }
	        );



    },


    missing: function(request, reply) {
        utils.logHandlerInfo("missing", request);
        debugger;

        var context = {
            title: 'Missing',
        }

        return reply.view('404', {
            ctx: context
        }).code(404);
    },

    catchAll: function(request, reply) {
        utils.logHandlerInfo("catchAll", request);
debugger;

        return reply.redirect("/" + request.params.lang + "/404");
    },

	/* will handle these paths: /pt/dashboard, /en/dashboard   */
    dashboard: function(request, reply){
        utils.logHandlerInfo("dashboard", request);
debugger;
console.log("REMOVE COMMENTS IN THE DASHBOARD HANDLER");
/*
        if (!request.auth.isAuthenticated) {
            console.log("    not authenticated, will now redirect to /lang/login");
            return reply.redirect("/" + request.params.lang + "/login");
        }
*/
		request.auth.credentials = request.auth.credentials || {};

        var context = {
            title: 'Dashboard Page',
            isAuthenticated: request.auth.isAuthenticated,
            credentials: request.auth.credentials
        };

        var textsC = new BaseC();
        textsC
            .execute({
                query: {
                    command: "select * from texts_read()"
                },
                parse: utils.parseTextsArray2
            })
            .done(
                function() {
//console.log(textsC.at(0).toJSON());
                    //context.texts = JSON.stringify( textsC.at(0).toJSON() );
                    context.texts = JSON.stringify( textsC.toJSON() );
                    return reply.view('dashboard', {
                        ctx: context
                    });
                },
                function() {
                    return reply(Boom.badImplementation());
                }
	        );
    },

    logout: function(request, reply){
        utils.logHandlerInfo("logout", request);
debugger;

        request.auth.session.clear();

		console.log("	session was cleared, will now redirect to /lang");
        return reply.redirect("/" + request.params.lang);
    },

};

module.exports = handlers;
