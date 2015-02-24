var fs = require("fs");
var Path = require('path');
var stripJsonComments = require("strip-json-comments");
var jsonFormat = require('json-format');
var changeCase = require("change-case-keys");

var rootPath = Path.normalize(__dirname + "/../../..");
var dataPath = rootPath + "/database/initial-data/files.json";

var BaseC = require(rootPath +  "/server/models/base-model.js").collection;
var baseC = new BaseC();


// populate files
var filesArray = JSON.parse( stripJsonComments( fs.readFileSync(dataPath, "utf-8") ) );

changeCase(filesArray, "underscored");
var dbData = JSON.stringify(filesArray);

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