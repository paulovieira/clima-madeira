

/*****************/

var leftMenuChannel = Backbone.Radio.channel('leftMenu');

var Dashboard = new Mn.Application();

Dashboard.addRegions({
	mainRegion: "#main-region"
});




var menuLeftC = new Backbone.Collection([

{
	groupCode: "texts",
	groupTitle: Clima.texts[12].contents,
	groupItems: [
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
	groupCode: "users",
	groupTitle: {pt: "Utilizadores", en: "Users"},
	groupItems: [
		{
			itemCode: "users-all",
			itemTitle: { pt: "Todos os utilizadores", en: "All users"},

		},
		{
			itemCode: "groups-new",
			itemTitle: { pt: "Novo utilizador", en: "New user"},

		}
	]	
},


{
	groupCode: "groups",
	groupTitle: {pt: "Grupos", en: "Grups"},
	groupItems: [
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
	groupCode: "files",
	groupTitle: {pt: "Ficheiros", en: "Files"},
	groupItems: [
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




var TextM = Backbone.Model.extend({
	defaults: {
		"pt": "",
		"en": "",
		"contents": {pt: "", en: ""}
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
	},
});

var TextsC = Backbone.Collection.extend({
	model: TextM,
	url: "/api/texts",
});

var textsC = new TextsC();

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




var DefaultLV = Mn.LayoutView.extend({
	template: "default/templates/default.html",
});






// NESTING LEVEL 2

var MenuLeftArrowIV = Mn.ItemView.extend({
	tagName: "span",
	className: "glyphicon glyphicon-chevron-right",
/*
	attributes: {
		"style": "margin-left: 5px;"
	},
*/
	template: false,
});

var MenuLeftItemLV = Mn.LayoutView.extend({
	initialize: function(){
		leftMenuChannel.on("remove:arrow", 
						function(){ 
							// if this view has an arrow (from a previous selection), remove it
							if(this.arrowRegion.hasView()){
								console.log("reset arrow region");
								this.arrowRegion.reset(); 
								this.$el.removeClass("selected-item");								
							}
						}, 
						this);
	},
	template: "menuLeft/templates/menuLeftItem.html",  
	regions: {
		arrowRegion: ".mn-arrow-region"
	},
	events: {
		"click": function(){
			this.$el.addClass("selected-item");

			leftMenuChannel.trigger("remove:arrow");
			this.arrowRegion.show(new MenuLeftArrowIV);

			leftMenuChannel.trigger("show:main:right", this.model.get("itemCode"));
		}
	},
	onBeforeRender: function(){
		this.model.set("lang",   Clima.lang);
	},

});

var MenuLeftItemsCV = Mn.CollectionView.extend({
	tagName: "div",
	className: "list-group panel-collapse collapse in",
	attributes: {
		style: "margin-bottom: 0;"
	},
	childView: MenuLeftItemLV,

});






// NESTING LEVEL 1

var MenuLeftGroupLV = Mn.LayoutView.extend({
	template: "menuLeft/templates/menuLeftGroup.html",
	regions: {
		itemsRegion: ".mn-items-region"
	},

	onBeforeRender: function(){
		this.model.set("lang", Clima.lang);
	},

	//onAttach: function(){
	onRender: function(view, region){

//		debugger;

		// get the collection with the group items and show them using a collection view
		var groupItemsC = new Backbone.Collection(this.model.get("groupItems"));
		
		var menuLeftItemsCV = new MenuLeftItemsCV({
			collection: groupItemsC,
			id: this.model.get("groupCode")
		});

		this.itemsRegion.show(menuLeftItemsCV)
	},

});

var MenuLeftGroupsCV = Mn.CollectionView.extend({
	childView: MenuLeftGroupLV,
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
		var menuLeftGroupsCV = new MenuLeftGroupsCV({
			collection: menuLeftC
		});
		this.mainLeftRegion.show(menuLeftGroupsCV);

		var defaultLV = new DefaultLV();
		this.mainRightRegion.show(defaultLV);		
	},

	showViewRight: function(code){
		switch(code){
			case "texts-all":
				this.showAllTexts();
				break;
			case "texts-new":
				this.showNewText();
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
	}

});

var mainLayout = new MainLayout();

Dashboard.mainRegion.show(mainLayout);





/*
MODEL
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

COLLECTION
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },






// we should call   collection.save(null, {});
    save: function(attrs, options) {
      options = options ? _.clone(options) : {};

      // the object in options.attrs will be the "data" property in the options for the the AJAX call (that is, the payload of the request);
      // we want to send only the objects that are new or that have changed since the last .set
       var filteredModels = this.filter(function(model){ return model.isNew() || model.hasChanged(); });

       options.attrs = options.attrs || {};
       for(var i=0, l=filteredModels.length; i<l; i++){
   			options.attrs.push(filteredModels[i].toJSON())
       }

      if (options.parse === void 0) options.parse = true;
      var success = options.success;

      var collection = this;

      options.success = function(resp) {
        collection.set(resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };

      wrapError(this, options);

      // we want to make a POST, so we use 'create'
      return this.sync('create', this, options);
    },

*/