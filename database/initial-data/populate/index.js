// the variable populate_* are promises that will be fulfilled after the data has been saved in the db
require('pretty-error').start();
var populate_users  = require("./2030-users");

populate_users
	.then(function(){
		var populate_groups = require("./2040-groups");
		return populate_groups;
	})
	.then(function(){
		var populate_users_groups = require("./2050-users-groups");
		return populate_users_groups;
	})
	.then(function(){
		var populate_texts = require("./2060-texts");
		return populate_texts;
	})
	.then(function(){
		var populate_texts = require("./2070-files");
		return populate_texts;
	})
    .done(undefined,
        function(err) {
            throw err;
        }
    );


