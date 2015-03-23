







/*****************/

var leftMenuChannel = Backbone.Radio.channel('leftMenu');

var Dashboard = new Mn.Application();
Dashboard.$modal = $("#modal");

Dashboard.addRegions({
	mainRegion: "#main-region",
	modalRegion: "#modal-content-region"
});




var menuLeftC = new Backbone.Collection([
{
	panelCode: "profile",
	panelTitle: {pt: "Home", en: "Home"},
	panelIcon: "glyphicon-home",
	panelItems: [
		{
			itemCode: "profile",
			itemTitle: {pt: "Dados pessoais", en: "Personal data"},

		}
	]	

},

{
	panelCode: "texts",
	panelTitle: Clima.texts[12].contents,
	panelIcon: "glyphicon-font",
	panelItems: [
		{
			itemCode: "texts-all",
			itemTitle: Clima.texts[13].contents,

		},
		{
			itemCode: "texts-new",
			itemTitle: Clima.texts[14].contents,

		}
	]	

},

{
	panelCode: "users",
	panelTitle: {pt: "Utilizadores", en: "Users"},
	panelIcon: "glyphicon-user",
	panelItems: [
		{
			itemCode: "users-all",
			itemTitle: { pt: "Todos os utilizadores", en: "All users"},

		},
		{
			itemCode: "users-new",
			itemTitle: { pt: "Novo utilizador", en: "New user"},

		}
	]	
},


{
	panelCode: "groups",
	panelTitle: {pt: "Grupos", en: "Grups"},
	panelIcon: "glyphicon-user",
	panelItems: [
		{
			itemCode: "groups-all",
			itemTitle: { pt: "Todos os grupos", en: "All groups"},

		},
		{
			itemCode: "groups-new",
			itemTitle: { pt: "Novo grupo", en: "New group"},

		}
	]	
},

{
	panelCode: "files",
	panelTitle: {pt: "Ficheiros", en: "Files"},
	panelIcon: "glyphicon-folder-open",
	panelItems: [
		{
			itemCode: "files-all",
			itemTitle: { pt: "Todos os ficheiros", en: "All files"},

		},
		{
			itemCode: "files-new",
			itemTitle: { pt: "Novo ficheiro", en: "New file"},

		}
	]	
},

{
	panelCode: "maps",
	panelTitle: {pt: "mapas", en: "Maps"},
	panelIcon: "glyphicon-map-marker",
	panelItems: [
		{
			itemCode: "maps-all",
			itemTitle: { pt: "Todos os mapas", en: "All maps"},

		},
		{
			itemCode: "maps-new",
			itemTitle: { pt: "Novo mapa", en: "New map"},

		},
		{
			itemCode: "maps-general-config",
			itemTitle: { pt: "Configuração de mapas", en: "Map configuration"},

		}
	]	
},
]);

menuLeftC.each(function(model){
	model.set("lang", Clima.lang);
});






// USERS
/*
var UserM = Backbone.Model.extend({

	url: "/api/users",

	initialize: function(){

	},


	parse: function(resp){
		if(_.isArray(resp)){ resp = resp[0]; }

		resp.createdAt = moment(resp.createdAt).format('YYYY-MM-DD HH:mm:ss');
		return resp;
	}
});

var UsersC = Backbone.Collection.extend({
	model: UserM,
	url: "/api/users",
});

var usersC = new UsersC();
*/


/*
var UserRowLV = Mn.LayoutView.extend({
	template: "users/templates/userRow.html",
	tagName: "tr",
});

var UsersTableCV = Mn.CompositeView.extend({
	template: "users/templates/usersTable.html",
	childView: UserRowLV,
	childViewContainer: "tbody",
	events: {
		"click button#update-users": "updateUsers"
	},
	updateUsers: function(){
		this.collection.save();
	}
});


var NewUserLV = Mn.LayoutView.extend({
	template: "users/templates/newUser.html",

	onBeforeDestroy: function(){
		debugger;
		this.model.trigger("auto:destroy");
//		delete this.model;
//		this.model
	},

	onRender: function(){
//		this.stickit();
	},

	events: {
		"click button#create-user": "createUser"
	},

	createUser: function(){
		Q(this.model.save()).then(
			function(val){
				debugger;
			},
			function(err){
				debugger;
			}
		);
	}
});
*/








// new version - using nunjucks instead of collectionView
var MenuLeftIV = Mn.ItemView.extend({
	template: "menuLeft/templates/panel.html",

	events: {
		"click .list-group-item": function(e){
			var $target   = $(e.target),
				$anchorEl = $target.is("span") ? $target.parent() : $target;

			$(".arrow-container").removeClass("glyphicon glyphicon-chevron-right");
			$anchorEl.find(".arrow-container").addClass("glyphicon glyphicon-chevron-right");

			leftMenuChannel.trigger("show:main:right", $anchorEl.data("listItem"));
		}
	}
});


