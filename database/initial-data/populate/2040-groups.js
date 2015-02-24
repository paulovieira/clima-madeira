var fs = require("fs");
var Path = require('path');
var stripJsonComments = require("strip-json-comments");
var jsonFormat = require('json-format');
require("console-stamp")(console, "HH:mm:ss.l");
//var _ = require('underscore');
var changeCase = require("change-case-keys");


var rootPath = Path.normalize(__dirname + "/../../..");
var dataPath = rootPath + "/database/initial-data/groups.json";

var BaseC = require(rootPath + "/server/models/base-model.js").collection;
var baseC = new BaseC();


// populate groups
var groupsArray = JSON.parse( stripJsonComments( fs.readFileSync(dataPath, "utf-8") ) );

changeCase(groupsArray, "underscored");
var dbData = JSON.stringify(groupsArray);

var promise =
    baseC.execute({
        query: {
            command: "select * from groups_create($1);",
            arguments: dbData
        },
        changeCase: false
    })
    .then(
        function(resp) {
            console.log("groups table has been populated.");
            console.log(jsonFormat(baseC.toJSON()));
            return resp;
        },
        function(err) {
            console.log(err);
            throw err;
        }
    )
    .finally(function() {
        baseC.disconnect();
    });

module.exports = promise;