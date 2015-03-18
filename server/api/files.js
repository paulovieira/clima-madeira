var stream = require('stream');
var Boom = require('boom');
var Joi = require('joi');
var config = require('config');
var fs = require('fs');
var Q = require("q");

//var ent = require("ent");
var _ = require('underscore');
var _s = require('underscore.string');
var changeCaseKeys = require('change-case-keys');

var FilesC = require("../../server/models/base-model.js").collection;
var utils = require('../../server/common/utils.js');
var transforms = require('../../server/common/transforms.js');
var pre = require('../../server/common/pre.js');



var internals = {};
/*** RESOURCE CONFIGURATION ***/

internals.resourceName = "files";
internals.resourcePath = "/files";


internals.isDbError = function (err){
    return !!err.sqlState;
};

internals.parseDbErrMsg = function(msg){
    // NOTE: msg.split(msg, "\n") isn't working here
    var arrayMsg = _s.lines(msg);

    arrayMsg = arrayMsg.filter(function(line){
        return _s.startsWith(line.toLowerCase(), "error:") || _s.startsWith(line.toLowerCase(), "detail:");
    });

    return arrayMsg.join(". ");
};

internals.parseError = function(err){
    if(internals.isDbError(err)){  
        var errMsg = internals.parseDbErrMsg(err.message);
        return Boom.badImplementation(errMsg);
    } 

    return Boom.badImplementation(err.message);  
};


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
        //tags: Joi.string().regex(/^$|^[-\w\s]+(?:,[-\w\s]+)*$/).allow(""),
        //newfile: Joi.object().type(stream.Readable).strict()
        //newfile: Joi.any().strict()
    });

    return internals.validatePayload(value, options, next, schemaCreate);
};


internals.validatePayloadForUpdate = function(value, options, next){

    console.log("validatePayloadForUpdate");

    var schemaUpdate = Joi.object().keys({
        id: Joi.number().integer().min(0),

        name: Joi.string().required(),

        path: Joi.string().required(),

        //tags: Joi.array().unique().min(0).includes(Joi.string()),
        tags: Joi.string().regex(/^[-\w\s]+(?:,[-\w\s]+)*$/).allow(""),

        description: Joi.object().keys({
            pt: Joi.string().required(),
            en: Joi.string().required()
        }),

    });

    return internals.validatePayload(value, options, next, schemaUpdate);
};



// NOTE: unlike the validations for other endpoints, here we don't convert to array (because that
// will make things difficult for the creation of the file buffer)
internals.validatePayload = function(value, options, next, schema){
debugger;


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
            utils.logHandlerInfo("/api" + internals.resourcePath, request);
debugger;

        	var filesC = new FilesC();
        	filesC.execute({
				query: {
                    command: "select * from files_read()"
				}
        	})
        	.done(
        		function(){
                    var resp         = filesC.toJSON();
                    var transformMap = transforms.maps.files;
                    var transform    = transforms.transformArray;

                    return reply(transform(resp, transformMap));
                    //return reply(resp);
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
            utils.logHandlerInfo("/api" + internals.resourcePath + "/{ids}", request);
debugger;

            var queryOptions = [];
            request.params.ids.forEach(function(id){
                queryOptions.push({id: id});
            });

            var filesC = new FilesC();
            filesC.execute({
                query: {
                    command: "select * from files_read($1)",
                    arguments: [ JSON.stringify(queryOptions) ]
                }
            })
            .done(
                function(){
debugger;
                    var resp         = filesC.toJSON();
                    var transformMap = transforms.maps.files;
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
/**/
    // CREATE (one or more)
    server.route({
        method: 'POST',
        path: internals.resourcePath,
        handler: function (request, reply) {
            utils.logHandlerInfo("/api" + internals.resourcePath, request);
debugger;

//console.log("request.payload: ", request.payload);
            var filename = request.payload.newfile.hapi.filename;
            var logicalPath = "/uploads/public/";
            var physicalPath = global.rootPath + "data";


            var ws = fs.createWriteStream(physicalPath + logicalPath + filename);
            request.payload.newfile.pipe(ws);

            ws.on("finish", function(){

                var dbData = [{
                    name: filename,
                    path: logicalPath,
                    tags: request.payload.tags,
                    ownerId: request.auth.credentials.id
                }];

                var filesC = new FilesC();
                filesC.execute({
                    query: {
                        command: "select * from files_create($1);",
                        arguments: [JSON.stringify(changeCaseKeys(dbData, "underscored"))]
                    }
                })
                .done(
                    function(){
    debugger;
                        var resp = filesC.toJSON();
                        return reply(resp);
                    },
                    function(err){
    debugger;
                        var boomErr = internals.parseError(err);
                        return reply(boomErr);
                    }
                );
                
            });

            ws.on("error", function(err){
                var boomErr = internals.parseError(err);
                return reply(boomErr);
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

            utils.logHandlerInfo("/api" + internals.resourcePath, request);
debugger;

            var dbData = [request.payload];
console.log("dbData: ", dbData);

            var filesC = new FilesC();
        	filesC.execute({
				query: {
				  	command: "select * from files_update($1);",
                    arguments: [JSON.stringify(changeCaseKeys(dbData, "underscored"))]
				},
                reset: true
        	})
        	.done(
        		function(){
debugger;
                    var resp = filesC.toJSON();

                    // var transformMap = transforms.maps.files;
                    // var transform    = transforms.transformArray;

                    // return reply(transform(resp, transformMap));
                    return reply(resp);
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
                payload: internals.validatePayloadForUpdate
			},

            pre: [
                pre.abortIfNotAuthenticated,
                pre.payload.extractTags
            ],

            auth: config.get('hapi.auth'),
            
            payload: {
                maxBytes: 1048576*3  // 3 megabytes
            },
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

            var queryOptions = [];
            request.params.ids.forEach(function(id){
                queryOptions.push({id: id});
            });

                    // var boomErr = internals.parseError(err);
                    // return reply(boomErr);

            var filesC = new FilesC();
            filesC.execute({
                query: {
                    command: "select * from files_delete($1)",
                    arguments: [ JSON.stringify(queryOptions) ]
                },
                reset: true
            })
            .done(
                function(){
debugger;
                    return reply(filesC.toJSON());
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



