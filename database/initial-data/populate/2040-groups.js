var Path = require('path');
var jsonFormat = require('json-format');
require("console-stamp")(console, "HH:mm:ss.l");
//var _ = require('underscore');
var changeCase = require("change-case-keys");


var rootPath = Path.normalize(__dirname + "/../../..");

var BaseC = require(rootPath + "/server/models/base-model.js").collection;
var baseC = new BaseC();
var dbData;


// populate groups
var groupsArray = require(rootPath + "/database/initial-data/groups.js");
changeCase(groupsArray, "underscored");
baseC.reset(groupsArray);

dbData = JSON.stringify(baseC.toJSON());

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