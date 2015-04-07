var MapM = Backbone.Model.extend({
	urlRoot: "/api/maps",
	defaults: {
	},
	initialize: function(){
	},
	parse: function(resp){
		if(_.isArray(resp)){ resp = resp[0]; }
		resp.createdAt = moment(resp.createdAt).format('YYYY-MM-DD HH:mm:ss');
		return resp;
	}
});

var MapsC = Backbone.Collection.extend({
	model: MapM,
	url: "/api/maps",
});

var mapsC = new MapsC();


var MapNewModalIV = ModalIV.extend({

	template: "maps/templates/map-new-modal.html",

	ui: {
		"createMapBtn": "button.js-modal-create-map"
	},

	events: {
		"click @ui.createMapBtn": "createMap"
	},

	behaviors: {
		CloseModal: {
			behaviorClass: window.Behaviors.CloseModal,  // will listen for clicks on @ui.modalCloseBtn
		},
	},

	createMap: function(){

		var data = Backbone.Syphon.serialize(this);

		// make sure there aren't any existing maps with the given code
		// NOTE: we have called mapsC.fetch() just before showing the composite view with the
		// list of shape files
		if(mapsC.findWhere({code: data["code"]})){
			alert("The given map code is being used in some other map. Please choosen another code.");
			return;
		}

		var attrs = {
			title: {
				pt: data["title-pt"],
				en: data["title-en"],
			},
			code: data["code"],
			fileId: this.model.get("id"),  // NOTE: the model for this modal view is a fileM (not a mapM)
			categoryId: parseInt(data["category-id"], 10),
			properties: {
				order: 1,
				timeData: []
			}
		};

		var mapM = new MapM(attrs);

		var self = this;
		Q.delay(150)
			.then(function(){
				return mapM.save();  // returns a promise
			})
			.then(function(data){
				alert("O mapa foi criado com sucesso.");
				//debugger;
				Dashboard.$modal.modal("hide");
				self.destroy();
			})
			.done(undefined,
				function(err){
					alert("ERRO: o mapa não foi criado.");
					//debugger;
					throw err;
				}
			)

	}

	// updateFile: function(){
	// 	var data = Backbone.Syphon.serialize(this);

	// 	// NOTE: we should always use model.save(attrs, {wait: true}) instead of 
	// 	// model.set(attrs) + model.save(); this way the model will be updated (in the client) only 
	// 	// after we get a 200 response from the server (meaning the row has actually been updated)

	// 	var self = this;
	// 	Q.delay(150)
	// 		.then(function(){
	// 			return self.model.save(data, {wait: true});  // returns a promise
	// 		})
	// 		.then(function(data){
	// 			Dashboard.$modal.modal("hide");
	// 			self.destroy();
	// 		})
	// 		.done(undefined,
	// 			function(err){
	// 				alert("ERROR: data was not updated.");
	// 				throw err;
	// 			}
	// 		)

	// },
});

Cocktail.mixin(MapNewModalIV.prototype, ModalMixins);



var MapsListNewRowLV = Mn.LayoutView.extend({

	template: "maps/templates/maps-list-new-row.html",
	tagName: "tr",
	ui: {
		"newMapModalBtn": "button.js-new-map",
	},

	// modelEvents: {
	// 	"change": "render"
	// },

	behaviors: {

		ShowEditModal: {
			behaviorClass: window.Behaviors.ShowModal,
			uiKey: "newMapModalBtn",  // will listen for clicks on @ui.newMapModalBtn
			viewClass: MapNewModalIV  // and will show this view
		},

		// ShowDeleteModal: {
		// 	behaviorClass: window.Behaviors.ShowModal,
		// 	uiKey: "deleteModalBtn",
		// 	viewClass: FileDeleteModalIV 
		// },
	},
});


var MapsListNewTableCV = Mn.CompositeView.extend({
	template: "maps/templates/maps-list-new-table.html",
	childView: MapsListNewRowLV,
	childViewContainer: "tbody",
});



var MapEditModalIV = ModalIV.extend({
	template: "maps/templates/map-edit-modal.html",

	events: {
		"click @ui.modalSaveBtn": "updateMap"
	},

	behaviors: {
		CloseModal: {
			behaviorClass: window.Behaviors.CloseModal,  // will listen for clicks on @ui.modalCloseBtn
		},
	},

	updateMap: function(){
		var data = Backbone.Syphon.serialize(this);

		var attrs = this.model.toJSON();

		attrs.code = data["code"];
		attrs.title = {
			pt: data["title-pt"],
			en: data["title-en"]
		};
		attrs.categoryId = data["category-id"];
		attrs.properties.order = data["order"];
debugger

		// NOTE: we should always use model.save(attrs, {wait: true}) instead of 
		// model.set(attrs) + model.save(); this way the model will be updated (in the client) only 
		// after we get a 200 response from the server (meaning the row has actually been updated)

		var self = this;
		Q.delay(150)
			.then(function(){
				return self.model.save(attrs, {wait: true});  // returns a promise
			})
			.then(function(data){
				Dashboard.$modal.modal("hide");
				self.destroy();
			})
			.done(undefined,
				function(err){
					alert("ERROR: data was not updated.");
					throw err;
				}
			)

	},
});


var MapsListRowLV = Mn.LayoutView.extend({

	template: "maps/templates/maps-list-row.html",
	tagName: "tr",
	ui: {
		"editModalBtn": "button.js-edit",
		"deleteModalBtn": "button.js-delete"
	},

	modelEvents: {
		"change": "render"
	},

	behaviors: {

		ShowEditModal: {
			behaviorClass: window.Behaviors.ShowModal,
			uiKey: "editModalBtn",  // will listen for clicks on @ui.editModalBtn
			viewClass: MapEditModalIV  // and will show this view
		},

		// ShowDeleteModal: {
		// 	behaviorClass: window.Behaviors.ShowModal,
		// 	uiKey: "deleteModalBtn",
		// 	viewClass: MapDeleteModalIV 
		// },
	},
});

var MapsListTableCV = Mn.CompositeView.extend({
	template: "maps/templates/maps-list-table.html",
	childView: MapsListRowLV,
	childViewContainer: "tbody",
	onBeforeShow: function(){
		console.log("xxx");
	}
});

