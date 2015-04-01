var Boom = require('boom');
var _ = require('underscore');
var _s = require('underscore.string');
var config = require('config');


var BaseC = require(global.rootPath + "server/models/base-model.js").collection;
//var utils = require(global.rootPath +  "server/common/utils.js");
var transforms = require(global.rootPath +  "server/common/transforms.js");

var preRequisites = {

	db: {
		readAllUsers: {
			method: function(request, reply){
				console.log("pre: db.readAllUsers");
		        var usersC = new BaseC();

		        usersC
		            .execute({
		                query: {
		                    command: "select * from users_read()",
		                },
		            })
		            .then(function() {
	                	return reply(usersC);
	                })
		            .done();

			},
			assign: "usersC"
		},

		readAllUsersGroups: {
			method: function(request, reply){
				console.log("pre: db.readAllUsersGroups");
		        var usersGroupsC = new BaseC();

		        usersGroupsC
		            .execute({
		                query: {
		                    command: "select * from users_groups_read()",
		                },
		            })
		            .then(function() {
	                	return reply(usersGroupsC);
	                })
		            .done();
			},
			assign: "usersGroupsC"
		},

		// returns a collection of users with 1 element; first checks if there is a param "email" and uses it;
		// if not, checks in request.auth.credential.email
		readUserByEmail: {
			method: function(request, reply){
				console.log("pre: db.readUserByEmail");

				var email = request.params.email || request.auth.credentials.email || "";
				console.log("		w: ", request.auth.credentials);
		        var usersC = new BaseC();

		        usersC
		            .execute({
		                query: {
		                    command: "select * from users_read($1)",
		                    arguments: JSON.stringify([{email: email}])
		                },
		            })
		            .then(function() {
	                	return reply(usersC);
	                })
		            .done();
			},
			assign: "usersC"
		},

		readUserByToken: {
			method: function(request, reply){
				console.log("pre: db.readUserByToken");

				var recoverToken = request.query.token || request.params.token || "";
		        var usersC = new BaseC();

		        usersC
		            .execute({
		                query: {
		                    command: "select * from users_read($1)",
		                    arguments: JSON.stringify([{recover: recoverToken}])
		                },
		            })
		            .then(function() {
	                	return reply(usersC);
	                })
		            .done();
			},
			assign: "usersC"
		},

		// old method - to be deleted
		readAllTexts: {
			method: function(request, reply){
				console.log("pre: db.readAllTexts");
		        var textsC = new BaseC();

		        textsC
		            .execute({
		                query: {
		                    command: "select * from texts_read()"
		                },
		            })
		            .then(function() {
	                	return reply(textsC);
	                })
		            .done();
			},
			assign: "textsC",
		},

		getAllUsers: {
			method: function(request, reply){
				console.log("pre: db.getAllUsers");
		        var usersC = new BaseC();

		        usersC
		            .execute({
		                query: {
		                    command: "select * from users_read()"
		                },
		            })
		            .then(function() {
	                	return reply(usersC);
	                })
		            .done();
			},
			assign: "allUsers"
		},

		getUsersById: {
			method: function(request, reply){
				console.log("pre: db.getUsersById");
		        var usersC = new BaseC();

		        usersC
		            .execute({
		                query: {
		                    command: "select * from users_read($1)",
		                    arguments: [JSON.stringify( {id: request.params.ids[0]} )]
		                },
		            })
		            .then(function() {
	                	return reply(usersC);
	                })
		            .done();
			},
			assign: "usersById",
		},

		getAllTexts: {
			method: function(request, reply){
				console.log("pre: db.getAllTexts");
		        var textsC = new BaseC();

		        textsC
		            .execute({
		                query: {
		                    command: "select * from texts_read()"
		                },
		            })
		            .then(function() {
	                	return reply(textsC);
	                })
		            .done();
			},
			assign: "allTexts"
		},

		getTextsById: {
			method: function(request, reply){
				console.log("pre: db.getTextById");
		        var textsC = new BaseC();

		        textsC
		            .execute({
		                query: {
		                    command: "select * from texts_read($1)",
		                    arguments: [JSON.stringify( {id: request.params.ids[0]} )]
		                },
		            })
		            .then(function() {
	                	return reply(textsC);
	                })
		            .done();
			},
			assign: "textsById",
		},

		readAllFiles: {
			method: function(request, reply){
				console.log("pre: db.readAllFiles");
		        var filesC = new BaseC();

		        filesC
		            .execute({
		                query: {
		                    command: "select * from files_read()"
		                }
		            })
		            .then(function() {
	             	   	return reply(filesC);
	                })
	                .done();
			},
			assign: "filesC"
		},

		readAllMaps: {
			method: function(request, reply){
				console.log("pre: db.readAllMaps");
		        var mapsC = new BaseC();

		        mapsC
		            .execute({
		                query: {
		                    command: "select * from maps_read()"
		                }
		            })
		            .then(function() {
	                	return reply(mapsC);
	                })
		            .done();
			},
			assign: "mapsC"
		},


		// read_files: {
		// 	method: function(request, reply){
		// 		console.log("pre: db.read_files");
		//         var filesC = new BaseC();

		//         filesC
		//             .execute({
		//                 query: {
		//                     command: "select * from files_read()"
		//                 },
		//             })
		//             .done(
		//                 function() {
		//                 	return reply(filesC);
		//                 },
		//                 function(err) {
		//                 	console.log(err);
		//                     return reply(err);
		//                 }
		// 	        );
		// 	},
		// 	assign: "filesC",
		// },

		// to delete
		saveUserAgent: {
			method: function(request, reply){
				console.log("user-agent:", request.plugins.scooter.toJSON());
				
				//console.log("common log: ", toCommonLogFormat(request));
			    var userAgentC = new BaseC();

				//console.log("common log: ", request.plugins.scooter.toCommonLogFormat(request));
				return reply();
		    

		        // textsC
		        //     .execute({
		        //         query: {
		        //             command: "select * from texts_read()"
		        //         },
		        //     })
		        //     .done(
		        //         function() {
		        //         	return reply(textsC);
		        //         },
		        //         function(err) {
		        //         	console.log(err);
		        //             return reply(err);
		        //         }
			       //  );
			},
			//assign: "textsC",
		},


	},

	transform: {

		texts: {
			method: function(request, reply){
				console.log("pre: transform.texts");

	            var transformMap = transforms.maps.texts
	            var transform    = transforms.transformArray;

				var textsArray = transform(request.pre.textsC.toJSON(), transformMap);

				// manually copy the properties in the contents to the top level (to make the nunjucks templates easier)
				for(var i=0, l=textsArray.length;  i<l;  i++){
					(textsArray[i]).pt = (textsArray[i]).contents.pt;
					(textsArray[i]).en = (textsArray[i]).contents.en;
				}

				// transform the array into an object, indexed by the id; this will make it easy to access an arbitrary text,
				// and will avoid using sparse arrays
				var textsObj = _.indexBy(textsArray, "id");

				return reply(textsObj);
			},

			assign: "texts"
		},

		textsArray: {
			method: function(request, reply){
				console.log("pre: transform.textsArray");

	            var transformMap = transforms.maps.texts;
	            var transform    = transforms.transformArray;

				var textsArray = transform(request.pre.textsC.toJSON(), transformMap);

				// manually copy the properties in the contents to the top level (to make the nunjucks templates easier)
				for(var i=0, l=textsArray.length;  i<l;  i++){
					(textsArray[i]).pt = (textsArray[i]).contents.pt;
					(textsArray[i]).en = (textsArray[i]).contents.en;
				}

				return reply(textsArray);
			},

			assign: "textsArray"
		},

		files: {
			method: function(request, reply){
				console.log("pre: transform.files");

	            var transformMap = transforms.maps.files;
	            var transform    = transforms.transformArray;

				var files = transform(request.pre.filesC.toJSON(), transformMap);

				// add the fullPath property
				_.forEach(files, function(obj){
					obj["fullPath"] = obj["path"] + "/" + obj["name"];
				});

				var filesObj = _.indexBy(files, "id");

				return reply(filesObj);
			},

			assign: "files"
		},

		filesArray: {
			method: function(request, reply){
				console.log("pre: transform.filesArray");

	            var transformMap = transforms.maps.files;
	            var transform    = transforms.transformArray;

				var filesArray = transform(request.pre.filesC.toJSON(), transformMap);

				_.forEach(filesArray, function(obj){
					obj["fullPath"] = obj["path"] + "/" + obj["name"];
				});

				return reply(filesArray);
			},

			assign: "filesArray"
		},
	},


	payload: {
		// convert the tags comma-separated string to an array of strings
		extractTags: {
			method: function(request, reply){
				console.log("pre: extractTags");
				
				var payloadObj, tagsArray = [];

				if(request.payload){
					if(_.isArray(request.payload)){
						payloadObj = request.payload[0];
					}
					else{
						payloadObj = request.payload;
					}

					if(typeof payloadObj.tags === "string"){
						tagsArray = payloadObj.tags.split(",");
						for(var i=0, l=tagsArray.length; i<l; i++){

							// slugify returns a cleaned version of the string:
							// Replaces whitespaces, accentuated, and special characters with a dash
							tagsArray[i] = _s.slugify(tagsArray[i]);
						}

						// if the original tags string is the empty string, we end up with an array with 1 element 
						// (the empty string); we want the empty array instead
						if(tagsArray.length===1 && tagsArray[0]===""){
							tagsArray = [];
						}

						// update the tags property in request.payload
						payloadObj.tags = tagsArray;
					}
				}

				reply();
			}
		}
	},

	filterImages: {
		method: function(request, reply){
			console.log("pre: filterImages");

			var images = {};
			images["biodiversidade"]        = [];
			images["qualidade-disponibilidade-agua"]     = [];
			images["risco-hidrologico"]     = [];
			images["saude"]                 = [];
			images["turismo"]               = [];
			images["agricultura-florestas"] = [];
			images["energia"]               = [];
			images["adaptacao"]               = [];
			images["clima"]               = [];

			_.each(request.pre.files, function(obj){
				var tags = obj.tags;
				if(_.contains(tags, "image") && _.contains(tags, "carousel")){

					if(_.contains(tags, "biodiversidade")){             images["biodiversidade"].push(obj); }
					else if(_.contains(tags, "qualidade-disponibilidade-agua")){     images["qualidade-disponibilidade-agua"].push(obj); }
					else if(_.contains(tags, "risco-hidrologico")){     images["risco-hidrologico"].push(obj); }
					else if(_.contains(tags, "saude")){                 images["saude"].push(obj); }
					else if(_.contains(tags, "turismo")){               images["turismo"].push(obj); }
					else if(_.contains(tags, "agricultura-florestas")){ images["agricultura-florestas"].push(obj); }
					else if(_.contains(tags, "energia")){               images["energia"].push(obj); }
					else if(_.contains(tags, "clima")){                   images["clima"].push(obj); }
					else if(_.contains(tags, "adaptacao")){               images["adaptacao"].push(obj); }
				}
			});

			return reply(images);
		},

		assign: "images"
	},



	abortIfNotAuthenticated: {
		method: function(request, reply){
			console.log("pre: abortIfNotAuthenticated");

			// with NODE_ENV=dev-no-auth, all routes have "config: false"
		    if(config.get('hapi.auth')!==false){
		        if(!request.auth.credentials.id){
		            return reply(Boom.unauthorized("To access this resource you must be authenticated.")).takeover();
		        }
		    }
		    else{
		    	// simulate the login using the first user
		        request.auth.credentials.id = 1;
		        request.auth.credentials.firstName = "paulo";
		        request.auth.credentials.lastName = "vieira";
		        request.auth.credentials.isAdmin = true;
		    }

		    return reply();
		}
	},

	// route pre-requisite to be added to all routes that have the lang param validation
	redirectOnInvalidLang: function(request, reply){
			console.log("pre: redirectOnInvalidLang");
debugger;
        // if the lang param is not valid, it has been set to undefined
        if(request.params.lang === undefined){
	        console.log("			redirectOnInvalidLang: lang is invalid, will redirect to 404");
        	return reply.redirect("/" + config.get("allowedLanguages")[0] + "/404").takeover();
        }

        return reply.continue();
    },



	// preA: {
	// 	method: function(request, reply){
	// 		console.log("preA");
	// 		var value = "value from preA: @" + Date();

	// 		setTimeout(function(){
	// 			console.log("preA will now reply");
	// 			return reply(value);
	// 		}, 1000);
	// 	},
	// 	assign: "pre_A"
	// },

	// preB: {
	// 	method: function(request, reply){
	// 		console.log("preB");
	// 		var value = "value from preB: @" + Date();
	// 		setTimeout(function(){
	// 			console.log("preB will now reply");
	// 			return reply(value);
	// 		}, 2000);
	// 	},

	// 	assign: "pre_B"
	// },

	// preW: function(request, reply){
	// 	console.log("preW");
	// 	var value = "value from preW: @" + Date();
	// 	setTimeout(function(){
	// 		console.log("preW will now reply");
	// 		return reply(value);
	// 	}, 1000);
	// },


};

module.exports = preRequisites;



/*

The redirectOnInvalidLang pre-requisite method has been added to all the routes such that the path contains a lang parameter 
(this should happen for all the routes that reply with a view).

The lang param has already been validated. If it is not valid, the validation method change the param 
to undefined. If that happens, we redirect immediately to the general 404 page (using
the default language). 

However the redirection to the 404 page can happen in 2 ways:
	        
EXAMPLE 1: /fr or /fr/fuiwebfw or /zzz/fwiebfwie: the pre-requisite will detect that the language
is not valid (it has been set to undefined in the validation) and will immediately redirect (bypassing the handler, 
because of the call to .takeover())

EXAMPLE 2: /pt/fiwebfiwuef: here the language is valid, so the control is given back to the handler;
It will end up in the  handler for the /{lang}/{anyPath*} route. This handler also redirects to the 404 page, because
it detects that "fiwebfiwuef" is not associated with any view (it's a simple custom handler). 

The difference is that in this case we know the language, so we show the 404 page in the requested language.

*/
