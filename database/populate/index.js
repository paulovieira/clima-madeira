// the variable populate_* are promises that will be fulfilled after the data has been saved in the db
var populate_users  = require("./029-populate-users.js");

populate_users
	.then(function(){
		var populate_groups = require("./039-populate-groups.js");
		return populate_groups;
	})
	.then(function(){
		var populate_users_groups = require("./049-populate-users-groups.js");
		return populate_users_groups;
	})
	.then(function(){
		var populate_texts = require("./059-populate-texts.js");
		return populate_texts;
	})
	.catch(function(err){
		console.log(err);
	});

