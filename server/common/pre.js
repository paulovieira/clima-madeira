var Boom = require('boom');
var _ = require('underscore');
var config = require('config');


var BaseC = require(global.rootPath + "server/models/base-model.js").collection;
//var utils = require(global.rootPath +  "server/common/utils.js");
var transforms = require(global.rootPath +  "server/common/transforms.js");

var preRequisites = {

	db: {
		read_users: {
			method: function(request, reply){
				console.log("pre: db.read_users");
		        var usersC = new BaseC();

		        usersC
		            .execute({
		                query: {
		                    command: "select * from users_read()",
		                },
		            })
		            .done(
		                function() {
		                	return reply(usersC);
		                },
		                function(err) {
		                	console.log(err);
		                    return reply(Boom.badImplementation());
		                }
			        );
			},
			assign: "usersC"
		},

		read_users_groups: {
			method: function(request, reply){
				console.log("pre: db.read_users_groups");
		        var usersGroupsC = new BaseC();

		        usersGroupsC
		            .execute({
		                query: {
		                    command: "select * from users_groups_read()",
		                },
		            })
		            .done(
		                function() {
		                	return reply(usersGroupsC);
		                },
		                function(err) {
		                	console.log(err);
		                    return reply(Boom.badImplementation());
		                }
			        );
			},
			assign: "usersGroupsC"
		},

		// returns a collection of users with 1 element; first checks if there is a param "email" and uses it;
		// if not, checks in request.auth.credential.email
		read_user_by_email: {
			method: function(request, reply){
				console.log("pre: db.read_user_by_email");

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
		            .done(
		                function() {
		                	return reply(usersC);
		                },
		                function(err) {
		                	console.log(err);
		                    return reply(Boom.badImplementation());
		                }
			        );
			},
			assign: "usersC"
		},

		read_user_by_token: {
			method: function(request, reply){
				console.log("pre: db.read_user_by_token");

				var recoverToken = request.query.token || request.params.token || "";
		        var usersC = new BaseC();

		        usersC
		            .execute({
		                query: {
		                    command: "select * from users_read($1)",
		                    arguments: JSON.stringify([{recover: recoverToken}])
		                },
		            })
		            .done(
		                function() {
		                	return reply(usersC);
		                },
		                function(err) {
		                	console.log(err);
		                    return reply(Boom.badImplementation());
		                }
			        );
			},
			assign: "usersC"
		},

		read_texts: {
			method: function(request, reply){
				console.log("pre: db.read_texts");
		        var textsC = new BaseC();

		        textsC
		            .execute({
		                query: {
		                    command: "select * from texts_read()"
		                },
		            })
		            .done(
		                function() {
		                	return reply(textsC);
		                },
		                function(err) {
		                	console.log(err);
		                    return reply(err);
		                }
			        );
			},
			assign: "textsC",
		},

		read_files: {
			method: function(request, reply){
				console.log("pre: db.read_files");
		        var filesC = new BaseC();

		        filesC
		            .execute({
		                query: {
		                    command: "select * from files_read()"
		                },
		            })
		            .done(
		                function() {
		                	return reply(filesC);
		                },
		                function(err) {
		                	console.log(err);
		                    return reply(err);
		                }
			        );
			},
			assign: "filesC",
		},

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

	            var transformMap = transforms.maps.text;
	            var transform    = transforms.transformArray;

				var textsArray = transform(request.pre.textsC.toJSON(), transformMap);

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

	            var transformMap = transforms.maps.text;
	            var transform    = transforms.transformArray;

				var textsArray = transform(request.pre.textsC.toJSON(), transformMap);

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

	filterImages: {
		method: function(request, reply){
			console.log("pre: filterImages");

			var images = {};
			images["biodiversidade"]        = [];
			images["recursos-hidricos"]     = [];
			images["saude"]                 = [];
			images["turismo"]               = [];
			images["agricultura-florestas"] = [];
			images["energia"]               = [];

			_.each(request.pre.files, function(obj){
				var tags = obj.tags;
				if(_.contains(tags, "image") && _.contains(tags, "carousel")){

					if(_.contains(tags, "biodiversidade")){             images["biodiversidade"].push(obj); }
					else if(_.contains(tags, "recursos-hidricos")){     images["recursos-hidricos"].push(obj); }
					else if(_.contains(tags, "saude")){                 images["saude"].push(obj); }
					else if(_.contains(tags, "turismo")){               images["turismo"].push(obj); }
					else if(_.contains(tags, "agricultura-florestas")){ images["agricultura-florestas"].push(obj); }
					else if(_.contains(tags, "energia")){               images["energia"].push(obj); }
				}
			});

			return reply(images);
		},

		assign: "images"
	},

	abortIfNotAuthenticated: {
		method: function(request, reply){
			console.log("pre: abortIfNotAuthenticated");

			// with NODE_ENV=debug-no-auth, all routes have "config: false"
		    if(config.get('hapi.auth')!==false){
		        if(!request.auth.credentials.id){
		            return reply(Boom.unauthorized("To access this resource you must be authenticated.")).takeover();
		        }
		    }
		    else{
		    	// use the default user
		        request.auth.credentials.id = 1;
		        request.auth.credentials.firstName = "paulo";
		        request.auth.credentials.lastName = "vieira";
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
