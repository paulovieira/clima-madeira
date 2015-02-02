var Boom = require('boom');
var Joi = require('joi');
//var ent = require("ent");
var _ = require('underscore');
var _s = require('underscore.string');
var changeCaseKeys = require('change-case-keys');

var BaseC = require(global.rootPath + "server/models/base-model.js").collection;
var utils = require(global.rootPath + 'server/common/utils.js');
var transforms = require(global.rootPath + 'server/common/transforms.js');
var settings = require(global.rootPath + "config/server.js");
var pre = require(global.rootPath + 'server/common/pre.js');




var internals = {};
/*** RESOURCE CONFIGURATION ***/

internals.resourceName = "shapes_climaticos";
internals.resourcePath = "/shapes_climaticos";



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


// validate the ids param in the URL
internals.validateIds = function(value, options, next){
debugger;

    value.ids = _s.trim(value.ids, ",").split(",");


    var idSchema = Joi.number().integer().min(0);

    // must be an objet like this: { ids: [3,5,7] }
    var schema = Joi.object().keys({
        ids: Joi.array().unique().includes(idSchema)
    });

    var validation = Joi.validate(value, schema, settings.joiOptions);

    if(validation.error){  return next(validation.error);  }

    return next(undefined, validation.value);
};


// internals.validatePayloadForCreate = function(value, options, next){

//     var schemaCreate = Joi.object().keys({
//         id: Joi.number().integer().min(0),

//         tags: Joi.array().unique().includes(Joi.string()).required(),

//         contents: Joi.object().keys({
//             pt: Joi.string().required(),
//             en: Joi.string().required()
//         }).required(),

//         contentsDesc: Joi.object().keys({
//             pt: Joi.string().required(),
//             en: Joi.string().required()
//         }),

//         active: Joi.boolean()
//     });

//     return internals.validatePayload(value, options, next, schemaCreate);
// };


// internals.validatePayloadForUpdate = function(value, options, next){

//     var schemaUpdate = Joi.object().keys({
//         id: Joi.number().integer().min(0).required(),

//         tags: Joi.array().unique().includes(Joi.string()).required(),

//         contents: Joi.object().keys({
//             pt: Joi.string().allow("").required(),
//             en: Joi.string().allow("").required()
//         }).required(),

//         contentsDesc: Joi.object().keys({
//             pt: Joi.string().required(),
//             en: Joi.string().required()
//         }),

//         active: Joi.boolean()
//     });

//     return internals.validatePayload(value, options, next, schemaUpdate);
// };




// internals.validatePayload = function(value, options, next, schema){
// debugger;

//     if(_.isObject(value) && !_.isArray(value)){  value = [value];  }

//     // validate the elements of the array using the given schema
//     var validation = Joi.validate(value, Joi.array().includes(schema), settings.joiOptions);

//     if(validation.error){  return next(validation.error); }


//     // validateIds was executed before this one; the ids param (if defined) is now an array of integers
//     var ids = options.context.params.ids;

//     // finally, if the ids param is defined, make sure that the ids in the param and the ids in the payload are consistent
//     if(ids){
//         for(var i=0, l=validation.value.length; i<l; i++){
//             // ids in the URL param and ids in the payload must be in the same order
//             if(ids[i] !== validation.value[i].id){
//                 return next(Boom.conflict("The ids given in the payload and in the URI must match (including the order)."));
//             }
//         }
//     }

