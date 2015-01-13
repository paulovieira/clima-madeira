// the variable populate_* are promises that will be fulfilled after the data has been saved in the db
var populate_users  = require("./020Z_populate_users.js");

populate_users
	.then(function(){
		var populate_groups = require("./030Z_populate_groups.js");
		return populate_groups;
	})
	.then(function(){
		var populate_users_groups = require("./040Z_populate_users_groups.js");
		return populate_users_groups;
	})
	.then(function(){
		var populate_texts = require("./050Z_populate_texts.js");
		return populate_texts;
	})
	.catch(function(err){
		console.log(err);
	});

