var TextEditModalIV = Mn.ItemView.extend({
	template: "texts/templates/texts-edit-modal.html",

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
			"contents": {
				"pt": data["edit-text-pt"],
				"en": data["edit-text-en"]
			},
			"tags": data["edit-text-tags"]
		};
		// NOTE: we should always use model.save(attrs, {wait: true}) instead of 
		// model.set(attrs) + model.save(); this way the model will be updated (in the client) only 
		// after we get a 200 response from the server (meaning the row has actually been updated)

		this.ui.modalSaveBtn.prop("disabled", true);
		var self = this;
		Q.delay(150)
			.then(function(){
				return self.model.save(attrs, {wait: true});  // returns a promise
			})
			.then(
				function(){
					Dashboard.$modal1.modal("hide");
					self.destroy();
				},
				function(jqXHR){
					var msg = jqXHR.responseJSON.message;
					alert("ERROR: " + msg);
					throw new Error(msg);
				}
			)
			.finally(function(){
				self.ui.saveBtn.prop("disabled", false);
			})
			.done();

	},

});


var TextDeleteModalIV = Mn.ItemView.extend({
	template: "texts/templates/texts-delete-modal.html",

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


var TextRowLV = Mn.LayoutView.extend({
	template: "texts/templates/texts-row.html",
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
			viewClass: TextEditModalIV  // and will show this view
		},

		ShowDeleteModal: {
			behaviorClass: window.Behaviors.ShowModal,
			uiKey: "deleteModalBtn",
			viewClass: TextDeleteModalIV 
		},
	},

});

var TextsTableCV = Mn.CompositeView.extend({
	template: "texts/templates/texts-table.html",
	childView: TextRowLV,
	childViewContainer: "tbody",
});


var TextNewLV = Mn.LayoutView.extend({
	template: "texts/templates/texts-new.html",

	ui: {
		saveBtn: "button.js-save"
	},

	events: {
		"click @ui.saveBtn": "createText"
	},

	createText: function(){

		var data = Backbone.Syphon.serialize(this);

		var attrs = {
			"contents": {
				"pt": data["new-text-pt"],
				"en": data["new-text-en"]
			},
			"tags": data["new-text-tags"]
		};

		this.ui.saveBtn.prop("disabled", true);

		var self = this;
		Q.delay(150)
			.then(function(){
				return self.model.save(attrs, {wait: true});  // returns a promise
			})
			.then(
				function(data){
					alert("O texto foi criado com sucesso.");
				},
				function(jqXHR){
					var msg = jqXHR.responseJSON.message;
					alert("ERROR: " + msg);
					throw new Error(msg);
				}
			)
			.finally(function(){
				self.ui.saveBtn.prop("disabled", false);
			})
			.done();

	}
});


var TextsTabLV = Mn.LayoutView.extend({
	template: "texts/templates/texts-tab.html",

	regions: {
		tabContentRegion: "#texts-region"
	},

	events: {
		"click a": "updateView"
	},

	// the initial view will be the list of all texts
	onBeforeShow: function(){
		this.showAllTexts();
	},

	updateView: function(e){
		e.preventDefault();

		var $target = $(e.target);
		$target.parent().siblings().removeClass("active");
		$target.parent().addClass("active");

		switch($target.data("tab-separator")){
			case "texts-all":
				this.showAllTexts();
				break;
			case "texts-new":
				this.showNewText();
				break;
			default:
				throw new Error("unknown tab separator");
		}
	},

	showNewText: function(){
		var textNewLV = new TextNewLV({
			model: new TextM()
		});
		this.tabContentRegion.show(textNewLV); 
	},

	showAllTexts: function(){
		var textsTableCV = new TextsTableCV({
			collection: textsC
		});

		var self = this;

		Q(textsC.fetch())
			.then(
				function(){ 
					self.tabContentRegion.show(textsTableCV); 
				}, 
				function(jqXHR){
					var msg = jqXHR.responseJSON.message;
					alert("ERROR: " + msg);
					throw new Error(msg);
				}
			)
			.done();
	},


});

