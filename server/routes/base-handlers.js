var Boom = require('boom');
var Hoek = require('hoek');
var _ = require('underscore');
var UUID = require('node-uuid');
var Bcrypt = require("bcrypt");
var Q = require("q");
var Moment = require("moment");

var config = require("config");
var utils = require(global.rootPath + 'server/common/utils');
var transforms = require(global.rootPath + 'server/common/transforms.js');
var BaseC = require(global.rootPath + "server/models/base-model.js").collection;

//var jsonFormat = require("json-format");

var handlers = {

    testpre: function(request, reply) {
        utils.logHandlerInfo("testpre", request);
        debugger;

        var users = request.pre.usersC.toJSON();
        utils.deleteProps(users, "userTexts", "userGroups", "pwHash");


        return reply(users);
    },

    index: function(request, reply) {
        utils.logHandlerInfo("index", request);
        debugger;

        return reply.redirect("/" + config.get("allowedLanguages")[0]);
    },


    generalPage: function(request, reply) {
        utils.logHandlerInfo("generalPage", request);
        debugger;

        var viewFile = utils.getView(request.params.page1, request.params.page2);

        // if the page params are not recognized, the empty string will be returned
        if(!viewFile){
            return reply.redirect("/" + request.params.lang + "/404");
        }

        // create a nested object with the images for the carousel (for each sector)
        request.pre.files.carousel = {};
        request.pre.files.carousel["agricultura-florestas"] = [request.pre.files[18], request.pre.files[19], request.pre.files[20] ];

//console.log(request.pre.files);

        var context = {
            texts: request.pre.texts,
            textsArray: request.pre.textsArray,
            files: request.pre.files,
            images: request.pre.images,
            
            auth: request.auth,
        };

        return reply.view(viewFile, {
            ctx: context
        });
    },

    login: function(request, reply) {
        utils.logHandlerInfo("login", request);
        debugger;

        if (request.auth.isAuthenticated) {
            console.log("loginForm handler: valid cookie, will now redirect to /" + request.params.lang + "/dashboard");
            return reply.redirect("/" + request.params.lang + "/dashboard");
        }

        var context = {
            texts: request.pre.texts,
            auth: request.auth,
            lfr: request.query.lfr || "" // login fail reason
        }

        return reply.view('login', {
            ctx: context
        });
    },


    loginAuthenticate: function(request, reply) {
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

        if (!email || !password) {
            status_code = 2;  // "missing username or password"
            return reply.redirect("/" + request.params.lang + "/login?lfr=" + status_code);
        }

        var usersC = new BaseC();
        usersC
            .execute({
                query: {
                    command: "select * from users_read($1)",
                    arguments: JSON.stringify([{
                        email: email
                    }])
                }
            })
            .done(
                function() {
                    debugger;
                    if (usersC.length === 0) {
                        status_code = 3;  // "username does not exist" 
                        return reply.redirect("/" + request.params.lang + "/login?lfr=" + status_code);
                    }

                    var res = Bcrypt.compareSync(password, usersC.at(0).get("pwHash"));

                    if (res === false) {
                        status_code = 4;  // "wrong password"
                        return reply.redirect("/" + request.params.lang + "/login?lfr=" + status_code);
                    }

                    // if we get here, the username and password match
                    console.log("    authentication succeeded!".green);
debugger;
                    var credentials = {
                        id:           usersC.at(0).get("id"),
                        firstName:    usersC.at(0).get("firstName"),
                        lastName:     usersC.at(0).get("lastName"),
                        email:        usersC.at(0).get("email"),

                        // set to true if the user belongs to the group "admin"
                        isAdmin:      !!_.findWhere(usersC.at(0).get("userGroups"), {code: 99}),  

                        // set to true if the user belongs to the group "can_edit_texts"
                        canEditTexts: !!_.findWhere(usersC.at(0).get("userGroups"), {code: 98})
                    };

                    // set the session in the internal cache (Catbox with memory adapter)
                    var uuid = UUID.v4();
                    request.server.app.cache.set(
                        uuid, 
                        {
                            account: credentials
                        }, 
                        0, 
                        function(err) {
                            debugger;
                            if (err) {
                                return reply(err);
                            }

                            request.auth.session.set({
                                sid: uuid
                            });

                            console.log("    session was set in catbox".green);
                            console.log("    will now redirect to /lang/dashboard");

                            return reply.redirect("/" + request.params.lang + "/dashboard");
                        }
                    );

                },
                function() {
                    return reply(Boom.badImplementation());
                }
            );

    },


    /* will handle these paths: /pt/dashboard, /en/dashboard   */
    dashboard: function(request, reply) {
        utils.logHandlerInfo("dashboard", request);

        debugger;

        // when NODE_ENV is "debug-no-auth", the route's auth configuration is set to false
        if(config.get('hapi.auth')!==false){
            if(!request.auth.isAuthenticated){
                console.log("    not authenticated, will now redirect to /lang/login");
                return reply.redirect("/" + request.params.lang + "/login");
            }
        }
        else{
            request.auth.credentials.id = 1;
            request.auth.credentials.firstName = "paulo";
            request.auth.credentials.lastName = "vieira";
        }


        var context = {
            texts:      request.pre.texts,
            textsArray: request.pre.textsArray,
            files:      request.pre.files,
            filesArray: request.pre.filesArray,
            auth:       request.auth,
        };

        return reply.view('dashboard', {
            ctx: context
        });

    },

    recover: function(request, reply){
debugger;

        var usersC = request.pre.usersC;
       
        var tokenValidity, reason;

        var context = {
            texts: request.pre.texts,
        };

        if(usersC.length === 0){
            context.reason = "invalid";
        }
        else{
            context.token = usersC.at(0).get("recover");
            tokenValidity = usersC.at(0).get("recoverValidUntil");

            if(Moment().isAfter(tokenValidity)){
                context.reason = "expired";
            }
        }


        return reply.view("recover_password.html", {
            ctx: context
        });


        // if the token is valid and has not expired, show the form to create a new password
//        return reply("change password");
    },

    missing: function(request, reply) {
        utils.logHandlerInfo("missing", request);
        debugger;

        var context = {
            texts: request.pre.texts
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


    logout: function(request, reply) {
        utils.logHandlerInfo("logout", request);
        debugger;

        request.auth.session.clear();

        console.log("   session was cleared, will now redirect to /lang");
        return reply.redirect("/" + request.params.lang);
    },

};

module.exports = handlers;
