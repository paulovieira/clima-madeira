var fs = require("fs");
var Path = require('path');
var stripJsonComments = require("strip-json-comments");
var jsonFormat = require('json-format');
require("console-stamp")(console, "HH:mm:ss.l");
//var _ = require('underscore');
var Bcrypt = require("bcrypt");
var changeCase = require("change-case-keys");

var rootPath = Path.normalize(__dirname + "/../../..");
var dataPath = rootPath + "/database/initial-data/users.json";

var BaseC = require(rootPath + "/server/models/base-model.js").collection;
var baseC = new BaseC();


// populate users
var usersArray = JSON.parse( stripJsonComments( fs.readFileSync(dataPath, "utf-8") ) );

usersArray.forEach(function(obj){
	if(!obj.pwHash){ throw new Error("missing password"); }

	obj.pwHash = Bcrypt.hashSync(obj.pwHash, 10);
});


changeCase(usersArray, "underscored");
var dbData = JSON.stringify(usersArray);

console.log("db data: ", JSON.stringify(baseC.toJSON()));

var promise =
	baseC.execute({
		query: {
	        command: "select * from users_create($1);",
		  	arguments: dbData
		},
		changeCase: false
	})
	.then(
		function(resp){
			console.log("Users table has been populated.");
			console.log(jsonFormat(baseC.toJSON())); 
			return resp;
		},
	    function(err){  console.log(err);  throw err;}
	)
	.finally(function(){ baseC.disconnect(); });



module.exports = promise;
















