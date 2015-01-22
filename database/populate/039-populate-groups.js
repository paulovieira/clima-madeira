var Path = require('path');
var jsonFormat = require('json-format');
//var _ = require('underscore');
var changeCase = require("change-case-keys");


global.rootPath = Path.normalize(__dirname + "/../..") + "/";
var BaseC = require("../../server/models/base-model.js").collection;
var baseC = new BaseC();
var dbData;


// populate groups
var groupsArray = require("./seeds/groups.js");
changeCase(groupsArray, "underscored");
baseC.reset(groupsArray);

dbData = JSON.stringify(baseC.toJSON());

var promise =
    baseC.execute({
        query: {
            command: "select * from groups_create($1);",
            arguments: dbData
        }
    })
    .then(
        function(resp) {
            console.log("Users table has been populated.");
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