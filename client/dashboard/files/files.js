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

		var data = Backbone.Syphon.serialize(this);

		// convert the tags string to array of string and trim white space
		data.tags = data.tags.split(",");
		for(var i=0, l=data.tags.length; i<l; i++){
			data.tags[i] = $.trim(data.tags[i]);
		}

		// if tags is the empty string, we get an array with 1 element (the empty string); we want the empty array instead
		if(data.tags.length===1 && !data.tags[0]){
			data.tags = [];
		}

		this.model.set(data);

//		console.log("data: ", data);

		Q(this.model.save()).delay(100).then(
			function(data){
debugger;
				Dashboard.$modal.modal("hide");
				this.destroy();
			},
			function(err){
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
		ShowModal: {
			behaviorClass: window.Behaviors.ShowModal,
			editModalViewClass: FileEditModalIV,  // will listen for clicks on @ui.editModalBtn
			deleteModalViewClass: FileDeleteModalIV  // will listen for clicks on @ui.deleteModalBtn
		},
	},
});

var FilesTableCV = Mn.CompositeView.extend({
	template: "files/templates/filesTable.html",
	childView: FileRowLV,
	childViewContainer: "tbody",
});


var FileNewLV = Mn.LayoutView.extend({
	initialize: function(){
		// $('#js-new-file').on('filelock', function(event, filestack, extraData) {
		// 	debugger;
		//     //var fstack = filestack.filter(function(n){ return n != undefined });
		//     console.log('Files selected - ' + fstack.length);
		// });
	},

	template: "files/templates/fileNew.html",

	ui: {
		saveBtn: "button.js-save"
	},

	events: {
		"click @ui.saveBtn": "createResource"
	},

	triggers: {
		//"filelock #js-new-file": "fileUpload"
	},

	onFileUpload: function(){
		debugger;
	},

	onAttach: function(){
		// $("#js-new-file").fileinput({
		// 	showPreview: false
		// });

		// $('#js-new-file').on('filelock', function(event, filestack, extraData) {
		// 	debugger;
		//     //var fstack = filestack.filter(function(n){ return n != undefined });
		//     console.log('Files selected - ' + fstack.length);
		// });
	},

	createResource: function(){
debugger;
		var data = Backbone.Syphon.serialize(this);

		// convert the tags string to array of string and trim white space
		data.tags = data.tags.split(",");
		for(var i=0, l=data.tags.length; i<l; i++){
			data.tags[i] = $.trim(data.tags[i]);
		}

		this.model.set(data);
	
		this.ui.saveBtn.prop("disabled", true);
console.log("create")		;
		// Q(this.model.save()).then(
		// 	function(data){
		// 		debugger;
		// 		alert("O texto foi criado com sucesso.");
		// 	},
		// 	function(err){
		// 		debugger;
		// 		alert("ERRO: o texto não foi criado.");
		// 	}
		// );
	}
});