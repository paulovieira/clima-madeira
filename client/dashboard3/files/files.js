
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



var FileNewLV = Mn.LayoutView.extend({
	template: "files/templates/files-new.html",

	onAttach: function(){

		$("#new_file").fileinput({
		    uploadUrl: '/api/files',
		    maxFileSize: 1000*200,  // in Kb
		    showUpload: true,
		    initialCaption: "Click the browse button on the right to choose a file",
		    showRemove: false,
		    //overwriteInitial: false,
		    //showCaption: false
		    ajaxSettings: {
		    	error: function(jqxhr, status, err){
		    		var msg = jqxhr.responseJSON.message;

					alert("ERROR: " + jqxhr.responseJSON.message);
					throw new Error(msg);
		    	}
		    },
		    uploadExtraData: function(){
				return { 
					tags: $("#new_file_tags").val()
				}
		    }

		});

		// $('#js-newfile').on('fileuploaded', function(event, data, previewId, index) {
		// 	debugger;
		// });


		// $('#new_file').on('fileuploaderror', function(event, data, previewId, index) {
		// 	debugger;
		// });

		// // $('#js-newfile').on('filebatchuploadcomplete', function(event, files, extra) {
		// //     debugger;
		// // });

		// $('#js-newfile').on('filelock', function(event, filestack, extraData) {
		// 	debugger;
		// });

		// $('#js-newfile').on('fileunlock', function(event, filestack, extraData) {
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
		//var fileM = new FileM();
		var fileNewLV = new FileNewLV({
		//	model: fileM
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
