
var FileEditModalIV = Mn.ItemView.extend({
	template: "files/templates/files-edit-modal.html",

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
			"tags":  $.trim(data["edit-files-tags"])
		};

		// all the fields must be filled (otherwise the validation in the server will reject)
		// if(attrs.name===""){
		// 	alert("Please fill the name field");
		// 	return;
		// }

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


var FileDeleteModalIV = Mn.ItemView.extend({
	template: "files/templates/files-delete-modal.html",

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

var FileRowLV = Mn.LayoutView.extend({
	template: "files/templates/files-row.html",
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
			viewClass: FileEditModalIV  // and will show this view
		},

		ShowDeleteModal: {
			behaviorClass: window.Behaviors.ShowModal,
			uiKey: "deleteModalBtn",
			viewClass: FileDeleteModalIV 
		},
	},

});

var FilesTableCV = Mn.CompositeView.extend({
	template: "files/templates/files-table.html",
	childView: FileRowLV,
	childViewContainer: "tbody",
});


var FileNewShapeFieldsIV = Mn.ItemView.extend({
	template: "files/templates/files-new-shape-fields.html",
})

var FileNewLV = Mn.LayoutView.extend({
	template: "files/templates/files-new.html",

	ui: {
		isShapeSelect: "select#js-is-shape"
	},

	events: {
		"change @ui.isShapeSelect": "isShapeChanged"
	},

	regions: {
		shapeFieldsRegion: "#shape-fields-region"
	},

	isShapeChanged: function(e){
		var isSelected = ($(e.target).val() === "true");

		var fileNewShapeFieldsIV;
		if(isSelected){

			// this subview will share the same model (to access the filename, assuming
			// the file has already been selected)
			fileNewShapeFieldsIV = new FileNewShapeFieldsIV({
				model: this.model
			});
			this.shapeFieldsRegion.show(fileNewShapeFieldsIV)	
		}
		else{
			this.shapeFieldsRegion.empty()	
		}
		
	},

	onAttach: function(){

		$("#new_file").fileinput({
		    uploadUrl: '/api/files',
		    maxFileSize: 1000*200,  // in Kb
		    showUpload: true,
		    initialCaption: "Click the browse button on the right to choose a file",
		    showRemove: false,
		    //overwriteInitial: false,
		    //showCaption: false

		    // use underscore.string to generate the slugged name (the native method is not good)
		    slugCallback: function(filename) {
		    	var array = filename.split(".");
		    	if(array.length===1){
		    		return s.slugify(array[0]);
		    	}

		    	var extension = array.pop();
		    	filename = s(array).toSentence("-", "-").slugify().value() + "." + extension;

		    	return filename;
			},

		    ajaxSettings: {
		    	error: function(jqxhr, status, err){
		    		var msg = jqxhr.responseJSON.message;

					alert("ERROR: " + jqxhr.responseJSON.message);
					throw new Error(msg);
		    	}
		    },
		    uploadExtraData: function(){
				return { 
					tags: $("#new_file_tags").val(),
					filename: this.slugCallback(this.filestack[0].name)
				}
		    }

		});

		// self is the view
		var self = this;

		// this callback will execute after the file is selected (but before the upload button is clicked)
		$('#new_file').on('fileloaded', function(e, file, previewId, index, reader) {
			var filename = $(this).data("fileinput").slugCallback(file.name);

			// NOTE: the string returned by slugCallback has already replaced any extra dots by dashes
			// (it is garanteed that is it of the form "abc_xyz.ext", so the array will either have lenght 1 or 2)
			self.model.set("name", filename);
			self.model.set("nameWithoutExt", filename.split(".")[0]);
			
		});

		// $('#new_file').on('fileuploaded', function(event, data, previewId, index) {
		// 	debugger;
		// });


		// $('#new_file').on('fileuploaderror', function(event, data, previewId, index) {
		// 	debugger;
		// });

		// // $('#new_file').on('filebatchuploadcomplete', function(event, files, extra) {
		// //     debugger;
		// // });

		// $('#new_file').on('filelock', function(event, filestack, extraData) {
		// 	debugger;
		// });

		// $('#new_file').on('fileunlock', function(event, filestack, extraData) {
		// 	debugger;
		// });



	},

});

var FilesTabLV = Mn.LayoutView.extend({
	template: "files/templates/files-tab.html",

	regions: {
		tabContentRegion: "#files-region"
	},

	events: {
		"click a.js-dashboard-sep": "updateView"
	},

	// the initial view will be the list of all files
	onBeforeShow: function(){
		this.showAll();
	},

	updateView: function(e){

		e.preventDefault();

		var $target = $(e.target);
		$target.parent().siblings().removeClass("active");
		$target.parent().addClass("active");

		switch($target.data("tab-separator")){
			case "files-all":
				this.showAll();
				break;
			case "files-new":
				this.showNew();
				break;
			default:
				throw new Error("unknown tab separator");
		}
	},

	showNew: function(){
		var fileM = new FileM();
		var fileNewLV = new FileNewLV({
			model: fileM
		});
		this.tabContentRegion.show(fileNewLV); 
	},

	showAll: function(){

		var filesTableCV = new FilesTableCV({
			collection: filesC
		});

		var self = this;

		Q(filesC.fetch())
			.then(function(){ 
				self.tabContentRegion.show(filesTableCV); 
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
