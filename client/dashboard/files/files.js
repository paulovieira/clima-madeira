var FileM = Backbone.Model.extend({
	urlRoot: "/api/files",
	defaults: {
	},
	initialize: function(){

/*
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
*/
	},
	parse: function(resp){
		if(_.isArray(resp)){ resp = resp[0]; }
//debugger;

		resp.uploadedAt = moment(resp.uploadedAt).format('YYYY-MM-DD HH:mm:ss');

		// delete the properties that might be null
		if(resp.description === null){ delete resp.description; }
		if(resp.properties === null){ delete resp.properties; }

		return resp;
	}
});

var FilesC = Backbone.Collection.extend({
	model: FileM,  
	url: "/api/files",
});

var filesC = new FilesC();


var FileEditModalIV = ModalIV.extend({
	template: "files/templates/fileEditModal.html",

	events: {
		"click @ui.modalSaveBtn": "updateFile"
	},

	behaviors: {
		CloseModal: {
			behaviorClass: window.Behaviors.CloseModal,  // will listen for clicks on @ui.modalCloseBtn
		},
	},

	updateFile: function(){
//debugger;
		var data = Backbone.Syphon.serialize(this);
		//this.model.set(data);

		// NOTE: we should always use model.save(attrs, {wait: true}) instead of 
		// model.set(atrrs); model.save();  this way the attributes will be updated
		// only after the model has really been saved in the server
		Q(this.model.save(data, {wait: true})).delay(100).then(
			function(data){
//debugger;
				Dashboard.$modal.modal("hide");
				this.destroy();
			},
			function(err){
				alert("ERROR: data was not saved");
				throw err;
			}
		);

	},
});

var FileDeleteModalIV = ModalIV.extend({
	template: "files/templates/fileDeleteModal.html",

	behaviors: {
		CloseModal: {
			behaviorClass: window.Behaviors.CloseModal,  // will listen for clicks on @ui.modalCloseBtn
		},
		DeleteResourceAndCloseModal: {
			behaviorClass: window.Behaviors.DeleteResourceAndCloseModal,  // will listen for clicks on @ui.modalDeleteBtn
		},
	}

});

var FileRowLV = Mn.LayoutView.extend({

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

	template: "files/templates/fileRow.html",
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
	template: "files/templates/filesTable.html",
	childView: FileRowLV,
	childViewContainer: "tbody",
});


var FileNewLV = Mn.LayoutView.extend({

	template: "files/templates/fileNew.html",

	onAttach: function(){

		$("#newfile").fileinput({
		    uploadUrl: '/api/files',
		    maxFileSize: 50000,  // in Kb
		    showUpload: true,
		    initialCaption: "Click the browse button on the right",
		    showRemove: false,
		    //overwriteInitial: false,
		    //showCaption: false
		    // ajaxSettings: {
		    // 	success: function(data, status, jqxhr){
		    // 		debugger;
		    // 	},
		    // 	error: function(jqxhr, status, err){
		    // 		debugger;
		    // 	}
		    // },
		    uploadExtraData: function(){
				return { 
					tags: $("#newfiletags").val()
				}
		    }

		});

		// $('#js-newfile').on('fileuploaded', function(event, data, previewId, index) {
		// 	debugger;
		// });


		// $('#js-newfile').on('fileuploaderror', function(event, data, previewId, index) {
		// debugger;
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