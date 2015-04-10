var exec = require("child_process").exec;
var rimraf = require("rimraf");
var stream = require('stream');
var Path = require('path');
var Boom = require('boom');
var Joi = require('joi');
var config = require('config');
var fs = require('fs');
var Q = require("q");
var unzip = require('unzip');

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

internals.resourceName = "maps";
internals.resourcePath = "/maps";


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


internals.validatePayloadForCreate = function(value, options, next){

    console.log("validatePayloadForCreate");

    var schemaCreate = Joi.object().keys({

        code: Joi.string().required(),

        categoryId: Joi.number().integer().required(),

        title: Joi.object().keys({
            pt: Joi.string().allow(""),
            en: Joi.string().allow("")
        }).required(),

        selectedShapes: Joi.array().includes(Joi.object().keys({
            shapeId: Joi.number().integer().min(0).required()
        })),


/*
        id: Joi.number().integer().min(0),

        //tags: Joi.array().unique().min(0).includes(Joi.string()).required(),
        tags: Joi.string().regex(/^[-\w\s]+(?:,[-\w\s]+)*$/),

        contents: Joi.object().keys({
            pt: Joi.string().required(),
            en: Joi.string().required()
        }).required(),

        contentsDesc: Joi.object().keys({
            pt: Joi.string().required(),
            en: Joi.string().required()
        }),

        active: Joi.boolean()
*/
    });

    return internals.validatePayload(value, options, next, schemaCreate);
};


internals.validatePayloadForUpdate = function(value, options, next){

    console.log("validatePayloadForUpdate");

    var schemaUpdate = Joi.object().keys({
        id: Joi.number().integer().min(0).required(),

        code: Joi.string().required(),

        categoryId: Joi.number().integer().required(),

        title: Joi.object().keys({
            pt: Joi.string().allow(""),
            en: Joi.string().allow("")
        }).required(),

        selectedShapes: Joi.array().includes(Joi.object().keys({
            shapeId: Joi.number().integer().min(0).required()
        })),
/*
        contents: Joi.object().keys({
            pt: Joi.string().allow("").required(),
            en: Joi.string().allow("").required()
        }).required(),

        //tags: Joi.array().unique().min(0).includes(Joi.string()),
        tags: Joi.string().regex(/^[-\w\s]+(?:,[-\w\s]+)*$/),

        contentsDesc: Joi.object().keys({
            pt: Joi.string().required(),
            en: Joi.string().required()
        }),

        active: Joi.boolean()
*/
    });

    return internals.validatePayload(value, options, next, schemaUpdate);
};



