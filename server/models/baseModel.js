var Backbone = require("backbone-pg");

var BaseM = Backbone.Model.extend({

});

var BaseC = Backbone.Collection.extend({
	model: BaseM,
	connection: require("../../database/settings.js").getConnectionString("pg"),
});

module.exports = {
	model: BaseM,
	collection: BaseC
};
