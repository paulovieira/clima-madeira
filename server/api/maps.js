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

        	var mapsC = new BaseC();
        	mapsC.execute({
				query: {
                    command: "select * from maps_read()"
				}
        	})
        	.done(
        		function(){
                    var resp         = mapsC.toJSON();
                    var transformMap = transforms.maps.maps;
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

            var queryOptions = [];
            request.params.ids.forEach(function(id){
                queryOptions.push({id: id});
            });

            var mapsC = new BaseC();
            mapsC.execute({
                query: {
                    command: "select * from maps_read($1)",
                    arguments: [ JSON.stringify(queryOptions) ]
                }
            })
            .done(
                function(){
debugger;
                    var resp         = mapsC.toJSON();
                    var transformMap = transforms.maps.maps;
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

    // CREATE (one or more)
    server.route({
        method: 'POST',
        path: internals.resourcePath,
        handler: function (request, reply) {
            console.log(utils.logHandlerInfo(request));
debugger;

//console.log("dbData: ", JSON.stringify(changeCaseKeys(request.payload, "underscored")));
console.log("request.payload: ", JSON.stringify(request.payload));

            var dbData = request.payload[0];


            var mapsC = new BaseC();
            var filesC = new BaseC();

            var zipOutputDir, shpFile, shpTableName;

/*
IMPROVE
1) the initial filesC query could be done in a pre method
2) the name of the database should be based on the map code (use _s in the client)
3) we should always delete the directory before the unzip (if it doesn't exist, it shouldn't throw an error)
*/


            // 1st step: query files table to obtain the filename of the zip directly from the db
            filesC.execute({
                query: {
                    command: "select * from files_read($1);",
                    arguments: [  JSON.stringify({ id: request.payload[0]["file_id"] })  ]
                }
            })

            // 2nd step: extract the zip file into a dedicated folder (which must be created)
            .then(function(val){
                var deferred = Q.defer();

                // we are expecting to have 1 model in the collection (and only 1)
                if(filesC.length !== 1){
                    throw new Error("The shape file does not exist (check the file_id)");
                }

                var physicalPath = filesC.at(0).get("physicalPath"),
                    filename = filesC.at(0).get("name"),
                    filenameWithoutExt = filename.slice(0, filename.length - 4);

                if(!_s.endsWith(filename, ".zip")){
                    throw new Error("The file must be a zip.");
                }

                var zipFullPath = Path.join(global.rootPath, physicalPath, filename);
                zipOutputDir = Path.join(global.rootPath, physicalPath, filenameWithoutExt);

// console.log("filenameWithoutExt: ", filenameWithoutExt);
// console.log("zipFullPath: ", zipFullPath);
// console.log("zipDirectory: ", zipDirectory);

                fs.mkdirSync(zipOutputDir);
                
                fs.createReadStream(zipFullPath)
                    .pipe(unzip.Extract({ path: zipOutputDir }))
                .on("close", function(){
                    deferred.resolve({ success: true })
                })
                .on("error", function(err){
                    //console.error("zip error!");
                    deferred.reject(err);
                    return;
                });

                return deferred.promise;
            })

            .then(function(){

                // get an array with the names of files in zipOutputDir that have the .shp extension
                var files = fs.readdirSync(zipOutputDir).filter(function(filename){
                    return _s.endsWith(filename, ".shp");
                });

// TODO: test if twith 2 .shp files in the zip; show the correct error message in the client
                if(files.length!==1){
                    throw new Error("the zip must contain one .shp file (and only one)");
                }

                shpFile = files[0];
                shpFileWithoutExt = (files[0]).slice(0, shpFile.length - 4).toLowerCase();

                // the name of the table will be based on the name of the .shp file;
                // check how many tables exist that start with that name
                var queryOpt = {"table_name_like": shpFileWithoutExt };
                var promise = mapsC.execute({
                    query: {
                        command: "select * from maps_read($1);",
                        arguments: [JSON.stringify(queryOpt)]
                    }
                });

                return promise
            })

            // 3rd step: execute shp2pgsql; the table name will be based on the name of the zip
            .then(function(){
                var deferred = Q.defer();

                var numberOfTables = mapsC.length;
                if(numberOfTables > 0){
                    shpFileWithoutExt = shpFileWithoutExt + "-" + (numberOfTables + 1);
                }

                console.log("mapsC: ", mapsC.toJSON());

                var dbSchema = "geo";
                shpTableName = dbSchema + "." + _s.underscored(_s.slugify(shpFileWithoutExt));
                
                // the command is:  shp2pgsql -D -I -s 4326 <path-to-shp-file>  <name-of-the-table>   |  psql --dbname=<name-of-the-database>
                var command = 'shp2pgsql -D -I -s 4326 ' 
                            + Path.join(zipOutputDir, shpFile) + ' '
                            + shpTableName
                            + ' |  psql --dbname=' + config.get("db.postgres.database");

                console.log("command: ", command);

                exec(command, function(err, stdout, stderr){
                    if(err){
                        console.log("error in exec: ", err);
                        deferred.reject(err);
                        return;
                    }

                    console.log("stdout: \n", stdout);
                    if(_s.include(stdout.toLowerCase(), "create index") && 
                        _s.include(stdout.toLowerCase(), "commit")){
                        deferred.resolve({ success: true });
                        return;
                    }
                    else{
                        deferred.reject(new Error("shp2pgsql does not seem to have succeeded (please verify)"));
                        return;
                    }

                })

                return deferred.promise;
            })

            // 4rd step: create the row in the maps table
            .then(function(){

                // add the fields that are missing from the payload (server-side information)
                dbData["table_name"] = shpTableName;
                dbData["owner_id"]   = request.auth.credentials.id;

                console.log("dbData: ", dbData);

                var promise = mapsC.execute({
                    query: {
                        command: "select * from maps_create($1);",
                        arguments: [JSON.stringify(changeCaseKeys(dbData, "underscored"))]
                    },
                    reset: true
                });

                return promise;
            })
            .finally(function(){
                var deferred = Q.defer();
                console.log("finally!");

                rimraf(zipOutputDir, function(err){
                    if(err){
                        deferred.reject(err);
                        return 
                    }

                    deferred.resolve();
                });

                return deferred.promise;
            })
            .done(
                function(){
debugger;
                    var resp         = mapsC.toJSON();
                    var transformMap = transforms.maps.maps;
                    var transform    = transforms.transformArray;

                    return reply(transform(resp, transformMap));
                },
                function(err){
debugger;
// TODO: make sure the table geo.<shpTableName> wasn't created; if so we should delete it

                    var boomErr = internals.parseError(err);
                    return reply(boomErr);
                }
            );

        },
        config: {
        	validate: {
                // NOTE: to crate a new file we have to send the file itself in a form (multipart/form-data);
                // but if we do the validation the buffer will somehow be messed up by Joi; so here we don't
                // do the validation

                payload: internals.validatePayloadForCreate
        	},

            pre: [
                pre.abortIfNotAuthenticated
            ],

            auth: config.get('hapi.auth'),

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
            
console.log("dbData: ", request.payload);

            var mapsC = new BaseC();
            var mapsC2 = new BaseC();

            // update the row
        	mapsC.execute({
				query: {
				  	command: "select * from maps_update($1);",
                    arguments: [JSON.stringify(changeCaseKeys(request.payload, "underscored"))]
				}
        	})
            // retrieve the updated row using maps_read (so that we have the joined data too)
            .then(
                function(updatedRow){

                    var promise = mapsC2.execute({
                        query: {
                            command: "select * from maps_read($1);",
                            arguments: [JSON.stringify({id: updatedRow[0].id})]
                        }
                    });

                    return promise;
                }
            )
        	.done(
        		function(row){
debugger;
                    var transformMap = transforms.maps.maps;
                    var transform    = transforms.transformArray;

                    return reply(transform(row, transformMap));
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
                pre.abortIfNotAuthenticated
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