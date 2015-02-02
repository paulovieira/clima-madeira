var Boom = require('boom');
var Joi = require('joi');
var _ = require('underscore');
var _s = require('underscore.string');
var changeCaseKeys = require('change-case-keys');
var UUID = require('node-uuid');
var Q = require('q');
var Bcrypt = require("bcrypt");

var emailSettings = require(global.rootPath + "config/email.js");
var settings = require(global.rootPath + "config/server.js");

var UsersC = require(global.rootPath + "server/models/base-model.js").collection;
var utils = require(global.rootPath + 'server/common/utils.js');
var transforms = require(global.rootPath + 'server/common/transforms.js');
var pre = require(global.rootPath + 'server/common/pre.js');

var mandrill = require("node-mandrill")(emailSettings.mandrill.apiKey);




var internals = {};
/*** RESOURCE CONFIGURATION ***/

internals.resourceName = "users";
internals.resourcePath = "/users";


internals.isDbError = function(err) {
    return !!err.sqlState;
};

internals.parseDbErrMsg = function(msg) {
    // NOTE: msg.split(msg, "\n") isn't working here
    var arrayMsg = _s.lines(msg);

    arrayMsg = arrayMsg.filter(function(line) {
        return _s.startsWith(line.toLowerCase(), "error:") || _s.startsWith(line.toLowerCase(), "detail:");
    });

    return arrayMsg.join(". ");
};

internals.parseError = function(err) {
    if (internals.isDbError(err)) {
        var errMsg = internals.parseDbErrMsg(err.message);
        return Boom.conflict(errMsg);
    }

    return Boom.badImplementation(err.message);
};


// validate the ids param in the URL
internals.validateIds = function(value, options, next) {
    debugger;

    value.ids = _s.trim(value.ids, ",").split(",");


    var idSchema = Joi.number().integer().min(0);

    // must be an objet like this: { ids: [3,5,7] }
    var schema = Joi.object().keys({
        ids: Joi.array().unique().includes(idSchema)
    });

    var validation = Joi.validate(value, schema, settings.joiOptions);

    if (validation.error) {
        return next(validation.error);
    }

    return next(undefined, validation.value);
};


internals.validatePayloadForCreate = function(value, options, next) {

    var schemaCreate = Joi.object().keys({
        id: Joi.number().integer().min(0),

        tags: Joi.array().unique().includes(Joi.string()).required(),

        contents: Joi.object().keys({
            pt: Joi.string().required(),
            en: Joi.string().required()
        }).required(),

        contentsDesc: Joi.object().keys({
            pt: Joi.string().required(),
            en: Joi.string().required()
        }),

        active: Joi.boolean()
    });

    return internals.validatePayload(value, options, next, schemaCreate);
};


internals.validatePayloadForUpdate = function(value, options, next) {

    var schemaUpdate = Joi.object().keys({
        id: Joi.number().integer().min(0).required(),

        tags: Joi.array().unique().includes(Joi.string()),

        contents: Joi.object().keys({
            pt: Joi.string().allow("").required(),
            en: Joi.string().allow("").required()
        }),

        contentsDesc: Joi.object().keys({
            pt: Joi.string().required(),
            en: Joi.string().required()
        }),

        active: Joi.boolean()
    });

    return internals.validatePayload(value, options, next, schemaUpdate);
};




internals.validatePayload = function(value, options, next, schema) {
    debugger;

    if (_.isObject(value) && !_.isArray(value)) {
        value = [value];
    }

    // validate the elements of the array using the given schema
    var validation = Joi.validate(value, Joi.array().includes(schema), settings.joiOptions);

    if (validation.error) {
        return next(validation.error);
    }


    // validateIds was executed before this one; the ids param (if defined) is now an array of integers
    var ids = options.context.params.ids;

    // finally, if the ids param is defined, make sure that the ids in the param and the ids in the payload are consistent
    if (ids) {
        for (var i = 0, l = validation.value.length; i < l; i++) {
            // ids in the URL param and ids in the payload must be in the same order
            if (ids[i] !== validation.value[i].id) {
                return next(Boom.conflict("The ids given in the payload and in the URI must match (including the order)."));
            }
        }
    }

    // update the value that will be available in request.payload when the handler executes;
    // there are 2 differences: a) Joi has coerced the values to the type defined in the schemas;
    // b) the keys will be in underscored case (ready to be used by the postgres functions)
    return next(undefined, changeCaseKeys(validation.value, "underscored"));
};

/*** END OF RESOURCE CONFIGURATION ***/