//     // update the value that will be available in request.payload when the handler executes;
//     // there are 2 differences: a) Joi has coerced the values to the type defined in the schemas;
//     // b) the keys will be in underscored case (ready to be used by the postgres functions)
//     return next(undefined, changeCaseKeys(validation.value, "underscored"));
// };

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
        	var baseC = new BaseC();

        	baseC.execute({
				query: {
                    command: "select * from shapes_climaticos_read()"
				},
                changeCase: false
        	})
        	.done(
        		function(){
                    var resp      = baseC.toJSON();
                    //var transform = transforms.featuresToHeatmap;

                    return reply(transforms.heatmap(resp, "tmeanRef"));
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

	// READ (one or more, but not all)
//     server.route({
//         method: 'GET',
//         path: internals.resourcePath + "/{ids}",
//         handler: function (request, reply) {
//             utils.logHandlerInfo("/api" + internals.resourcePath + "/{ids}", request);
// debugger;
//             var textsC = new TextsC();
//             request.params.ids.forEach(function(id){
//                 textsC.add({id: id});
//             });

//             var queryOptions = JSON.stringify(textsC.toJSON());

//             textsC.execute({
//                 query: {
//                     command: "select * from texts_read($1)",
//                     arguments: [queryOptions]
//                 }
//             })
//             .done(
//                 function(){
// debugger;
//                     var resp      = textsC.toJSON();
//                     var transform = transforms.text;

//                     return reply(utils.transform(resp, transform));
//                 },
//                 function(err){
// debugger;
//                     var boomErr = internals.parseError(err);
//                     return reply(boomErr);
//                 }
//             );

//         },
//         config: {
// 			validate: {
// 	            params: internals.validateIds,
// 			},

// 			description: 'Get 2 (short description)',
// 			notes: 'Get 2 (long description)',
// 			tags: ['api'],
//             auth: {
//                 mode: "required"
//             },
//             auth: false
//         }
//     });

//     // CREATE (one or more)
//     server.route({
//         method: 'POST',
//         path: internals.resourcePath,
//         handler: function (request, reply) {
//             utils.logHandlerInfo("/api" + internals.resourcePath, request);
// debugger;

//             if(!request.auth.credentials.id){
//                 return reply(Boom.unauthorized("To create a new resource you must sign in."));
//             }

//         	var textsC = new TextsC(request.payload);

//             textsC.forEach(function(model){
//                 model.set("author_id", request.auth.credentials.id || 1);
//             });

//             var dbData = JSON.stringify(textsC.toJSON());

//         	textsC.execute({
// 				query: {
//                     command: "select * from texts_create($1);",
//                     arguments: [dbData]
//                 }
//         	})
//         	.done(
//         		function(){
// debugger;
//                     var resp      = textsC.toJSON();
//                     var transform = transforms.text;

//                     return reply(utils.transform(resp, transform));
//         		},
//                 function(err){
// debugger;

//                     var boomErr = internals.parseError(err);
//                     return reply(boomErr);
//                 }
//         	);

//         },
//         config: {
//         	validate: {
//                 payload: internals.validatePayloadForCreate
//         	},

//             auth: {
//                 mode: "required"
//             },
// //            auth: false,

// 			description: 'Post (short description)',
// 			notes: 'Post (long description)',
// 			tags: ['api'],
//         }
//     });

//     // UPDATE (one or more)
//     server.route({
//         method: 'PUT',
//         path: internals.resourcePath + "/{ids}",
//         handler: function (request, reply) {

//             utils.logHandlerInfo("/api" + internals.resourcePath, request);
// debugger;


//             if(!request.auth.credentials.id){
//                 return reply(Boom.unauthorized("To create a new resource you must sign in."));
//             }

//             var textsC = new TextsC(request.payload);

//             textsC.forEach(function(model){
//                 model.set("author_id", request.auth.credentials.id);
//             });

//             var dbData = JSON.stringify(textsC.toJSON());

//         	textsC.execute({
// 				query: {
// 				  	command: "select * from texts_update($1);",
//                     arguments: [dbData]
// 				}
//         	})
//         	.done(
//         		function(){
// debugger;
//                     var resp      = textsC.toJSON();
//                     var transform = transforms.text;

//                     return reply(utils.transform(resp, transform));
//         		},
//                 function(err){
// debugger;

//                     var boomErr = internals.parseError(err);
//                     return reply(boomErr);
//                 }   
//         	);
//         },
//         config: {
// 			validate: {
// 	            params: internals.validateIds,
//                 payload: internals.validatePayloadForUpdate

// 			},
//             pre: [
// //                pre.db.read_user_by_email
//             ],
//             auth: {
//                 mode: "required"
//             },
// //            auth: false,

// 			description: 'Put (short description)',
// 			notes: 'Put (long description)',
// 			tags: ['api'],
//         }
//     });

//     // DELETE (one or more)
//     server.route({
//         method: 'DELETE',
//         path: internals.resourcePath + "/{ids}",
//         handler: function (request, reply) {
// debugger;
//             var textsC = new TextsC();
//             request.params.ids.forEach(function(id){
//                 textsC.add({id: id});
//             })

//             var dbData = JSON.stringify(textsC.toJSON());

//             textsC.execute({
//                 query: {
//                     command: "select * from texts_delete($1)",
//                     arguments: [dbData]
//                 }
//             })
//             .done(
//                 function(){
// debugger;
//                     return reply(textsC.toJSON());
//                 },
//                 function(err){
// debugger;
//                     var boomErr = internals.parseError(err);
//                     return reply(boomErr);
//                 }
//             );
//         },

//         config: {
// 			validate: {
// 	            params: internals.validateIds,
// 			},

// 			description: 'Delete (short description)',
// 			notes: 'Delete (long description)',
// 			tags: ['api'],
//             auth: {
//                 mode: "required"
//             },
//             auth: false
//         }
//     });

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



