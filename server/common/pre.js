var Boom = require('boom');
var _ = require('underscore');
//var changeCaseKeys = require('change-case-keys');

var BaseC = require(global.rootPath + "server/models/base-model.js").collection;
var settings = require(global.rootPath + "config/server.js");
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
f		                }
			        );
			},
			assign: "textsC",
	//		failAction: "log"
		},
	},

	transform_texts: {
		method: function(request, reply){

            var transformMap = transforms.maps.text;
            var transform    = transforms.baseTransform;

			var texts = transform(request.pre.textsC.toJSON(), transformMap);
			reply(_.indexBy(texts, "id"));
		},
		assign: "texts"
	},

	// route pre-requisite to be added to all routes that have the lang param validation
	redirectOnInvalidLang: function(request, reply){
debugger;
        // if the lang param is not valid, it has been set to undefined
        if(request.params.lang === undefined){
	        console.log("			redirectOnInvalidLang: lang is invalid, will redirect to 404");
        	return reply.redirect("/" + settings.allowedLanguages[0] + "/404").takeover();
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
