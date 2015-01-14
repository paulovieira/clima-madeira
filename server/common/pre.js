var Boom = require('boom');
var BaseC = require("../models/baseModel.js").collection;
var settings = require('../config/settings.js');
//var utils = require("./utils.js");

var preRequisites = {

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

	read_texts: {
		method: function(request, reply){
			console.log("pre: read texts");
	        var textsC = new BaseC();

	        textsC
	            .execute({
	                query: {
	                    command: "select * from texts_read()"
	                },
	                //parse: utils.parseTextsArray
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
//		failAction: "log"
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
