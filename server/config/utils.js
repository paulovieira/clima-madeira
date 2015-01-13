var config = require('./settings.js');
var _ = require('underscore');
var Nunjucks = require('hapi-nunjucks');

module.exports = {

	deleteProps: function(array){
	    var args = Array.prototype.slice.call(arguments);
	    if(!_.isArray(array)){ array = [array]; }

	    var key, i, j, li, lj;

	    for(i=1, li=args.length; i<li; i++){
	        key = args[i];
	        for(j=0, lj=array.length; j<lj; j++){ 
	            delete (array[j])[key];
	        }
	    }
	},

	parseTextsArray: function(resp){
		// 1. flatten each row: for each object we want to place the properties in the "contents" object
		// directly to the main object (that is, instead of "obj.contents.pt" we want "obj.pt")
		resp.forEach(function(obj){
			Object.keys(obj.contents).forEach(function(key){
				obj[key] = obj.contents[key];
			});

			obj.contents = null;
		});

		// 2. transform the array of object into an object (where the keys are given by the id value)
		return _.indexBy(resp, "id");
	},




	logHandlerInfo: function(routeName, request){
		console.log("handler: ".blue + routeName + 
					"    " + "|".white + "    path: ".blue + request.path +
					"    " + "|".white + "    method: ".blue + request.method);
	},

	// require and call the modules where the registration of the plugins happens
	// (that is, where we have the call to server.register + any specific options)
	registerPlugins: function(server){
		require("../plugins/hapiAuthCookie.js")(server);
//		require("../plugins/tv.js")(server);
	},

	validate: {
		params: {
			
			lang: function(value, options, next){
				value.lang = encodeURIComponent(value.lang || "").toLowerCase();

				// if lang param is allowed, set the global variable in Nunjucks
				// and return it as it came (do nothing)
				if(_.contains(config.allowedLanguages, value.lang)){
					Nunjucks.addGlobal("lang", value.lang);
				}
				else {
					// otherwise change the param to undefined; this will make
					// the pre-requisite method redirect to the general 404 page 
					value.lang = undefined;
				}

				return next(undefined, value);	
			},		
		},
	},

	preRequisites: {

		// route pre-requisite to be added to all routes that have the lang param validation
		redirectOnInvalidLang: function(request, reply){
debugger;
	        // if the lang param is not valid, it has been set to undefined
	        if(request.params.lang === undefined){
    	        console.log("			redirectOnInvalidLang: lang is invalid, will redirect to 404");
	        	return reply.redirect("/" + config.allowedLanguages[0] + "/404").takeover();
	        }

	        return reply.continue();
	    },
	}



/*///
	// route pre-requisite to be added to all routes that have the lang param validation
	redirectOnInvalidLang: {

        method: function(request, reply){
debugger;
            // if the lang param is not valid, it has been set to undefined
            if(request.params.lang === undefined){
            	return reply.redirect("/" + config.allowedLanguages[0] + "/404").takeover();
            }

            return reply.continue()
        },
//		assign: "lang"
    }
*/






};



/*

This pre-requisite method has been added to all the routes such that the path contains a lang parameter 
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
