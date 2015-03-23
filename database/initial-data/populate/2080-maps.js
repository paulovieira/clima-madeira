var Path = require('path');
var jsonFormat = require('json-format');
var rootPath = Path.normalize(__dirname + "/../../..");
var BaseC = require(rootPath + "/server/models/base-model.js").collection;
var baseC = new BaseC();


// populate maps
var dataPath = rootPath + "/database/initial-data/maps.json";
var dbData = require("./prepare-data.js")(dataPath);

var promise =
    baseC.execute({
        query: {
            command: "select * from maps_create($1);",
            arguments: dbData
        }
    })
    .then(
        function(resp) {
            console.log("Maps table has been populated.");
            console.log(jsonFormat(baseC.toJSON()));
            return resp;
        },
        function(err) {
            throw err;
        }
    )
    .finally(function() {
        baseC.disconnect();
    });

module.exports = promise;
