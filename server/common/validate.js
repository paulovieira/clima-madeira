var _ = require('underscore');
var Nunjucks = require('hapi-nunjucks');
var config = require("config");

var validate = {
	params: {
		
		lang: function(value, options, next){
			value.lang = encodeURIComponent(value.lang || "").toLowerCase();

			// if lang param is allowed, set the global variable in Nunjucks
			// and return it as it came (do nothing)
			if(_.contains(config.get("allowedLanguages"), value.lang)){
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

	query: {

	}
};

module.exports = validate;

