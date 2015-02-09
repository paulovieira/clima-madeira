var TextM = Backbone.Model.extend({
	urlRoot: "/api/texts",
	defaults: {
		"tags": [],
		"contents": {pt: "", en: ""},
		"pt": "",
		"en": "",
		"author": ""
	},
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
	parse: function(resp){
		if(_.isArray(resp)){ resp = resp[0]; }
//debugger;

		resp.lastUpdated = moment(resp.lastUpdated).format('YYYY-MM-DD HH:mm:ss');
		return resp;
	}
});

var TextsC = Backbone.Collection.extend({
	model: TextM,
	url: "/api/texts",
});

var textsC = new TextsC();

var TextEditModalIV = Mn.ItemView.extend({
	template: "texts/templates/textEditModal.html",

	events: {
		"click button.js-modal-cancel": "cancelAndClose",
		"click button.js-modal-save": "updateText"
	},

	cancelAndClose: function(){
		Dashboard.$modal.modal("hide");
	},

	updateText: function(){

		var data = Backbone.Syphon.serialize(this);

		// convert the tags string to array of string and trim white space
		data.tags = data.tags.split(",");
		for(var i=0, l=data.tags.length; i<l; i++){
			data.tags[i] = $.trim(data.tags[i]);
		}

		this.model.set(data);
		
		Q(this.model.save()).then(
			function(data){
debugger;
				Dashboard.$modal.modal("hide");
			},
			function(err){
				console.log("ERROR: the modal has not been destroyed");
			}
		);
	},
});


var TextDeleteModalIV = Mn.ItemView.extend({
	template: "texts/templates/textDeleteModal.html",

	events: {
		"click button.js-modal-cancel": "modalClose",
		"click button.js-modal-delete": "deleteText"
	},

	modalClose: function(){
		Dashboard.$modal.modal("hide");
	},

	deleteText: function(){
		Q(this.model.destroy({
			wait: true
		})).then(
			function(data){
				Dashboard.$modal.modal("hide");
			},
			function(err){
				debugger;
				console.log("ERROR: the modal has not been destroyed");
			}
		);
	}
});

var TextRowLV = Mn.LayoutView.extend({
	template: "texts/templates/textRow.html",
	tagName: "tr",
	events: {
		"click button.js-edit": "showEditModal",
		"click button.js-delete": "showDeleteConfirmation"
	},
	modelEvents: {
		"change": "render"
	},

	showEditModal: function(){

		var textEditIV = new TextEditModalIV({
			model: this.model
		});

		// first set the content of the modal
		Dashboard.modalRegion.show(textEditIV);

		// then show the modal 
		Dashboard.$modal.modal("show");
	},

	showDeleteConfirmation: function(){
		var textDeleteModalIV = new TextDeleteModalIV({
			model: this.model
		});

		Dashboard.modalRegion.show(textDeleteModalIV);
		Dashboard.$modal.modal("show");
	},
});

var TextsTableCV = Mn.CompositeView.extend({
	template: "texts/templates/textsTable.html",
	childView: TextRowLV,
	childViewContainer: "tbody",
});

var TextNewLV = Mn.LayoutView.extend({
	template: "texts/templates/textNew.html",

	ui: {
		saveBtn: "button.js-save"
	},

	events: {
		"click @ui.saveBtn": "createText"
	},

	createText: function(){
debugger;
		var data = Backbone.Syphon.serialize(this);

		// convert the tags string to array of string and trim white space
		data.tags = data.tags.split(",");
		for(var i=0, l=data.tags.length; i<l; i++){
			data.tags[i] = $.trim(data.tags[i]);
		}

		this.model.set(data);
	
		this.ui.saveBtn.prop("disabled", true);
		Q(this.model.save()).then(
			function(data){
				debugger;
				alert("O texto foi criado com sucesso.");
			},
			function(err){
				debugger;
				alert("ERRO: o texto não foi criado.");
			}
		);
	}
});