// plugin defintion function
exports.register = function(server, options, next) {




        // READ (all)
        server.route({
            method: 'GET',
            path: internals.resourcePath,
            handler: function (request, reply) {
                utils.logHandlerInfo("/api" + internals.resourcePath, request);
    debugger;
                var usersC = new UsersC();

                usersC.execute({
                    query: {
                        command: "select * from users_read()"
                    }
                })
                .done(
                    function(){

                        var resp         = usersC.toJSON();
                        var transformMap = transforms.maps.user;
                        var transform    = transforms.baseTransform;

                        return reply(transform(resp, transformMap));
                    },
                    function(err){
    debugger;
                        var boomErr = internals.parseError(err);
                        return reply(boomErr);
                    }
                );


            },

            config: {
                description: 'Get all the resources',
                notes: 'Returns all the resources (full collection)',
                tags: ['api'],
                auth: {
                    mode: "required"
                },
                auth: false
            }
        });

    /*
        // READ (one or more, but not all)
        server.route({
            method: 'GET',
            path: internals.resourcePath + "/{ids}",
            handler: function (request, reply) {
                utils.logHandlerInfo("/api" + internals.resourcePath + "/{ids}", request);
    debugger;
                var usersC = new UsersC();
                request.params.ids.forEach(function(id){
                    usersC.add({id: id});
                });

                var queryOptions = JSON.stringify(usersC.toJSON());

                usersC.execute({
                    query: {
                        command: "select * from users_read($1)",
                        arguments: [queryOptions]
                    }
                })
                .done(
                    function(){
    debugger;
                        var resp      = usersC.toJSON();
                        var transform = transforms.text;

                        return reply(utils.transform(resp, transform));
                    },
                    function(err){
    debugger;
                        var boomErr = internals.parseError(err);
                        return reply(boomErr);
                    }
                );

            },
            config: {
                validate: {
                    params: internals.validateIds,
                },

                description: 'Get 2 (short description)',
                notes: 'Get 2 (long description)',
                tags: ['api'],
                auth: {
                    mode: "required"
                },
                auth: false
            }
        });

        // CREATE (one or more)
        server.route({
            method: 'POST',
            path: internals.resourcePath,
            handler: function (request, reply) {
                utils.logHandlerInfo("/api" + internals.resourcePath, request);
    debugger;
    // decomment here!
    //             request.auth.credentials = request.auth.credentials || {};

    //             if(!request.auth.credentials.id){
    //                 return reply(Boom.unauthorized("To create a new resource you must sign in."));
    //             }

                var usersC = new UsersC(request.payload);

                usersC.forEach(function(model){
                    model.set("author_id", 8 || request.auth.credentials.id);
                });

                var dbData = JSON.stringify(usersC.toJSON());

                usersC.execute({
                    query: {
                        command: "select * from users_create($1);",
                        arguments: [dbData]
                    }
                })
                .done(
                    function(){
    debugger;
                        var resp      = usersC.toJSON();
                        var transform = transforms.text;

                        return reply(utils.transform(resp, transform));
                    },
                    function(err){
    debugger;

                        var boomErr = internals.parseError(err);
                        return reply(boomErr);
                    }
                );

            },
            config: {
                validate: {
                    //payload: internals.validatePayload,
                    payload: internals.validatePayloadForCreate
                },

                auth: {
                    mode: "required"
                },
                auth: false,

                description: 'Post (short description)',
                notes: 'Post (long description)',
                tags: ['api'],
            }
        });

        // UPDATE (one or more)
        server.route({
            method: 'PUT',
            path: internals.resourcePath + "/{ids}",
            handler: function (request, reply) {

                utils.logHandlerInfo("/api" + internals.resourcePath, request);
    debugger;
    // decomment here!
    //             request.auth.credentials = request.auth.credentials || {};

    //             if(!request.auth.credentials.id){
    //                 return reply(Boom.unauthorized("To create a new resource you must sign in."));
    //             }


                // we must decode html entities here because the payload might come from 
                // kendoUI editor (which uses html entities); we also do the trimming;
                //var usersC = new UsersC(internals.decodeHtmlEntities(request.payload));

                var usersC = new UsersC(request.payload);

                usersC.forEach(function(model){
                    model.set("author_id", 8 || request.auth.credentials.id);
                });

                var dbData = JSON.stringify(usersC.toJSON());

                usersC.execute({
                    query: {
                        command: "select * from users_update($1);",
                        arguments: [dbData]
                    }
                })
                .done(
                    function(){
    debugger;
                        var resp      = usersC.toJSON();
                        var transform = transforms.text;

                        return reply(utils.transform(resp, transform));
                    },
                    function(err){
    debugger;

                        var boomErr = internals.parseError(err);
                        return reply(boomErr);
                    }   
                );
            },
            config: {
                validate: {
                    params: internals.validateIds,
                    //payload: internals.validatePayload
                    payload: internals.validatePayloadForUpdate

                },

                auth: {
                    mode: "required"
                },
                auth: false,

                description: 'Put (short description)',
                notes: 'Put (long description)',
                tags: ['api'],
            }
        });

        // DELETE (one or more)
        server.route({
            method: 'DELETE',
            path: internals.resourcePath + "/{ids}",
            handler: function (request, reply) {
    debugger;
                var usersC = new UsersC();
                request.params.ids.forEach(function(id){
                    usersC.add({id: id});
                })

                var dbData = JSON.stringify(usersC.toJSON());

                usersC.execute({
                    query: {
                        command: "select * from users_delete($1)",
                        arguments: [dbData]
                    }
                })
                .done(
                    function(){
    debugger;
                        return reply(usersC.toJSON());
                    },
                    function(err){
    debugger;
                        var boomErr = internals.parseError(err);
                        return reply(boomErr);
                    }
                );
            },

            config: {
                validate: {
                    params: internals.validateIds,
                },

                description: 'Delete (short description)',
                notes: 'Delete (long description)',
                tags: ['api'],
                auth: {
                    mode: "required"
                },
                auth: false
            }
        });
    */


    // CREATE A PASSWORD TOKEN

    server.route({
        method: 'GET',
        path: internals.resourcePath + "/recover/{email}",
        handler: function(request, reply) {

            utils.logHandlerInfo("/api" + internals.resourcePath + "/recover/{email}", request);
            debugger;

            var usersC = request.pre.usersC;
            if (usersC.length === 0) {
                return reply(Boom.notFound("User not found"));
            }

            // update the recover token in the database; the recoverValidUntil field
            // will be automatically updated with the value now() + 1 day
            var queryArgs = {
                id: usersC.at(0).get("id"),
                recover: UUID.v4()
            }

            usersC.execute({
                    query: {
                        command: "select * from users_update($1);",
                        arguments: JSON.stringify([queryArgs])
                    }
                })
                .then(
                    function() {
                        debugger;

                        var name = usersC.at(0).get("firstName") + " " + usersC.at(0).get("lastName");
                        var email = usersC.at(0).get("email");

                        var publicPort = (settings.publicPort === 80) ? "" : (":" + settings.publicPort);
                        var recoverUri = settings.publicUri + publicPort + "/en/recover?token=" + usersC.at(0).get("recover");


                        var deferred = Q.defer();


                        mandrill(
                            '/messages/send', {
                                message: {
                                    to: [{
                                        email: email,
                                        name: name
                                    }],
                                    from_email: emailSettings.from_email,
                                    from_name: emailSettings.from_name,
                                    subject: emailSettings.subject,
                                    text: emailSettings.body + recoverUri
                                }
                            },
                            function(error, response) {
                                debugger;
                                if (error) {
                                    deferred.reject(error);
                                } else {
                                    deferred.resolve(response);
                                }
                            }
                        );

                        return deferred.promise;
                    }
                )
                .done(
                    function(mandrillResponse) {
                        debugger;
                        var reject_reason = mandrillResponse[0].reject_reason,
                            status = mandrillResponse[0].status.toLowerCase();

                        // even if we don't have an error, we must check if the sending of the email was
                        // rejected
                        if (reject_reason !== null || status === "rejected" || status === "invalid") {
                            var errMessage = "Status: " + status + " . Reject reason: " + reject_reason;
                            return reply(Boom.badImplementation(errMessage))
                        }

                        // if we got here, the status should be "sent"
                        return reply({
                            status: status,
                            email: mandrillResponse[0].email
                        });

                    },
                    function(err) {
                        debugger;
                        return reply(Boom.badImplementation(err.message, err))
                    }
                );
        },
        config: {
            validate: {
                params: {
                    email: Joi.string().email()
                }
            },
            pre: [
                pre.db.read_user_by_email
            ],
            auth: false,

            description: 'Update the password recover token',
            notes: 'Recover the password token',
            tags: ['api'],
        }
    });


    // update the password (recover token must exist and be valid)
    server.route({
        method: 'PUT',
        path: internals.resourcePath + "/recover/{token}",
        handler: function(request, reply) {

            utils.logHandlerInfo("/api" + internals.resourcePath + "/recover/{token}", request);
            debugger;

            var usersC = request.pre.usersC;
            if (usersC.length === 0) {
                return reply(Boom.notFound("User not found"));
            }

            // update the password in the database
            // NOTE: we must use pw_hash, otherwise the propertu will be ignored
            var queryArgs = {
                id: usersC.at(0).get("id"),
                pw_hash: Bcrypt.hashSync(request.payload.pw, 10)
            };

            usersC.execute({
                    query: {
                        command: "select * from users_update($1);",
                        arguments: JSON.stringify([queryArgs])
                    }
                })
                .then(
                    function(resp){
                        debugger;

                        // clear the recover token
                        var queryArgs2 = {
                            id: usersC.at(0).get("id"),
                            recover: ""
                        }

                        return usersC.execute({
                            query: {
                                command: "select * from users_update($1);",
                                arguments: JSON.stringify([queryArgs2])
                            }
                        });
                    }
                )
                .done(
                    function(response) {
                        debugger;
                        return reply("ok")
                    },
                    function(err) {
                        debugger;
                        return reply(Boom.badImplementation(err.message, err))
                    }
                );
        },
        config: {
            validate: {
                payload: {
                    pw: Joi.string().min(3)
                }
            },
            pre: [
                pre.db.read_user_by_token
            ],
            auth: false,

            description: 'Update the password recover token',
            notes: 'Recover the password token',
            tags: ['api'],
        }
    });

    // any other request will receive a 405 Error
    server.route({
        method: '*',
        path: internals.resourcePath + "/{p*}",
        handler: function(request, reply) {
            var output = Boom.methodNotAllowed('The method is not allowed for the given URI.'); // 405
            reply(output);
        }
    });


    next();
};

exports.register.attributes = {
    name: internals.resourceName,
    version: '1.0.0'
};
