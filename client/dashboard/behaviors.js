window.Behaviors = window.Behaviors || {};

window.Behaviors.ShowModal = Marionette.Behavior.extend({

    // behaviors have events that are bound to the views DOM
    events: {
        "click @ui.editModalBtn": "showEditModal",
        "click @ui.deleteModalBtn": "showDeleteModal"
    },

    showEditModal: function(){
        var modalView = new this.options.editModalViewClass({
            model: this.view.model
        });

    	this._showModal(modalView)
    },

    showDeleteModal: function(){
        var modalView = new this.options.deleteModalViewClass({
            model: this.view.model
        });

    	this._showModal(modalView)
    },

    _showModal: function(view) {

        // first set the content of the modal
        Dashboard.modalRegion.show(view);

        // then show the modal 
        Dashboard.$modal.modal("show");

    },

});


// close the modal and destroy the view
window.Behaviors.CloseModal = Marionette.Behavior.extend({

    // behaviors have events that are bound to the views DOM
    events: {
        "click @ui.modalCloseBtn": "closeModal",
    },

    closeModal: function(){
		Dashboard.$modal.modal("hide");
		this.view.destroy();
    },

});


// deletes the resource, close the modal and destroy the view
window.Behaviors.DeleteResourceAndCloseModal = Marionette.Behavior.extend({

    // behaviors have events that are bound to the views DOM
    events: {
        "click @ui.modalDeleteBtn": "deleteResource"
    },

	deleteResource: function(){

		Q(this.view.model.destroy({
			wait: true
		})).then(
			function(data){
				Dashboard.$modal.modal("hide");
				this.view.destroy();
			},
			function(err){
				throw err;
			}
		);
	}

});


var ModalIV = Mn.ItemView.extend({
	ui: {
		"modalCloseBtn":  "button.js-modal-cancel",
		"modalDeleteBtn": "button.js-modal-delete",
		"modalSaveBtn":   "button.js-modal-save"
	},
});