internals.validatePayload = function(value, options, next, schema){
debugger;

    if(_.isObject(value) && !_.isArray(value)){  value = [value];  }

    // validate the elements of the array using the given schema
    var validation = Joi.validate(value, Joi.array().includes(schema), config.get('hapi.joi'));

    if(validation.error){  return next(validation.error); }


    // validateIds was executed before this one; the ids param (if defined) is now an array of integers
    var ids = options.context.params.ids;

    // finally, if the ids param is defined, make sure that the ids in the param and the ids in the payload are consistent
    if(ids){
        for(var i=0, l=validation.value.length; i<l; i++){
            // ids in the URL param and ids in the payload must be in the same order
            if(ids[i] !== validation.value[i].id){
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


            var mapsC = request.pre.allMaps;

            var resp         = mapsC.toJSON();
            var transformMap = transforms.maps.maps;
            var transform    = transforms.transformArray;

            return reply(transform(resp, transformMap));
        },

        config: {

            pre: [
                pre.abortIfNotAuthenticated,
                pre.db.getAllMaps
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

            var mapsC = request.pre.mapsById;
            
            if(mapsC.length===0){
                return reply(Boom.notFound("The resource with id " + request.params.ids[0] + " does not exist."));
            }

            var resp         = mapsC.toJSON();
            var transformMap = transforms.maps.maps;
            var transform    = transforms.transformArray;

            return reply(transform(resp, transformMap));
        },
        config: {
			validate: {
	            params: internals.validateIds,
			},

            pre: [
                pre.abortIfNotAuthenticated,
                pre.db.getMapsById
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

            request.payload.forEach(function(obj){
                obj["owner_id"] = request.auth.credentials.id;
            });

            var mapsC = request.pre.allMaps,
                shapesC = request.pre.allShapes,
                selectedShapes = request.payload[0].selected_shapes,
                newMapId;

            // verify that the map code is unique
            if(mapsC.findWhere({code: request.payload[0].code})){
                return reply(Boom.conflict("The map code must be unique."));
            }

            // verify that the choosen shapes exists in the server
            var allShapesExist = true;
            selectedShapes.forEach(function(obj){
                if(!shapesC.findWhere({id: obj.shapeId})){
                    allShapesExist = false;
                }                
            });

            if(!allShapesExist){
                return reply(Boom.conflict("Some of the shape files don't exist anymore. Reload the page and choose again."));   
            }

            mapsC.execute({
                query: {
                    command: "select * from maps_create($1);",
                    arguments: [JSON.stringify(request.payload)]
                },
            })

            .then(function(createdData){

                // id to be used in the next handler
                newMapId = createdData[0].id;

                // now insert the associated shapes into the shapes_maps link table
                selectedShapes.forEach(function(obj){
                    obj["mapId"] = newMapId;
                });

                changeCaseKeys(selectedShapes, "underscored");

                return mapsC.execute({
                    query: {
                        command: "select * from shapes_maps_create($1);",
                        arguments: [JSON.stringify(selectedShapes)]
                    }
                })
            })

            .then(function(){

                // read the data that was created (to obtain the joined data)
                return mapsC.execute({
                    query: {
                        command: "select * from maps_read($1);",
                        arguments: [JSON.stringify( {id: newMapId} )]
                    },
                    reset: true
                });

            })

            .then(function(){
                // we couldn't read - something went wrong
                if(mapsC.length===0){
                    return reply(Boom.badImplementation());
                }

                var resp         = mapsC.toJSON();
                var transformMap = transforms.maps.maps;
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
                payload: internals.validatePayloadForCreate
            },

            pre: [
                pre.abortIfNotAuthenticated,
                [pre.db.getAllMaps, pre.db.getAllShapes]
            ],

            auth: config.get('hapi.auth'),
            description: 'Post (short description)',
            notes: 'Post (long description)',
            tags: ['api'],
        }
    });



    server.route({
        method: 'PUT',
        path: internals.resourcePath + "/{ids}",
        handler: function (request, reply) {

            console.log(utils.logHandlerInfo(request));
debugger;


            var mapsC = request.pre.mapsById,
                shapesC = request.pre.allShapes,
                shapesMapsC = request.pre.allShapesMaps,
                selectedShapes = request.payload[0].selected_shapes,
                updatedMapId;

console.log("request.payload: ", request.payload);

            if(mapsC.length===0){
                return reply(Boom.notFound("The resource with id " + request.params.ids[0] + " does not exist."));
            }

            // verify that the choosen shapes exists in the server
            var allShapesExist = true;
            selectedShapes.forEach(function(obj){
                if(!shapesC.findWhere({id: obj.shapeId})){
                    allShapesExist = false;
                }                
            });

            if(!allShapesExist){
                return reply(Boom.conflict("Some of the shape files don't exist anymore. Reload the page and choose again."));   
            }



            mapsC.execute({
                query: {
                    command: "select * from maps_update($1);",
                    arguments: [JSON.stringify(request.payload[0])]
                },
                reset: true 
            })

            .then(function(updatedData){

                // id to be used in the next handler
                updatedMapId = updatedData[0].id;

                // now delete from the shapes_maps link table the associated shapes (to this map)
                var toBeDeleted = _.where(shapesMapsC.toJSON(), {mapId: updatedMapId})
                changeCaseKeys(toBeDeleted, "underscored");

                return shapesMapsC.execute({
                    query: {
                        command: "select * from shapes_maps_delete($1);",
                        arguments: [JSON.stringify(toBeDeleted)]
                    },
                    reset: true
                });
            })

            .then(function(){

                // now insert again the associated shapes into the shapes_maps link table
                selectedShapes.forEach(function(obj){
                    obj["mapId"] = updatedMapId;
                });

                changeCaseKeys(selectedShapes, "underscored");

                return shapesMapsC.execute({
                    query: {
                        command: "select * from shapes_maps_create($1);",
                        arguments: [JSON.stringify(selectedShapes)]
                    },
                    reset: true
                });
            })

            .then(function(){

                // read the data that was updated (to obtain the joined data)
                return mapsC.execute({
                    query: {
                        command: "select * from maps_read($1);",
                        arguments: [JSON.stringify( {id: updatedMapId} )]
                    },
                    reset: true
                });

            })

            .then(function(){
                // we couldn't read - something went wrong
                if(mapsC.length===0){
                    return reply(Boom.badImplementation());
                }

                var resp         = mapsC.toJSON();
                var transformMap = transforms.maps.maps;
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
                [pre.db.getMapsById, pre.db.getAllShapes, pre.db.getAllShapesMaps]
            ],

            auth: config.get('hapi.auth'),
            description: 'Put (short description)',
            notes: 'Put (long description)',
            tags: ['api'],
        }
    });


/*
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
*/
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





/*

CURL TESTS

curl  -X GET http://127.0.0.1:3000/api/maps

curl  -X GET http://127.0.0.1:3000/api/maps/1

curl  -X GET http://127.0.0.1:3000/api/maps/1,2



curl -X POST http://127.0.0.1:3000/api/maps  \
    -H "Content-Type: application/json"  \
    -d '{ "code": "fwefwefwefweyyxx", "title": { "pt": "uuu", "en": "ttt"}, "file_id": 48, "category_id": 105 }' 



curl -X PUT http://127.0.0.1:3000/api/maps/1001   \
    -H "Content-Type: application/json"  \
    -d '{"id": 1001, "title": { "pt": "yabcx", "en": "zdefy"}}'



curl-X DELETE http://127.0.0.1:3000/api/maps/1

*/