var jsonFormat = require('json-format');
require("console-stamp")(console, "HH:mm:ss.l");
//var _ = require('underscore');
var Bcrypt = require("bcrypt");
var changeCase = require("change-case-keys");



var BaseC = require("../../server/models/baseModel.js").collection;
var baseC = new BaseC();


// populate users
var usersArray = require("./seeds/users.js");
usersArray.forEach(function(obj){
	if(!obj.pwHash){ throw new Error("missing password"); }

	obj.pwHash = Bcrypt.hashSync(obj.pwHash, 10);
});


changeCase(usersArray, "underscored");
baseC.reset(usersArray);



var promise =
	baseC.execute({
		query: {
	        command: "select * from users_create($1);",
		  	arguments: JSON.stringify(baseC.toJSON())
		},
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
















