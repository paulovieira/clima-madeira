var Boom = require('boom');
var Joi = require('joi');
var _ = require('underscore');
var _s = require('underscore.string');
var changeCaseKeys = require('change-case-keys');
var UUID = require('node-uuid');
var Q = require('q');
var Bcrypt = require("bcrypt");
var config = require('config');

var UsersC = require(global.rootPath + "server/models/base-model.js").collection;
var utils = require(global.rootPath + 'server/common/utils.js');
var transforms = require(global.rootPath + 'server/common/transforms.js');
var pre = require(global.rootPath + 'server/common/pre.js');

var mandrill = require("node-mandrill")(config.get('email.mandrill.apiKey'));

console.log("mandrill: ", config.get('email.mandrill'));


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
        return Boom.badImplementation(errMsg);
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

    var validation = Joi.validate(value, schema, config.get('hapi.joi'));

    if (validation.error) {
        return next(validation.error);
    }

    return next(undefined, validation.value);
};


internals.validatePayloadForCreate = function(value, options, next) {

    var schemaCreate = Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        newPw: Joi.string().required()
    });

    return internals.validatePayload(value, options, next, schemaCreate);
};


internals.validatePayloadForUpdate = function(value, options, next) {

    var schemaUpdate = Joi.object().keys({
        id: Joi.number().integer().min(0).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        currentPw: Joi.string(),
        newPw: Joi.string(),
        updateProfile: Joi.boolean()
    });

    return internals.validatePayload(value, options, next, schemaUpdate);
};




internals.validatePayload = function(value, options, next, schema) {
    debugger;

    if (_.isObject(value) && !_.isArray(value)) {
        value = [value];
    }

    // validate the elements of the array using the given schema
    var validation = Joi.validate(value, Joi.array().includes(schema), config.get('hapi.joi'));

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
                console.log(utils.logHandlerInfo(request));
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
                        var transform    = transforms.transformArray;

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

                auth: config.get('hapi.auth'),
                pre: [pre.abortIfNotAuthenticated],

                description: 'Get all the resources',
                notes: 'Returns all the resources (full collection)',
                tags: ['api'],
            }
        });

    
        // READ (one or more, but not all)
        server.route({
            method: 'GET',
            path: internals.resourcePath + "/{ids}",
            handler: function (request, reply) {
                console.log(utils.logHandlerInfo(request));
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
                        var resp         = usersC.toJSON();
                        var transformMap = transforms.maps.user;
                        var transform    = transforms.transformArray;

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
                validate: {
                    params: internals.validateIds,
                },
                auth: config.get('hapi.auth'),
                pre: [pre.abortIfNotAuthenticated],

                description: 'Get 2 (short description)',
                notes: 'Get 2 (long description)',
                tags: ['api'],
            }
        });
/*
        // CREATE (one or more)
        server.route({
            method: 'POST',
            path: internals.resourcePath,
            handler: function (request, reply) {
                console.log(utils.logHandlerInfo(request));
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
                auth: utils.getAuthConfig("required"),


                description: 'Post (short description)',
                notes: 'Post (long description)',
                tags: ['api'],
            }
        });
*/
        // UPDATE (one or more)
        server.route({
            method: 'PUT',
            path: internals.resourcePath + "/{ids}",
            handler: function (request, reply) {

                console.log(utils.logHandlerInfo(request));
    debugger;

                var usersC = new UsersC(request.payload);
                var dbUsersC = request.pre.usersC;

                var usersGroupsC = request.pre.usersGroupsC;

                if(usersC.length!==1){
                    return reply(Boom.conflict("The collection should have only 1 model."));
                }

                var model = usersC.at(0);


                // this endpoint might be called from 2 places: a) the update profile menu,
                // or b) from the users menu; 

                // if it is from the update profile, then we force the id value to be the one in the credentials object
                if(model.get("update_profile") === true || model.get("id") === request.auth.credentials.id){
                    model.set("id", request.auth.credentials.id);

                    var userM = dbUsersC.findWhere({ id: request.auth.credentials.id});

                    if(model.get("current_pw")){
                        // 1. verify that the current password match with the one
                        // in the database
                        var res = Bcrypt.compareSync(model.get("current_pw"), userM.get("pwHash"));

                        // 2. if so set the new password in the correct key
                        if(res){
                            model.set("pw_hash", Bcrypt.hashSync(model.get("new_pw"), 10))
                        }
                        else{
                            return reply(Boom.conflict("The current password does not match."))   
                        }

                    }
                }
                // if it called from the users menu, then we verify if the user is admin
                else{
                    var adminGroupCode = 99;
                    var isAdmin = usersGroupsC.findWhere({userId: request.auth.credentials.id, groupCode: adminGroupCode });
                    if(!isAdmin){
                        return reply(Boom.conflict("To edit the details of other users you must be in the admin group"));    
                    }
                }

                usersC.reset([model]);
                var dbData = JSON.stringify(usersC.toJSON());

                usersC.execute({
                    query: {
                        command: "select * from users_update($1);",
                        arguments: [dbData]
                    },
                    reset: true
                })
                .done(
                    function(){
    debugger;
                        var resp      = usersC.toJSON();
                        var transformMap = transforms.maps.user;
                        var transform    = transforms.transformArray;

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
                validate: {
                    params: internals.validateIds,
                    //payload: internals.validatePayload
                    payload: internals.validatePayloadForUpdate

                },
                auth: config.get('hapi.auth'),

                pre: [
                    pre.abortIfNotAuthenticated,
                    [pre.db.read_users, pre.db.read_users_groups]
                ],

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
                    },
                    reset: true
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
                pre: [pre.abortIfNotAuthenticated],
                auth: config.get('hapi.auth'),

                description: 'Delete (short description)',
                notes: 'Delete (long description)',
                tags: ['api'],
            }
        });
/*    */


    // CREATE A PASSWORD TOKEN

    server.route({
        method: 'GET',
        path: internals.resourcePath + "/recover/{email}",
        handler: function(request, reply) {

            console.log(utils.logHandlerInfo(request));
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

                        var publicPort = (config.get('publicPort') === 80) ? "" : (":" + config.get('publicPort'));
                        var recoverUri = config.get('publicUri') + publicPort + "/en/recover?token=" + usersC.at(0).get("recover");


                        var deferred = Q.defer();


                        mandrill(
                            '/messages/send', {
                                message: {
                                    to: [{
                                        email: email,
                                        name: name
                                    }],
                                    from_email: config.get('email.fromEmail'),
                                    from_name: config.get('email.fromName'),
                                    subject: config.get('email.subject'),
                                    text: config.get('email.body') + recoverUri
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

            console.log(utils.logHandlerInfo(request));
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
