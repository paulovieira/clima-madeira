var Backbone = require("backbone-pg");
var config = require("config");

var BaseM = Backbone.Model.extend({});

var BaseC = Backbone.Collection.extend({
    model: BaseM,
    connection: config.get("db.postgres").getConnectionString()
});

module.exports = {
    model: BaseM,
    collection: BaseC
};
