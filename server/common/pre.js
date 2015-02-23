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
				console.log("pre: read users");
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

		// returns a collection of users with 1 element; first checks if there is a param "email" and uses it;
		// if not, checks in request.auth.credential.email
		read_user_by_email: {
			method: function(request, reply){
				console.log("pre: read user by email");

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
				console.log("pre: read user by token");

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
				console.log("pre: read texts");
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
				console.log("pre: read files");
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

	},

	transform: {
		texts: {
			method: function(request, reply){

	            var transformMap = transforms.maps.text;
	            var transform    = transforms.transformArray;

				var texts = transform(request.pre.textsC.toJSON(), transformMap);

				reply(_.indexBy(texts, "id"));
			},
			assign: "texts"
		},

		files: {
			method: function(request, reply){

	            var transformMap = transforms.maps.files;
	            var transform    = transforms.transformArray;

				var files = transform(request.pre.filesC.toJSON(), transformMap);

				// add the fullPath property
				_.forEach(files, function(obj){
					obj["fullPath"] = obj["path"] + "/" + obj["name"];
				});

				reply(_.indexBy(files, "id"));
			},
			assign: "files"
		},
	},



	// filter the texts collection to get only those that are image urls
	extractImages: {
		method: function(request, reply){

			var texts = request.pre.textsC.toJSON();

			var images = {};
			images.carousel = {};


			// extract all the texts that are image url

			images.all = _.filter(texts, function(obj){
				return _.contains(obj.tags, "image") || _.contains(obj.tags, "images") || _.contains(obj.tags, "img") || _.contains(obj.tags, "imagem") || _.contains(obj.tags, "imagens");
			});


			// extract the images for each sector

			images.energia = _.filter(images.all, function(obj){
				return obj.tags.join().indexOf("energia") >= 0;
			});

			images.turismo = _.filter(images.all, function(obj){
				return obj.tags.join().indexOf("turismo") >= 0;
			});

			images.biodiversidade = _.filter(images.all, function(obj){
				return obj.tags.join().indexOf("biodiversidade") >= 0;
			});

			images.saude = _.filter(images.all, function(obj){
				return obj.tags.join().indexOf("saude") >= 0 || obj.tags.join().indexOf("saúde") >= 0;
			});

			images.recursosHidricos = _.filter(images.all, function(obj){
				return obj.tags.join().indexOf("hidricos") >= 0 || obj.tags.join().indexOf("hídricos") >= 0;
			});			

			images.agricultura = _.filter(images.all, function(obj){
				return obj.tags.join().indexOf("agricultura") >= 0 || obj.tags.join().indexOf("florestas") >= 0;
			});


			// extract the images for each sector that are to be in the carousel

			images.carousel.energia = _.filter(images.energia, function(obj){
				return _.contains(obj.tags, "carousel");
			});

			images.carousel.turismo = _.filter(images.turismo, function(obj){
				return _.contains(obj.tags, "carousel");
			});

			images.carousel.biodiversidade = _.filter(images.biodiversidade, function(obj){
				return _.contains(obj.tags, "carousel");
			});

			images.carousel.saude = _.filter(images.saude, function(obj){
				return _.contains(obj.tags, "carousel");
			});

			images.carousel.recursosHidricos = _.filter(images.recursosHidricos, function(obj){
				return _.contains(obj.tags, "carousel");
			});

			images.carousel.agricultura = _.filter(images.agricultura, function(obj){
				return _.contains(obj.tags, "carousel");
			});


			reply(images);
		},
		assign: "images"
	},

	abortIfNotAuthenticated: {
		method: function(request, reply){

		    if(config.get('hapi.auth')!==false){
		        if(!request.auth.credentials.id){
		            return reply(Boom.unauthorized("To read/edit/create a resource you must sign in.")).takeover();
		        }
		    }
		    else{
		        request.auth.credentials.id = 1;
		        request.auth.credentials.firstName = "paulo";
		        request.auth.credentials.lastName = "vieira";
		    }

		    return reply();

		}
	},

	// route pre-requisite to be added to all routes that have the lang param validation
	redirectOnInvalidLang: function(request, reply){
debugger;
        // if the lang param is not valid, it has been set to undefined
        if(request.params.lang === undefined){
	        console.log("			redirectOnInvalidLang: lang is invalid, will redirect to 404");
        	return reply.redirect("/" + config.get("allowedLanguages")[0] + "/404").takeover();
        }

        return reply.continue();
    },



	preA: {
		method: function(request, reply){
			console.log("preA");
			var value = "value from preA: @" + Date();

			setTimeout(function(){
				console.log("preA will now reply");
				return reply(value);
			}, 1000);
		},
		assign: "pre_A"
	},

	preB: {
		method: function(request, reply){
			console.log("preB");
			var value = "value from preB: @" + Date();
			setTimeout(function(){
				console.log("preB will now reply");
				return reply(value);
			}, 2000);
		},

		assign: "pre_B"
	},

	preW: function(request, reply){
		console.log("preW");
		var value = "value from preW: @" + Date();
		setTimeout(function(){
			console.log("preW will now reply");
			return reply(value);
		}, 1000);
	},


};

module.exports = preRequisites;



/*

The redirectOnInvalidLang pre-requisite method has been added to all the routes such that the path contains a lang parameter 
(this should happen for all the routes that reply with a view).

The lang param has already been validated. If it is not valid, the validation method change the param 
to undefined. 

If that is the case, we redirect immediately to the general 404 page (using
the default language). 

But the redirection to the 404 page can happen in 2 ways:
	        
EXAMPLE 1: /fr or /fr/fuiwebfw or /zzz/fwiebfwie: the pre-requisite will detect that the language
is not valid (it has been set to undefined) and will immediately redirect (bypassing the handler, 
because of the call to .takeover())

EXAMPLE 2: /pt/fiwebfiwuef: here the language is allowed, so the control is continues to the handler;
It will picked up by the /{lang}/{anyPath*} route. This handler also redirects to the 404 page. 
The difference is that in this case we know the language, so we show the 404 page in the requested language.

*/
