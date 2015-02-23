var Path = require('path');
var jsonFormat = require('json-format');
var changeCase = require("change-case-keys");


var rootPath = Path.normalize(__dirname + "/../../..");

var BaseC = require(rootPath +  "/server/models/base-model.js").collection;
var baseC = new BaseC();
var dbData;


// populate groups
var groupsArray = require(rootPath + "/database/initial-data/files.js");
changeCase(groupsArray, "underscored");
baseC.reset(groupsArray);

dbData = JSON.stringify(baseC.toJSON());

var promise =
    baseC.execute({
        query: {
            command: "select * from files_create($1);",
            arguments: dbData
        },
        changeCase: false
    })
    .then(
        function(resp) {
            console.log("Files table has been populated.");
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