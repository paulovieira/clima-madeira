window.Behaviors = window.Behaviors || {};

window.Behaviors.ShowModal = Marionette.Behavior.extend({

    events: function(){
    	var eventsHash = {};
    	eventsHash["click @ui." + this.options.uiKey] = "showModal";

    	return eventsHash;
    },

    showModal: function(){
        var view = new this.options.viewClass({
            model: this.view.model
        });

        // first set the content of the modal
        Dashboard.modal1Region.show(view);

        // then show the modal 
        Dashboard.$modal1.modal("show");
    },
});




// close the modal and destroy the view
window.Behaviors.CloseModal = Marionette.Behavior.extend({

    // behaviors have events that are bound to the views DOM
    events: {
        "click @ui.modalCloseBtn": "closeModal",
    },

    closeModal: function(){
		Dashboard.$modal1.modal("hide");
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
		// NOTE: we should always use model.destroy({wait: true}) instead of simply model.destroy();  
		// this way the model will be destroyed (in the client) only after we get a 200 response
		// from the server (meaning the row has actually been deleted)

		var self = this;
		Q.delay(150)
			.then(function(){
				return self.view.model.destroy({ wait: true });  // returns a promise
			})
			.then(
				function(data){
					Dashboard.$modal1.modal("hide");
					self.view.destroy();
				},
				function(jqXHR){
					var msg = jqXHR.responseJSON.message;
					alert("ERROR: " + msg);
					throw new Error(msg);
				}
			)
			.done();
	}

});

var ModalMixins = {
	ui: {
		"modalCloseBtn":  "button.js-modal-cancel",
		"modalDeleteBtn": "button.js-modal-delete",
		"modalSaveBtn":   "button.js-modal-save"
	}	
};

var ModalIV = Mn.ItemView.extend({
	ui: {
		"modalCloseBtn":  "button.js-modal-cancel",
		"modalDeleteBtn": "button.js-modal-delete",
		"modalSaveBtn":   "button.js-modal-save"
	},
});
