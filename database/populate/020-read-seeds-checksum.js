var Path = require('path');
var jsonFormat = require('json-format');
require("console-stamp")(console, "HH:mm:ss.l");
//var _ = require('underscore');
var Bcrypt = require("bcrypt");
var changeCase = require("change-case-keys");


global.rootPath = Path.normalize(__dirname + "/../..") + "/";
var BaseC = require("../../server/models/base-model.js").collection;
var baseC = new BaseC();



var promise =
	baseC.execute({
		query: {
	        command: "select * from seeds_checksum",
		  	//arguments: JSON.stringify(baseC.toJSON())
		},
	})
	.then(
		function(resp){
			// console.log("seeds_checksums");
			// console.log(jsonFormat(baseC.toJSON())); 
			return resp;
		},
	    function(err){  console.log(err);  throw err;}
	)
	.finally(function(){ baseC.disconnect(); });



module.exports = promise;
















