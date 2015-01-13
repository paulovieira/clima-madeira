var Boom = require('boom');
var Joi = require('joi');
var _ = require('underscore');
var _s = require('underscore.string');
var TextsC = require("../models/baseModel.js").collection;
var utils = require('../config/utils.js');


var internals = {};
/*** RESOURCE CONFIGURATION ***/

internals.resourceName = "texts";
internals.resourcePath = "/texts";


internals.schemas = {};

internals.schemas.baseModel = Joi.object().keys({
    first: Joi.string().allow("").required(),
    last: Joi.string().allow("").required(),
    email: Joi.string().required()
});

internals.schemas.idSchema = Joi.number().integer().min(0);

internals.schemas.schemaUpdateUser = internals.schemas.baseModel.keys({
    id: internals.schemas.idSchema.required(),
});

internals.schemas.schemaCreateUser = internals.schemas.baseModel.keys({
    pwHash: Joi.string().required()
});

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
        return Boom.conflict(errMsg);
    } 

    return Boom.badImplementation(err.message);  
};

internals.parseTextsArray2 = function(resp){
    // 1. flatten each row: for each object we want to place the properties in the "contents" object
    // directly to the main object (that is, instead of "obj.contents.pt" we want "obj.pt")
    resp.forEach(function(obj){
        Object.keys(obj.contents).forEach(function(key){
            obj[key] = obj.contents[key];
        });

        delete obj.contentsDesc;
        delete obj.authorId;
        delete obj.active;
    });

    return resp;
};
/*
internals.deleteProps = function(array){
    var args = Array.prototype.slice.call(arguments);
    if(!_.isArray(array)){ array = [array]; }

    var key, i, j, li, lj;

    for(var i=1, li=args.length; i<li; i++){
        key = args[i];
        for(var j=0, lj=array.length; j<lj; j++){ 
            delete (array[j])[key];
        }
    }
}
*/

// validate the ids param in the URL
internals.validateIds = function(value, options, next){
debugger;
//return next(undefined, value);


    value.ids = _s.trim(value.ids, ",").split(",");

    var idSchema = internals.schemas.idSchema;
    var schema = Joi.object().keys({
        ids: Joi.array().unique().includes(idSchema)
    });

    var validation = Joi.validate(value, schema);

    if(validation.error){  return next(validation.error);  }

    return next(undefined, validation.value);
};

// validate incoming payload
internals.validatePayload = function(value, options, next){
debugger;


    if(_.isObject(value) && !_.isArray(value)){  value = [value];  }
    return next(undefined, value);

    // validateIds was executed before this one; the ids param (if it defined) is now an array of integers
    var ids = options.context.params.ids;

    // if the ids param in the URL is defined (<=> we are at the PUT route), use the model schema that requires the id;
    // otherwise, use mode schema that requires the pw_hash
    var modelSchema = ids ? internals.schemas.schemaUpdateUser : internals.schemas.schemaCreateUser;

    var payloadSchema = Joi.array().includes(modelSchema);

    var validation = Joi.validate(value, payloadSchema);

    if(validation.error){  return next(validation.error); }

    // finally, if the ids param is defined, make sure that the ids in the param and the ids in the payload are consistent
    if(ids){
        for(var i=0, l=validation.value.length; i<l; i++){
            // ids in the URL param and ids in the payload must be in the same order
            if(ids[i] !== validation.value[i].id){
                return next(Boom.conflict("The ids given in the payload and in the URI must match (including the order)."));
            }
        }
    }

    return next(undefined, validation.value);
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
        	var textsC = new TextsC();

        	textsC.execute({
        		// read data using the following postgres function/view; we could use a different
        		// function/view if we wanted
				query: {
                    command: "select * from texts_read()"
				},
                parse: internals.parseTextsArray2

        	})
        	.done(
        		function(){
	        		reply(textsC.toJSON());
        		},
                function(err){
debugger;

                    var boomErr = internals.parseError(err);
                    reply(boomErr);
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

	// READ (one or more, but not all)
    server.route({
        method: 'GET',
        path: internals.resourcePath + "/{ids}",
        handler: function (request, reply) {
            utils.logHandlerInfo("/api" + internals.resourcePath + "/{ids}", request);
debugger;
            var textsC = new TextsC();
            request.params.ids.forEach(function(id){
                textsC.add({id: id});
            });

            var queryOptions = JSON.stringify(textsC.toJSON());

            textsC.execute({
                query: {
                    command: "select * from texts_read($1)",
                    arguments: [queryOptions]
                },
                parse: internals.parseTextsArray2


            })
            .done(
                function(){
debugger;
                    reply(textsC.toJSON());
                },
                function(err){
debugger;
                    var boomErr = internals.parseError(err);
                    reply(boomErr);
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
            request.auth.credentials = request.auth.credentials || {};
            if(!request.auth.credentials.id){
                request.auth.credentials.id = 8;
            }

        	var textsC = new TextsC(request.payload);

            textsC.forEach(function(model){
                model.set("author_id", request.auth.credentials.id);
                model.set("tags", []);
            });

            var dbData = JSON.stringify(textsC.toJSON());
            var dbDataOptions = JSON.stringify({eraseFields: true });

        	textsC.execute({
				query: {
                    command: "select * from texts_create($1, $2);",
                    arguments: [dbData, dbDataOptions]
                },
                parse: internals.parseTextsArray2

        	})
        	.done(
        		function(){
debugger;
	        		reply(textsC.toJSON());
        		},
                function(err){
debugger;

                    var boomErr = internals.parseError(err);
                    reply(boomErr);
                }
        	);

        },
        config: {
        	validate: {
        		payload: internals.validatePayload
        	},

			description: 'Post (short description)',
			notes: 'Post (long description)',
			tags: ['api'],
            auth: {
                mode: "required"
            },
//            auth: false
        }
    });

    // UPDATE (one or more)
    server.route({
        method: 'PUT',
        path: internals.resourcePath + "/{ids}",
        handler: function (request, reply) {
debugger;
        	var textsC = new TextsC(request.payload);

            var dbData = JSON.stringify(textsC.toJSON());
            var dbDataOptions = JSON.stringify({eraseFields: true });

        	textsC.execute({
				query: {
				  	command: "select * from texts_update($1, $2);",
                    arguments: [dbData, dbDataOptions]
				},
                parse: internals.parseTextsArray2

        	})
        	.done(
        		function(){
debugger;
	        		reply(textsC.toJSON());
        		},
                function(err){
debugger;

                    var boomErr = internals.parseError(err);
                    reply(boomErr);
                }   
        	);
        },
        config: {
			validate: {
	            params: internals.validateIds,
        		payload: internals.validatePayload
			},

			description: 'Put (short description)',
			notes: 'Put (long description)',
			tags: ['api'],
            auth: {
                mode: "required"
            },
            auth: false
        }
    });

    // DELETE (one or more)
    server.route({
        method: 'DELETE',
        path: internals.resourcePath + "/{ids}",
        handler: function (request, reply) {
debugger;
            var textsC = new TextsC();
            request.params.ids.forEach(function(id){
                textsC.add({id: id});
            })

            var dbData = JSON.stringify(textsC.toJSON());
            var dbDataOptions = JSON.stringify({eraseFields: true });

            textsC.execute({
                query: {
                    command: "select * from texts_delete($1, $2)",
                    arguments: [dbData, dbDataOptions]
                },
                parse: function(resp, options){
debugger;
                    return resp;
                }
            })
            .done(
                function(){
debugger;
                    reply(textsC.toJSON());
                },
                function(err){
debugger;
                    var boomErr = internals.parseError(err);
                    reply(boomErr);
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





