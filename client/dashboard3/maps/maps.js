var shapesChannel = Backbone.Radio.channel('shapes');

var ShapeNewIV = Mn.ItemView.extend({
	template: "maps/templates/shapes-new.html",

	ui: {
		saveBtn: "button.js-save"
	},

	events: {
		"click @ui.saveBtn": "createResource",
		"click tr.js-shape-row": "shapeRowClicked"
	},

	shapeRowClicked: function(e){
		var $el = $(e.target);

		// if the click was directly in the radio, return early (there's nothing to do)
		if($el.is("input")){
			return;
		}

		// if the click was in some children of <tr>, we have to select the corresponding radio
		$el.closest("tr").find("input:radio").prop("checked", true);
	},

	createResource: function(){

		var attrs = Backbone.Syphon.serialize(this);

		if(attrs.code===""){
			alert("To load a new shape file you must submit a code for the shape");
			return;
		}			

		if(attrs.fileId===undefined){
			alert("To load a new shape file you must selected a file from the list");
			return;
		}

		this.ui.saveBtn.prop("disabled", true);

		var self = this;
		Q.delay(150)
			.then(function(){
				return self.model.save(attrs, {wait: true});  // returns a promise
			})
			.then(function(){
				alert("O shape foi carregado com sucesso.");

				// the handler for show:all:shapes will trigger a fake click on the correct anchor elem
				shapesChannel.trigger("show:all:shapes");
			})
			.catch(function(err){
				var msg = err.responseJSON ? err.responseJSON.message : 
											( err.message ? err.message : "unknown error" );
				
				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			.finally(function(){
				self.ui.saveBtn.prop("disabled", false);
			})
			.done();

	}
});


var ShapeEditModalIV = Mn.ItemView.extend({
	template: "maps/templates/shapes-edit-modal.html",

	ui: {
		"modalCloseBtn":  "button.js-modal-cancel",
		"modalSaveBtn":   "button.js-modal-save"
	},

	events: {
		"click @ui.modalSaveBtn": "updateResource"
	},

	behaviors: {
		CloseModal: {
			behaviorClass: window.Behaviors.CloseModal,  // will listen for clicks on @ui.modalCloseBtn
		},
	},

	updateResource: function(){

		var data = Backbone.Syphon.serialize(this);

		var attrs = {
			"description": {
				"pt": $.trim(data["edit-desc-pt"]),
				"en": $.trim(data["edit-desc-en"])
			},
		};

		if(attrs.description.pt + attrs.description.pt===""){
			alert("Please fill the missing fields");
			return;
		}

		// NOTE: we should always use model.save(attrs, {wait: true}) instead of 
		// model.set(attrs) + model.save(); this way the model will be updated (in the client) only 
		// after we get a 200 response from the server (meaning the row has actually been updated)

		this.ui.modalSaveBtn.prop("disabled", true);

		var self = this;
		Q.delay(150)
			.then(function(){
				return self.model.save(attrs, {wait: true});  // returns a promise
			})
			.catch(function(err){
				var msg = err.responseJSON ? err.responseJSON.message : 
											( err.message ? err.message : "unknown error" );

				// if the model has been deleted in the server in the meantime we get a 404; 
				// the collection in the client is then outdated so we call destroy to remove 
				// the deleted model from the collection; we also abort the ajax request immediately 
				// because we are not interested in the response
				if(err.responseJSON && err.responseJSON.statusCode === 404){
					self.model.destroy().abort();
				}
				
				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			.finally(function(){
				Dashboard.$modal1.modal("hide");
				self.destroy();
			})
			.done();

	},

});


var ShapeDeleteModalIV = Mn.ItemView.extend({
	template: "maps/templates/shapes-delete-modal.html",

	ui: {
		"modalCloseBtn":  "button.js-modal-cancel",
		"modalDeleteBtn": "button.js-modal-delete",
	},

	behaviors: {
		CloseModal: {
			// will listen for clicks on @ui.modalCloseBtn
			behaviorClass: window.Behaviors.CloseModal,  
		},

		DeleteResourceAndCloseModal: {
			// will listen for clicks on @ui.modalDeleteBtn
			behaviorClass: window.Behaviors.DeleteResourceAndCloseModal,  
		},
	},

});

var ShapeRowLV = Mn.LayoutView.extend({
	template: "maps/templates/shapes-row.html",
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
			viewClass: ShapeEditModalIV  // and will show this view
		},

		ShowDeleteModal: {
			behaviorClass: window.Behaviors.ShowModal,
			uiKey: "deleteModalBtn",
			viewClass: ShapeDeleteModalIV 
		},
	}

});

var ShapesTableCV = Mn.CompositeView.extend({
	template: "maps/templates/shapes-table.html",
	childView: ShapeRowLV,
	childViewContainer: "tbody"
});




var ControlEditModalIV = Mn.ItemView.extend({
	template: "maps/templates/controls-edit-modal.html",

	ui: {
		"modalCloseBtn":  "button.js-modal-cancel",
		"modalSaveBtn":   "button.js-modal-save"
	},

	events: {
		"click @ui.modalSaveBtn": "updateResource"
	},

	behaviors: {
		CloseModal: {
			behaviorClass: window.Behaviors.CloseModal,  // will listen for clicks on @ui.modalCloseBtn
			stackLevel: 2
		},
	},

	updateResource: function(){
		var tempObj = Backbone.Syphon.serialize(this);

		var selectedColumns = [];

		// the key of the outermost object is the shapeId
		_.each(tempObj, function(columns, shapeId){

			// the key of the inner object is the column number
			_.each(columns, function(props, columnNumber){

				if(props.isSelected){
					selectedColumns.push({
						shapeId: shapeId,
						columnNumber: columnNumber,
						publicName: props.publicName
					});
				}
			});
		});

		debugger;
	}
});

var ControlRowIV = Mn.ItemView.extend({
	template: "maps/templates/controls-row.html",
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
			viewClass: ControlEditModalIV,  // and will show this view
			stackLevel: 2
		},

		// ShowDeleteModal: {
		// 	behaviorClass: window.Behaviors.ShowModal,
		// 	uiKey: "deleteModalBtn",
		// 	viewClass: ShapeDeleteModalIV 
		// },
	}

});

