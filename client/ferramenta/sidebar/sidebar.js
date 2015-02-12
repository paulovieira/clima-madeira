var sidebar = L.control.sidebar('sidebar', {
    position: 'left',
    autoPan: true,
    closeButton: false
});

setTimeout(function() {
    sidebar.show();
}, 200);

map.addControl(sidebar);

var LayerOptionsModalLV = Mn.LayoutView.extend({
	template: "sidebar/templates/sidebarOptionsModal.html",

	events: {
		"click button.js-modal-cancel": "cancelAndClose",
		"click button.js-modal-save": "updateOptions"
	},

	cancelAndClose: function(){
		Ferramenta.$modal.modal("hide");
	},

	updateOptions: function(){

		var data = Backbone.Syphon.serialize(this);

		if(data.opacity){
			data.opacity = parseFloat(data.opacity);
/*
	        _.each(this.model.get("layers"), function(obj){
	        	debugger;
	            obj.overlay.setOpacity(data.opacity);
	        });
*/	        
		} 

		this.model.set(data);

		Ferramenta.$modal.modal("hide");
	},
});