// NESTING LEVEL 0

var MainLayout = Mn.LayoutView.extend({
	template: "mainLayout/templates/main-layout.html",
	initialize: function(){
		leftMenuChannel.on("show:main:right", this.showViewRight, this);
	},
	regions: {
		mainLeftRegion: "#main-left-region",
		mainRightRegion: "#main-right-region"
	},
	onBeforeShow: function(view, region){
//debugger;

		// var menuLeftGroupsCV = new MenuLeftGroupsCV({
		// 	collection: menuLeftC
		// });
		//this.mainLeftRegion.show(menuLeftGroupsCV);

		var menuLeftIV = new MenuLeftIV({
			collection: menuLeftC
		});
		this.mainLeftRegion.show(menuLeftIV);

		this.showViewRight("profile");
		setTimeout(function(){
			$(".panel-body").first().find(".arrow-container").addClass("glyphicon glyphicon-chevron-right");
		}, 5);
	},

	showViewRight: function(code){

		switch(code){
			case "profile":
				this.showProfile();
				break;
			case "texts-all":
				this.showAllTexts();
				break;
			case "texts-new":
				this.showTextNew();
				break;
			case "users-all":
				this.showAllUsers();
				break;
			case "users-new":
				this.showNewUser();
				break;
			case "files-all":
				this.showAllFiles();
				break;
			case "files-new":
				this.showNewFile();
				break;
			case "maps-new":
				this.showNewMap();
				break;
			default:
				throw new Error("showViewRight: unknown code");
				break;
		}
	},

	showProfile: function(){
		var userM = new UserM();
		userM.set("id", Clima.userId);

		var profileLV = new ProfileLV({
			model: userM
		});

		var fulfilled = _.bind(
			function(){ 
				this.mainRightRegion.show(profileLV); 
			}, 
			this);

		Q(userM.fetch()).then(
			fulfilled, 
			function(err){
				debugger;
			}
		);
	},


	showAllTexts: function(){

		var textsTableCV = new TextsTableCV({
			collection: textsC
		});

		var fulfilled = _.bind(
			function(){ 
				this.mainRightRegion.show(textsTableCV); 
			}, 
			this);

		Q(textsC.fetch()).then(
			fulfilled, 
			function(err){
				debugger;
			}
		);
	},

	showTextNew: function(){

		var textM = new TextM();
		var textNewLV = new TextNewLV({
			model: textM
		});
		this.mainRightRegion.show(textNewLV); 
	},

	showAllUsers: function(){
		var usersTableCV = new UsersTableCV({
			collection: usersC
		});

		var fulfilled = _.bind(
				function(){ 
					this.mainRightRegion.show(usersTableCV); 
				}, 
			this);

		Q(usersC.fetch()).then(
			fulfilled, 
			function(err){
				debugger;
			}
		);
	},

	showNewUser: function(){
		debugger;

		var userM = new UserM();
		var newUserLV = new NewUserLV({
			model: userM
		});
		this.mainRightRegion.show(newUserLV); 
	},

	showAllFiles: function(){
		var filesTableCV = new FilesTableCV({
			collection: filesC
		});

		var fulfilled = _.bind(
				function(){ 
					this.mainRightRegion.show(filesTableCV); 
				}, 
			this);

		Q(filesC.fetch()).done(
			fulfilled, 
			function(err){
				debugger;
			}
		);
	},

	showNewFile: function(){

		var fileM = new FileM();
		var fileNewLV = new FileNewLV({
			model: fileM
		});
		this.mainRightRegion.show(fileNewLV); 
	},

	showNewMap: function(){
		var mapsListNewTableCV = new MapsListNewTableCV({
			collection: filesC,
			filter: function(child, index, collection) {
				var hasMapTag = _.contains(child.get("tags"), "map") || 
						_.contains(child.get("tags"), "maps") ||
						_.contains(child.get("tags"), "mapa") ||
						_.contains(child.get("tags"), "placeholder") ||
						_.contains(child.get("tags"), "mapas");

				return hasMapTag;
			}

		});

		var fulfilled = _.bind(
				function(values){
					//debugger;
					var mapCategories = textsC.filter(function(model){
						if(_.contains(model.get("tags"), "map_category")){
							return true;
						}
						return false;
					});

					filesC.each(function(model){
						model.set("mapCategories", new Backbone.Collection(mapCategories).toJSON());
					});

					this.mainRightRegion.show(mapsListNewTableCV);
				}, 
			this);

		Q.all([filesC.fetch(), textsC.fetch()])
			.then(fulfilled)
			.done(undefined, 
				function(err){
					alert("ERROR: could not retrieve data from the server.")
					throw err;
				}
			);

	},
});

var mainLayout = new MainLayout();

Dashboard.mainRegion.show(mainLayout);


