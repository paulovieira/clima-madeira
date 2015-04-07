var shapesChannel = Backbone.Radio.channel('shapes');

var ZippedShapeRowLV = Mn.LayoutView.extend({

	template: "maps/templates/zipped-shapes-row.html",
	tagName: "tr",

	triggers: {
		"click": "rowClicked"
	},

	onRowClicked: function(x,y,z){
		this.$("input").prop("checked", true);
	}
});


var ZippedShapesTableCV = Mn.CompositeView.extend({
	template: "maps/templates/zipped-shapes-table.html",
	childView: ZippedShapeRowLV,
	childViewContainer: "tbody",

	filter: function(child, index, collection) {
		return _.contains(child.get("tags"), "map") || 
				_.contains(child.get("tags"), "maps") ||
				_.contains(child.get("tags"), "mapa") ||
				_.contains(child.get("tags"), "mapas") ||
				_.contains(child.get("tags"), "shape") ||
				_.contains(child.get("tags"), "shapes");
	}
});


var ShapeNewLV = Mn.LayoutView.extend({
	template: "maps/templates/shapes-new.html",

	ui: {
		saveBtn: "button.js-save"
	},

	events: {
		"click @ui.saveBtn": "createResource"
	},

	regions: {
		zippedShapesRegion: "#zipped-shapes-region"
	},

	onBeforeShow: function(){

		// NOTE: filesC has been fetched just before this view has been instantiated
		var zippedShapesTableCV = new ZippedShapesTableCV({
			collection: filesC
		});

		this.zippedShapesRegion.show(zippedShapesTableCV);
	},

	createResource: function(){

		var data = Backbone.Syphon.serialize(this);

		//var checkedFile = this.$("input:checked").parent().find(".js-file-id");
		var $checkedRow = this.$("tr").filter(function(){
			return $(this).find("input:checked").length > 0;
		});

		var attrs = {
			"code": $.trim(data["new-shape-code"]),
			"srid": $.trim(data["new-shape-srid"]),
			"description": {
				"pt": $.trim(data["new-shape-desc-pt"]),
				"en": $.trim(data["new-shape-desc-en"])
			},
			"fileId": $checkedRow.find("td.js-file-id").html()
		};

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

	behaviors: {

		// ShowEditModal: {
		// 	behaviorClass: window.Behaviors.ShowModal,
		// 	uiKey: "editModalBtn",  // will listen for clicks on @ui.editModalBtn
		// 	viewClass: FileEditModalIV  // and will show this view
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
//				this.showAllMaps();
				break;
			case "maps-new":
//				this.showNewMap();
				break;
			default:
				throw new Error("unknown tab separator");
		}
	},

	showNewShape: function(){
		var shapeM = new ShapeM();
		var shapeNewLV = new ShapeNewLV({
			model: shapeM
		});

		var self = this;

		// filesC will be used in a region in shapeNewLV
		Q(filesC.fetch())
			.then(function(){ 
				self.tabContentRegion.show(shapeNewLV); 
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

		// var x = [];
		// for(var i=0; i<70000000; i++){
		// 	x.push(i)
		// }
		// console.log(x[70000000-1]);

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


});
