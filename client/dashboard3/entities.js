var menuLeftC = new Backbone.Collection([
{
	itemCode: "profile",
	itemTitle: {pt: "Dados pessoais", en: "Personal data"},
	itemIcon: "glyphicon-user"
},

{
	itemCode: "texts",
	itemTitle: Clima.texts[12].contents,
	itemIcon: "glyphicon-font"
},

{
	itemCode: "users",
	itemTitle: {pt: "Utilizadores", en: "Users"},
	itemIcon: "glyphicon-user"
},


{
	itemCode: "groups",
	itemTitle: {pt: "Grupos", en: "Grups"},
	itemIcon: "glyphicon-user"
},

{
	itemCode: "files",
	itemTitle: {pt: "Ficheiros", en: "Files"},
	itemIcon: "glyphicon-folder-open"
},

{
	itemCode: "maps",
	itemTitle: {pt: "mapas", en: "Maps"},
	itemIcon: "glyphicon-map-marker"	
}

]);

menuLeftC.each(function(model){
	model.set("lang", Clima.lang);
});






var UserM = Backbone.Model.extend({
	urlRoot: "/api/users",
	defaults: {
		"firstName": "",
		"lastName": "",
		"email": "",
		"createdAt": undefined
	},
	initialize: function(){

	},
	parse: function(resp){
		if(_.isArray(resp)){ resp = resp[0]; }

		resp.createdAt = moment(resp.createdAt).format('YYYY-MM-DD HH:mm:ss');

		// for this view we don't need these properties
		delete resp.userGroups;
		delete resp.userTexts;

		return resp;
	},

});





var TextM = Backbone.Model.extend({
	urlRoot: "/api/texts",
	defaults: {
		"tags": [],
		"contents": {pt: "", en: ""},
	},
	initialize: function(){

		// this.on("change:pt", function(model, newValue){
		// 	var contents = this.get("contents");
		// 	contents.pt = newValue;
		// 	this.set("contents", contents);
		// });

		// this.on("change:en", function(model, newValue){
		// 	var contents = this.get("contents");
		// 	contents.en = newValue;
		// 	this.set("contents", contents);
		// });

	},
	parse: function(resp){
		if(_.isArray(resp)){ resp = resp[0]; }
//debugger;

		resp.lastUpdated = moment(resp.lastUpdated).format('YYYY-MM-DD HH:mm:ss');
		return resp;
	}
});

var TextsC = Backbone.Collection.extend({
	model: TextM,
	url: "/api/texts",
});

var textsC = new TextsC();
