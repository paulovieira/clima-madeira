

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
]);

menuLeftC.each(function(model){
	model.set("lang", Clima.lang);
});



var TextM = Backbone.Model.extend({
	defaults: {
		"tags": [],
		"tagsStr": "",
		"contents": {pt: "", en: ""},
		"pt": "",
		"en": "",
		"author": ""
	},

	url: "/api/texts",

	initialize: function(){

		this.on("change:pt", function(model, newValue){
			var contents = this.get("contents");
			contents.pt = newValue;
			this.set("contents", contents);
		});

		this.on("change:en", function(model, newValue){
			var contents = this.get("contents");
			contents.en = newValue;
			this.set("contents", contents);
		});

		this.set("tagsStr", this.get("tags").join(", "));
		this.on("change:tags", function(){
			this.set("tagsStr", this.get("tags").join(", "));
		});
	},

	parse: function(resp){
		if(_.isArray(resp)){ resp = resp[0]; }
//debugger;
		resp.author = (resp.authorData.firstName || "") + " " + (resp.authorData.lastName || "");
		delete resp.authorData;

		resp.lastUpdated = moment(resp.lastUpdated).format('YY-MM-DD HH:mm:ss');
		return resp;
	}
});

var TextsC = Backbone.Collection.extend({
	model: TextM,
	url: "/api/texts",
});

var textsC = new TextsC();

var TextEditModalIV = Mn.ItemView.extend({
	template: "texts/templates/textEditModal.html",

	events: {
		"click button.js-modal-close": "modalClose",
		"click button.js-modal-save": "modalSave"
	},

	modalClose: function(){
		console.log("close modal");
		Dashboard.$modal.modal("hide");
	},

	modalSave: function(){
		console.log("save changes");
	},
});




var TextRowLV = Mn.LayoutView.extend({
	template: "texts/templates/textRow.html",
	tagName: "tr",
	
	bindings: {
		".js-pt": {
			observe: "pt",
			updateModel: "avoidDuplicateSet"
		},

		".js-en": {
			observe: "en",
			updateModel: "avoidDuplicateSet"
		}
	},

	events: {
		"click button.js-edit": "showEditModal",
		"click button.js-delete": "showDeleteConfirmation"
	},

	showEditModal: function(){

			var textEditIV = new TextEditModalIV({
				model: this.model
			});

			// first set the content of the modal
			Dashboard.modalRegion.show(textEditIV);

			// then show the modal 
			Dashboard.$modal.modal("show");

	},

	showDeleteConfirmation: function(){
		console.log("delete confirmation");
	},

	// for some reason stickit is setting the observed attribute 2 times; the value 
	// used in the 2nd time is the same to what was set in the 1st time, so when we call
	// model.hasChanged() we obtain false 

	// if we return false here the model won't be set
	avoidDuplicateSet: function(val, event, options){
		var observedAttr = options.observe;
		if(val === options.view.model.get(observedAttr)){
			return false;
		}

		return true;
	},

	onRender: function(){
		this.stickit();
	}
});

var TextsTableCV = Mn.CompositeView.extend({
	template: "texts/templates/textsTable.html",
	childView: TextRowLV,
	childViewContainer: "tbody",
	events: {
		"click button#update-texts": "updateTexts"
	},
	updateTexts: function(){
		this.collection.save();
	}
});

var NewTextLV = Mn.LayoutView.extend({
	template: "texts/templates/newText.html",
	bindings: {
		"#js-new-pt": {
			observe: "pt"
		},
		"#js-new-en": {
			observe: "en"
		}
	},

	onRender: function(){
		this.stickit();
	},

	events: {
		"click button#create-text": "createText"
	},

	createText: function(){
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



// USERS

var UserM = Backbone.Model.extend({
	defaults: {
/*
		"tags": [],
		"contents": {pt: "", en: ""},
		"pt": "",
		"en": "",
		"author": ""
*/
	},

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

var UserRowLV = Mn.LayoutView.extend({
	template: "users/templates/userRow.html",
	tagName: "tr",
	
	bindings: {
/*
		".js-pt": {
			observe: "pt",
			updateModel: "avoidDuplicateSet"
		},

		".js-en": {
			observe: "en",
			updateModel: "avoidDuplicateSet"
		}
*/
	},

	// for some reason stickit is setting the observed attribute 2 times; the value 
	// used in the 2nd time is the same to what was set in the 1st time, so when we call
	// model.hasChanged() we obtain false 

	// if we return false here the model won't be set
/*
	avoidDuplicateSet: function(val, event, options){
		var observedAttr = options.observe;
		if(val === options.view.model.get(observedAttr)){
			return false;
		}

		return true;
	},
*/
	onRender: function(){
		this.stickit();
	}
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
	bindings: {
/*
		"#js-new-pt": {
			observe: "pt"
		},
		"#js-new-en": {
			observe: "en"
		}
*/
	},

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
/**/




var DefaultLV = Mn.LayoutView.extend({
	template: "default/templates/default.html",
});






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
	initialize: function(){
		leftMenuChannel.on("show:main:right", this.showViewRight, this);
	},
	template: "mainLayout/templates/main-layout.html",
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

		var defaultLV = new DefaultLV();
		//this.mainRightRegion.show(defaultLV);		
	},

	showViewRight: function(code){
		switch(code){
			case "texts-all":
				this.showAllTexts();
				break;
			case "texts-new":
				this.showNewText();
				break;
			case "users-all":
				this.showAllUsers();
				break;
			case "users-new":
				this.showNewUser();
				break;
			default:
				//return DefaultLV;
				break;
		}
	},
				
	showAllTexts: function(){

		var textsTableCV = new TextsTableCV({
			collection: textsC
		});

		var fulfilled = _.bind(
				function(){ 
					//console.log(textsC.toJSON()); 
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

	showNewText: function(){

		var newText = new TextM();
		var newTextLV = new NewTextLV({
			model: newText
		});
		this.mainRightRegion.show(newTextLV); 
	},

	showAllUsers: function(){
debugger;
		var usersTableCV = new UsersTableCV({
			collection: usersC
		});

		var fulfilled = _.bind(
				function(){ 
					//console.log(textsC.toJSON()); 
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
});

var mainLayout = new MainLayout();

Dashboard.mainRegion.show(mainLayout);




