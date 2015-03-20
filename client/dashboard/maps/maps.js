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
		console.log("map will be craeted")
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


