var stream = require('stream');
var Boom = require('boom');
var Path = require('path');
var Joi = require('joi');
var config = require('config');
var fs = require('fs');
var Q = require("q");
var rimraf = require("rimraf");

//var ent = require("ent");
var _ = require('underscore');
var _s = require('underscore.string');
var changeCaseKeys = require('change-case-keys');

var BaseC = require("../../server/models/base-model.js").collection;
var utils = require('../../server/common/utils.js');
var transforms = require('../../server/common/transforms.js');
var pre = require('../../server/common/pre.js');



var internals = {};
/*** RESOURCE CONFIGURATION ***/

internals.resourceName = "files";
internals.resourcePath = "/files";



// validate the ids param in the URL
internals.validateIds = function(value, options, next){
debugger;

    value.ids = _s.trim(value.ids, ",").split(",");


    var idSchema = Joi.number().integer().min(0);

    // must be an objet like this: { ids: [3,5,7] }
    var schema = Joi.object().keys({
        ids: Joi.array().unique().includes(idSchema)
    });

    var validation = Joi.validate(value, schema, config.get('hapi.joi'));

    if(validation.error){  return next(validation.error);  }

    return next(undefined, validation.value);
};


// NOTE: not used for files
internals.validatePayloadForCreate = function(value, options, next){

    console.log("validatePayloadForCreate");

    var schemaCreate = Joi.object().keys({


    });

    return internals.validatePayload(value, options, next, schemaCreate);
};


internals.validatePayloadForUpdate = function(value, options, next){

    console.log("validatePayloadForUpdate");

    var schemaUpdate = Joi.object().keys({
        id: Joi.number().integer().min(0),

        name: Joi.string(),

        logicalPath: Joi.string(),

        // physicalPath: Joi.string(),

        //tags: Joi.array().unique().min(0).includes(Joi.string()),
        //tags: Joi.string().regex(/^[-\w\s]+(?:,[-\w\s]+)*$/).allow(""),
        tags: Joi.string().allow(""),

        description: Joi.object().keys({
            pt: Joi.string(),
            en: Joi.string()
        }),

        properties: Joi.object()

    });

    return internals.validatePayload(value, options, next, schemaUpdate);
};




