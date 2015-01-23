var Backbone = require("backbone-pg");
var BaseM = Backbone.Model.extend({});

var BaseC = Backbone.Collection.extend({
    model: BaseM,
    connection: require(global.rootPath + "config/database.js").getConnectionString("pg"),
});

module.exports = {
    model: BaseM,
    collection: BaseC
};
