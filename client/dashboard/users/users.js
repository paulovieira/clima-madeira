var UsersC = Backbone.Collection.extend({
	model: UserM,  // UserM has been defined in profile.js
	url: "/api/users",
});

var usersC = new UsersC();


var UserEditModalIV = Mn.ItemView.extend({
	template: "users/templates/userEditModal.html",

	events: {
		"click button.js-modal-cancel": "cancelAndClose",
		"click button.js-modal-save": "updateText"
	},

	cancelAndClose: function(){
		Dashboard.$modal.modal("hide");
	},

	updateText: function(){

		var data = Backbone.Syphon.serialize(this);
		this.model.set(data);
		
		Q(this.model.save()).delay(100).then(
			function(data){

				Dashboard.$modal.modal("hide");
			},
			function(err){
				alert("ERROR: " + err.responseJSON.message);
				Dashboard.$modal.modal("hide");
			}
		);

	},
});

var UserDeleteModalIV = Mn.ItemView.extend({
	template: "users/templates/userDeleteModal.html",

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
				alert("ERROR: " + err.responseJSON.message);
				Dashboard.$modal.modal("hide");
			}
		);
	}
});

var UserRowLV = Mn.LayoutView.extend({
	template: "users/templates/userRow.html",
	tagName: "tr",
	events: {
		"click button.js-edit": "showEditModal",
		"click button.js-delete": "showDeleteConfirmation"
	},
	modelEvents: {
		"change": "render"
	},

	showEditModal: function(){
		var userEditIV = new UserEditModalIV({
			model: this.model
		});

		// first set the content of the modal
		Dashboard.modalRegion.show(userEditIV);

		// then show the modal 
		Dashboard.$modal.modal("show");
	},


	showDeleteConfirmation: function(){
		var userDeleteModalIV = new UserDeleteModalIV({
			model: this.model
		});

		Dashboard.modalRegion.show(userDeleteModalIV);
		Dashboard.$modal.modal("show");
	},
});

var UsersTableCV = Mn.CompositeView.extend({
	template: "users/templates/usersTable.html",
	childView: UserRowLV,
	childViewContainer: "tbody",
});