var ControlsTableCV = Mn.CompositeView.extend({
	template: "maps/templates/controls-table.html",
	childView: ControlRowIV,
	childViewContainer: "tbody"
});


var MapEditModalIV = Mn.LayoutView.extend({
	template: "maps/templates/maps-edit-modal.html",

	regions: {
		controlsRegion: "#controls-region"
	},

	ui: {
		"modalCloseBtn":  "button.js-modal-cancel",
		"modalSaveBtn":   "button.js-modal-save"
	},

	events: {
		"click @ui.modalSaveBtn": "updateResource",
		"click tr.js-shape-row": "shapeRowClicked"
	},

	shapeRowClicked: function(e){
		var $el = $(e.target);

		// if the click was directly in the checkbox, return early (there's nothing to do)
		if($el.is("input")){
			return;
		}

		// if the click was in some children of <tr>, we have to select the corresponding checkbox
		var $checkbox = $el.closest("tr").find("input:checkbox"),
			isChecked = $checkbox.prop("checked");

		// finally, toggle the checkbox
		$checkbox.prop("checked", !isChecked);
	},

	behaviors: {
		CloseModal: {
			behaviorClass: window.Behaviors.CloseModal,  // will listen for clicks on @ui.modalCloseBtn
		},
	},

	onBeforeShow: function(){
		var shapesData = this.model.get("shapesData"),
			controlsArray = this.model.get("controls"),
			controlsC = new Backbone.Collection(controlsArray);

		var availableShapes = _.filter(shapesC.toJSON(), function(shapeObj){
			return _.findWhere(shapesData, {id: shapeObj.id});
		});

		var i=0;
		controlsC.each(function(controlM){
			controlM.set("id", ++i);
			controlM.set("availableShapes", availableShapes);
//			debugger;
		});

		var controlsTableCV = new ControlsTableCV({
			collection: controlsC
		})

		this.controlsRegion.show(controlsTableCV);
	},

	updateResource: function(){

		var attrs = Backbone.Syphon.serialize(this);

		if(attrs.code===""){
			alert("To create a new map you must submit a code for the map");
			return;
		}			

		// the selected shapes are in the form: {"1": true, "3": false, "8": true}; we want an array of objects like
		// this: [{shapeId: 1}, {shapeId: 8}]
		var temp = [];
		_.forEach(attrs.selectedShapes, function(value, key){
			if(value === true){
				temp.push({"shapeId": key})
			}
		})
		attrs.selectedShapes = temp;

		this.ui.modalSaveBtn.prop("disabled", true);

		var self = this;
		Q.delay(150)
			.then(function(){
				return self.model.save(attrs, {wait: true});  // returns a promise
			})
			.catch(function(err){
				var msg = err.responseJSON ? err.responseJSON.message : 
											( err.message ? err.message : "unknown error" );

				// if the model has been deleted in the server in the meantime we get a 404; 
				// the collection in the client is then outdated so we call destroy to remove 
				// the deleted model from the collection; we also abort the ajax request immediately 
				// because we are not interested in the response
				if(err.responseJSON && err.responseJSON.statusCode === 404){
					self.model.destroy().abort();
				}
				
				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			.finally(function(){
				Dashboard.$modal1.modal("hide");
				self.destroy();
			})
			.done();
//TODO: after we update the associated shape, it doesn't show immediately
	},

});



var MapNewLV = Mn.LayoutView.extend({
	template: "maps/templates/maps-new.html",

	ui: {
		saveBtn: "button.js-save"
	},

	events: {
		"click @ui.saveBtn": "createResource",
		"click tr.js-shape-row": "shapeRowClicked"
	},

	shapeRowClicked: function(e){
		var $el = $(e.target);

		// if the click was directly in the checkbox, return early (there's nothing to do)
		if($el.is("input")){
			return;
		}

		// if the click was in some children of <tr>, we have to select the corresponding checkbox
		var $checkbox = $el.closest("tr").find("input:checkbox"),
			isChecked = $checkbox.prop("checked");

		// finally, toggle the checkbox
		$checkbox.prop("checked", !isChecked);
	},

	createResource: function(){

		var attrs = Backbone.Syphon.serialize(this);

		if(attrs.code===""){
			alert("To create a new map you must submit a code for the map");
			return;
		}			

		// the selected shapes are in the form: {"1": true, "3": false, "8": true}; we want an array of objects like
		// this: [{shapeId: 1}, {shapeId: 8}]
		var temp = [];
		_.forEach(attrs.selectedShapes, function(value, key){
			if(value === true){
				temp.push({"shapeId": key})
			}
		})
		attrs.selectedShapes = temp;


		this.ui.saveBtn.prop("disabled", true);

		var self = this;
		Q.delay(150)
			.then(function(){
				return self.model.save(attrs, {wait: true});  // returns a promise
			})
			.then(function(){
				alert("O mapa foi criado com sucesso.");

				// the handler for show:all:shapes will trigger a fake click on the correct anchor elem
				shapesChannel.trigger("show:all:maps");
			})
			.catch(function(err){
				var msg = err.responseJSON ? err.responseJSON.message : 
											( err.message ? err.message : "unknown error" );
				
				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			.finally(function(){
				self.ui.saveBtn.prop("disabled", false);
			})
			.done();

	}
});


var MapRowLV = Mn.LayoutView.extend({
	template: "maps/templates/maps-row.html",
	tagName: "tr",
	ui: {
		"editModalBtn": "button.js-edit",
		"deleteModalBtn": "button.js-delete"
	},

	modelEvents: {
		"change": "render"
	},

	events: {
		"click @ui.editModalBtn": "showEditModal"
	},

	showEditModal: function(){

        var mapEditModalIV = new MapEditModalIV({
            model: this.model
        });


        var self = this;
		Q.all([shapesC.fetch(), textsC.fetch()])
			.then(function(){ 

				// add the map categories to the current map models (to be available in the template)
				var mapCategories = _.filter(textsC.toJSON(), function(obj){
					return _.contains(obj.tags, "map_category");
				});

				self.model.set("mapCategories", mapCategories);

				// do the same with with the shapes collection; however we also want to 
				// add a "isSelected" property, indicating if the shape has been
				// selected or not (for the current model)

				// get the shape data (seleted shapes for the current model)
				var shapesData = self.model.get("shapesData");

				// get a new copy of all the shapes
				var availableShapes = shapesC.toJSON();

				_.each(availableShapes, function(shapeObj){
					shapeObj.isSelected = _.findWhere(shapesData, {id: shapeObj.id}) ? true : false;
				});

				self.model.set("availableShapes", availableShapes);

		        // first set the content of the modal
		        Dashboard.modal1Region.show(mapEditModalIV);

		        // then show the modal 
		        Dashboard.$modal1.modal("show");
			})
			.catch(function(err){
				var msg = err.responseJSON ? err.responseJSON.message : 
											( err.message ? err.message : "unknown error" );

				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			.done();
	},

	behaviors: {

		// ShowEditModal: {
		// 	behaviorClass: window.Behaviors.ShowModal,
		// 	uiKey: "editModalBtn",  // will listen for clicks on @ui.editModalBtn
		// 	viewClass: MapEditModalIV,  // and will show this view
		// },

		// ShowDeleteModal: {
		// 	behaviorClass: window.Behaviors.ShowModal,
		// 	uiKey: "deleteModalBtn",
		// 	viewClass: FileDeleteModalIV 
		// },
	}

});

var MapsTableCV = Mn.CompositeView.extend({
	template: "maps/templates/maps-table.html",
	childView: MapRowLV,
	childViewContainer: "tbody"
});


var MapsTabLV = Mn.LayoutView.extend({

	initialize: function(){
		shapesChannel.on("show:all:shapes", function(){
			this.$("a[data-tab-separator='shapes-all']").trigger("click");
		}, this);
	},

	template: "maps/templates/maps-tab.html",

	regions: {
		tabContentRegion: "#maps-region"
	},

	events: {
		"click a.js-dashboard-sep": "updateView"
	},

	// the initial view will be the list of all files
	onBeforeShow: function(){
		this.showAllShapes();
	},

	updateView: function(e){

		e.preventDefault();

		var $target = $(e.target);
		$target.parent().siblings().removeClass("active");
		$target.parent().addClass("active");

		switch($target.data("tab-separator")){
			case "shapes-all":
				this.showAllShapes();
				break;
			case "shapes-new":
				this.showNewShape();
				break;
			case "maps-all":
				this.showAllMaps();
				break;
			case "maps-new":
				this.showNewMap();
				break;
			default:
				throw new Error("unknown tab separator");
		}
	},

	showNewShape: function(){
		var shapeM = new ShapeM();
		var shapeNewIV = new ShapeNewIV({
			model: shapeM
		});

		var self = this;

		// filesC will be filtered
		Q(filesC.fetch())
			.then(function(){ 

				var zipFilesWithShapes = _.filter(filesC.toJSON(), function(obj){
					return _.contains(obj.tags, "map") || 
							_.contains(obj.tags, "maps") ||
							_.contains(obj.tags, "mapa") ||
							_.contains(obj.tags, "mapas") ||
							_.contains(obj.tags, "shape") ||
							_.contains(obj.tags, "shapes");
				});
				shapeM.set("zipFilesWithShapes", zipFilesWithShapes)

				self.tabContentRegion.show(shapeNewIV); 
			})
			.catch(function(err){
				var msg = err.responseJSON ? err.responseJSON.message : 
											( err.message ? err.message : "unknown error" );

				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			.done();


	},

	showAllShapes: function(){

		var shapesTableCV = new ShapesTableCV({
			collection: shapesC
		});

		var self = this;

		Q(shapesC.fetch())
			.then(function(){ 
				self.tabContentRegion.show(shapesTableCV); 
			})
			.catch(function(err){
				var msg = err.responseJSON ? err.responseJSON.message : 
											( err.message ? err.message : "unknown error" );

				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			.done();
	},

	showNewMap: function(){
		var mapM = new MapM();
		var mapNewLV = new MapNewLV({
			model: mapM
		});

		var self = this;

		// textsC will be used to obtain the map categories (which will be shown in the template)
		Q.all([textsC.fetch(), shapesC.fetch()])
			.then(function(){ 

				// add the map categories to the model (to be available in the template)
				var mapCategories = _.filter(textsC.toJSON(), function(obj){
					return _.contains(obj.tags, "map_category");
				})
				mapM.set("mapCategories", mapCategories);

				// do the same with the the shapes collection
				mapM.set("availableShapes", shapesC.toJSON());

				self.tabContentRegion.show(mapNewLV); 
			})
			.catch(function(err){
				var msg = err.responseJSON ? err.responseJSON.message : 
											( err.message ? err.message : "unknown error" );

				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			.done();
	},

	showAllMaps: function(){

		var mapsTableCV = new MapsTableCV({
			collection: mapsC
		});

		var self = this;

		Q(mapsC.fetch())
			.then(function(){ 

				self.tabContentRegion.show(mapsTableCV); 
			})
			.catch(function(err){
				var msg = err.responseJSON ? err.responseJSON.message : 
											( err.message ? err.message : "unknown error" );

				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			.done();
	},


});
