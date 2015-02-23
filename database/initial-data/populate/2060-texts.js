var Path = require('path');
var jsonFormat = require('json-format');
var _ = require('underscore');
var changeCase = require("change-case-keys");

var rootPath = Path.normalize(__dirname + "/../../..");

var BaseC = require(rootPath + "/server/models/base-model.js").collection;
var baseC1 = new BaseC(),
    baseC2 = new BaseC();

// populate texts
var textsArray = require(rootPath + "/database/initial-data/texts.js");
var emailsUniq = _.chain(textsArray).pluck("email").uniq().value();
var emailsCriteria = [];

emailsUniq.forEach(function(email) {
    emailsCriteria.push({
        email: email
    });
});

// first we make a query to find the ids of the users with the given email
var promise = baseC1.execute({
        query: {
            command: "select * from users_read($1);",
            arguments: JSON.stringify(emailsCriteria)
        }
    })
    .then(
        function() {
            if (baseC1.length === 0) {
                throw new Error("could not find any row with the given criteria: " + emailsCriteria);
            }
            // now construct the data for the new rows in texts
            textsArray.forEach(function(text) {
                //console.log(baseC1.toJSON())
                //console.log(text.email)
                var model = baseC1.findWhere({
                    email: text.author_email
                });
                if (model && model.get("id") >= 0) {
                    text.authorId = model.get("id");
                }
                else {
                    throw new Error("email not found");
                }
            });

            changeCase(textsArray, "underscored");
            var promise2 = baseC2.execute({
                query: {
                    command: "select * from texts_create($1);",
                    arguments: JSON.stringify(textsArray)
                },
                changeCase: false
            });

            return promise2;
        },
        function(err) {
            console.log(err);

            throw err;
        }
    )
    .then(
        function(resp) {
            console.log("texts table has been populated.");
            console.log(jsonFormat(baseC2.toJSON()));
            return resp;
        },
        function(err) {
            console.log(err);
            throw err;
        }
    )
    .finally(
        function() {
            baseC1.disconnect();
            baseC2.disconnect();
        }
    );

module.exports = promise;
