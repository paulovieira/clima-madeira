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

		this.ui.modalDeleteBtn.prop("disabled", true);

		var self = this;
		Q.delay(150)
			.then(function(){
				return self.view.model.destroy({ wait: true });  // returns a promise
			})
			.catch(function(jqXHR){
debugger;
				var msg = jqXHR.responseJSON.message;
				alert("ERROR: " + msg);

				// if the model has been deleted in the server in the meantime we get a 404; 
				// the destroy() method in the above handler will not be called (because of the
				// wait:true option), so the collection in the client will be outdated; we call destroy 
				// again to remove it from the collection, but abort the ajax request immediately
				if(jqXHR.responseJSON.statusCode === 404){
					self.view.model.destroy().abort();
				}

				throw new Error(msg);
			})
			.finally(function(){
				//self.ui.modalDeleteBtn.prop("disabled", false);
				Dashboard.$modal1.modal("hide");
				self.view.destroy();
			})
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