internals.validatePayload = function(value, options, next, schema){
debugger;

// NOTE: unlike the validations for other endpoints, here we don't convert to array (because that
// will make things difficult for the creation of the file buffer)
//    if(_.isObject(value) && !_.isArray(value)){  value = [value];  }

    var validation = Joi.validate(value, schema, config.get('hapi.joi'));

    if(validation.error){  return next(validation.error); }


    // validateIds was executed before this one; the ids param (if defined) is now an array of integers
    var ids = options.context.params.ids;

    // finally, if the ids param is defined, make sure that the ids in the param and the ids in the payload are consistent
    if(ids){
        if(ids[0] !== validation.value.id){
            return next(Boom.conflict("The ids given in the payload and in the URI must match (including the order)."));
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

            var filesC = request.pre.allFiles;

            var resp         = filesC.toJSON();
            var transformMap = transforms.maps.files;
            var transform    = transforms.transformArray;

            return reply(transform(resp, transformMap));
        },

        config: {

            pre: [
                pre.abortIfNotAuthenticated,
                pre.db.getAllFiles
            ],

            auth: config.get('hapi.auth'),
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

            var filesC = request.pre.filesById;
            
            if(filesC.length===0){
                return reply(Boom.notFound("The resource with id " + request.params.ids[0] + " does not exist."));
            }

            var resp         = filesC.toJSON();
            var transformMap = transforms.maps.files;
            var transform    = transforms.transformArray;

            return reply(transform(resp, transformMap));
        },

        config: {
			validate: {
	            params: internals.validateIds,
			},

            pre: [
                pre.abortIfNotAuthenticated,
                pre.db.getFilesById
            ],

            auth: config.get('hapi.auth'),
			description: 'Get 2 (short description)',
			notes: 'Get 2 (long description)',
			tags: ['api'],

        }
    });

    // CREATE (one or more)
    server.route({
        method: 'POST',
        path: internals.resourcePath,
        handler: function (request, reply) {
            console.log(utils.logHandlerInfo(request));
debugger;

//console.log("request.payload: ", request.payload);

            var filename     = request.payload.new_file.hapi.filename;
            var logicalPath  = config.get("uploads.logicalPath");
            var physicalPath = config.get("uploads.physicalPath");

            var ws = fs.createWriteStream(Path.join(global.rootPath, physicalPath, filename));
            request.payload.new_file.pipe(ws);

            ws.on("finish", function(){

                var dbData = {
                    name: filename,
                    logicalPath: logicalPath,
                    physicalPath: physicalPath,
                    tags: request.payload.tags,
                    ownerId: request.auth.credentials.id
                };

                var filesC = new BaseC();
                filesC.execute({
                    query: {
                        command: "select * from files_create($1);",
                        arguments: [JSON.stringify(changeCaseKeys(dbData, "underscored"))]
                    }
                })
                .then(function(createdData){

                    // read the data that was created (to obtain the joined data)
                    return filesC.execute({
                        query: {
                            command: "select * from files_read($1);",
                            arguments: [JSON.stringify( {id: createdData[0].id} )]
                        },
                        reset: true
                    });

                })
                .then(function(){
                    // we couldn't read - something went wrong
                    if(filesC.length===0){
                        return reply(Boom.badImplementation());
                    }

                    var resp         = filesC.toJSON();
                    var transformMap = transforms.maps.files;
                    var transform    = transforms.transformArray;

                    return reply(transform(resp, transformMap));
                })
                .catch(function(err){
                    return reply(Boom.badImplementation(err.message));
                })
                .done();
                
            });

            ws.on("error", function(err){
                return reply(Boom.badImplementation(err.message));
            });


        },
        config: {
        	validate: {
                // NOTE: to crate a new file we have to send the file itself in a form (multipart/form-data);
                // but if we do the validation the buffer will somehow be messed up by Joi; so here we don't
                // do the validation

                //payload: internals.validatePayloadForCreate
        	},
            auth: config.get('hapi.auth'),
            pre: [
                pre.abortIfNotAuthenticated,
                pre.payload.extractTags
            ],

            payload: {
                output: "stream",
                parse: true,
                maxBytes: 1048576*3  // 3 megabytes
            },
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

            console.log(utils.logHandlerInfo(request));
debugger;

            var filesC = request.pre.filesById;
            if(filesC.length===0){
                return reply(Boom.notFound("The resource with id " + request.params.ids[0] + " does not exist."));
            }

            filesC.execute({
                query: {
                    command: "select * from files_update($1);",
                    arguments: [JSON.stringify(request.payload)]
                },
                reset: true 
            })
            .then(function(updatedData){

                // read the data that was updated (to obtain the joined data)
                return filesC.execute({
                    query: {
                        command: "select * from files_read($1);",
                        arguments: [JSON.stringify( {id: updatedData[0].id} )]
                    },
                    reset: true
                });

            })
            .then(function(){
                // we couldn't read - something went wrong
                if(filesC.length===0){
                    return reply(Boom.badImplementation());
                }

                var resp         = filesC.toJSON();
                var transformMap = transforms.maps.files;
                var transform    = transforms.transformArray;

                return reply(transform(resp, transformMap));
            })
            .catch(function(err){
                return reply(Boom.badImplementation(err.message));
            })
            .done();

        },

        config: {
			validate: {
	            params: internals.validateIds,
                payload: internals.validatePayloadForUpdate
			},

            pre: [
                pre.abortIfNotAuthenticated,
                [pre.db.getFilesById, pre.payload.extractTags]
            ],

            payload: {
                maxBytes: 1048576*3  // 3 megabytes
            },

            auth: config.get('hapi.auth'),
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
            console.log(utils.logHandlerInfo(request));

            var filesC = request.pre.filesById;
            if(filesC.length===0){
                return reply(Boom.notFound("The resource with id " + request.params.ids[0] + " does not exist."));
            }

            var fileFullPath = Path.join(global.rootPath, filesC.at(0).get("physicalPath"), filesC.at(0).get("name"));

            var deferred = Q.defer(),
                promise = deferred.promise;

            rimraf(fileFullPath, function(err){
                if(err){
                    return deferred.reject(err);
                }

                return deferred.resolve();
            })

            promise
            .then(function(){
                var promise2 = filesC.execute({
                    query: {
                        command: "select * from files_delete($1)",
                        arguments: [JSON.stringify( {id: request.params.ids[0]} )]
                    },
                    reset: true
                });

                return promise2;
            })
            .then(function(){
                return reply(filesC.toJSON());
            })
            .catch(function(err){
                return reply(Boom.badImplementation(err.message));
            })
            .done();

        },

        config: {

			validate: {
	            params: internals.validateIds,
			},

            pre: [
                pre.abortIfNotAuthenticated,
                pre.db.getFilesById
            ],

            auth: config.get('hapi.auth'),
			description: 'Delete (short description)',
			notes: 'Delete (long description)',
			tags: ['api'],
        }
    });

    // any other request will receive a 405 Error
    server.route({
        method: '*',
        path: internals.resourcePath + "/{p*}",
        handler: function (request, reply) {
        	var output = Boom.methodNotAllowed('The method is not allowed for the given URI.');  // 405
            reply(output);
        }
    });

    next();
};

exports.register.attributes = {
    name: internals.resourceName,
    version: '1.0.0'
};




/***



CURL TESTS
==============


curl  -X GET http://127.0.0.1:3000/api/files

curl  -X GET http://127.0.0.1:3000/api/files/1

curl  -X GET http://127.0.0.1:3000/api/files/1,2



curl -X POST http://127.0.0.1:3000/api/files  \
    -H "Content-Type: application/json"  \
    -d '{ "first_name": "paulo" }' 



curl -X PUT http://127.0.0.1:3000/api/files/42   \
    -H "Content-Type: application/json"  \
    -d '{"id": 42, "name": "relatório2.pdf", "logicalPath": "/uploads/public", "tags": "tag5, tag6" }' 




curl -X PUT http://127.0.0.1:3000/api/files/3   \
    -H "Content-Type: application/json"  \
    -d '{"id": 3, "firstName": "userx", "lastName": "yenergia", "email": "user_energia@gmail.com", "currentPw": "abc", "newPw": "xyz" }' 



curl -X DELETE http://127.0.0.1:3000/api/files/4


***/