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

		var mapM = new MapM({
			title: {
				pt: data["js-title-pt"],
				en: data["js-title-en"],
			},
			code: data["js-code"],
			fileId: this.model.get("id"),  // the model for this view is a fileM
			categoryId: parseInt(data["js-category-id"], 10)
		});

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

	// initialize: function(){
	// 	console.log("initialize")
	// 	var self = this;

	// 	setInterval(function(){
	// 		if(self.model.get("id")===2){
	// 			console.log("will render @ " + Date.now())
	// 			self.render();
	// 		}
	// 	}, 2000);
		
	// },

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
//		"click @ui.modalSaveBtn": "updateFile"
	},

	behaviors: {
		CloseModal: {
			behaviorClass: window.Behaviors.CloseModal,  // will listen for clicks on @ui.modalCloseBtn
		},
	},

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
});

