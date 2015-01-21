var _ = require('underscore');
var Hoek = require('hoek');
//var settings = require('../config/settings.js');

module.exports = {


	transform: function(array, transform, options){
	    if(!_.isArray(array)){ array = [array]; }		

	    var i, li;
        for(i=0, li=array.length; i<li; i++){ 
            array[i] = Hoek.transform(array[i], transform, options);
        }

        return array;
	},

	// given an obj or array of objectsm and list of strings (keys), deletes those properties from all objects
	// usage: utils.deleteProps(myObj, "name", "age")
	deleteProps: function(array){
	    var args = Array.prototype.slice.call(arguments);
	    if(!_.isArray(array)){ array = [array]; }

	    var key, i, j, li, lj;

	    for(i=1, li=args.length; i<li; i++){
	        key = args[i];
	        for(j=0, lj=array.length; j<lj; j++){ 

	        	// array[j] is an object
	            delete (array[j])[key];
	        }
	    }

	    return array;
	},

	// given an obj or array of objects, a key (string) and assuming obj.key is an object, flattens the properties 
	// in obj.key; 
	// that is, we will have obj.key.a === obj.a, obj.key.b === obj.b, etc 
	// (if obj.key.a is another object, obj.a will simply be a reference)
	flattenObj: function(array){
	    var args = Array.prototype.slice.call(arguments);
	    if(!_.isArray(array)){ array = [array]; }

	    var key, i, j, li, lj;

		function flattenObj(obj, nestedObj){
	        Object.keys(nestedObj).forEach(function(nestedKey){
	            obj[nestedKey] = nestedObj[nestedKey];
	        });
		}

	    for(i=1, li=args.length; i<li; i++){
	        key = args[i];
	        for(j=0, lj=array.length; j<lj; j++){ 
	        	// array[j] is an object and we assume array[j][key] is also an object
	        	flattenObj(array[j], array[j][key]);
	        }
	    }


/*
        Object.keys(obj[key]).forEach(function(nestedKey){
            obj[nestedKey] = obj[key][nestedKey];
        });
*/
        return array;
	},


	logHandlerInfo: function(routeName, request){
		console.log("handler: ".blue + routeName + 
					"    " + "|".white + "    path: ".blue + request.path +
					"    " + "|".white + "    method: ".blue + request.method);
	},

	// require and call the modules where the registration of the plugins happens
	// (that is, where we have the call to server.register + any specific options)
	registerPlugins: function(server){
		require(global.rootPath + "server/plugins/hapi-auth-cookie.js")(server);
//		require("../plugins/tv.js")(server);
	},

/*

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



	validate: {
		params: {
			
			lang: function(value, options, next){
				value.lang = encodeURIComponent(value.lang || "").toLowerCase();

				// if lang param is allowed, set the global variable in Nunjucks
				// and return it as it came (do nothing)
				if(_.contains(settings.allowedLanguages, value.lang)){
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
*/

};



