var fs = require("fs");
var stripJsonComments = require("strip-json-comments");
var changeCase = require("change-case-keys");

module.exports = function(filepath){
	var array;
	try{
		array = JSON.parse( stripJsonComments( fs.readFileSync(filepath, "utf-8") ) );
		changeCase(array, "underscored", 2);
		return JSON.stringify(array);
	} 
	catch(err){
		throw err;
	}
}