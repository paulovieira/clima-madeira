var PeriodControl = L.Control.extend({

	options: {
		position: 'topright'
	},

	onAdd: function (map) {
	    this._div = L.DomUtil.create('div', 'period-control'); // create a div with a class "info"
		L.DomEvent.disableClickPropagation(this._div);

	    return this._div;
	},

});


var periodControl = new PeriodControl();
map.addControl(periodControl);
//var $controlContainer = $(periodControl.getContainer());


// 1) when a layer is added to the map (using the sidebar menu), the periodControl is also added; this will create a div.period-control on the DOM (child of div.leaflet-control-container, which is a child of div#map)
// 2) create an instance of an Mn region, using div.period-control
// 3) create an instance of a view and show

var PeriodControlRegion = Mn.Region.extend({
	el: $(periodControl.getContainer()),
	onBeforeShow: function(){
		$(".period-control").css("visibility", "visible");
	},
	onBeforeEmpty: function(){
		$(".period-control").css("visibility", "hidden");
	}
});

Ferramenta.addRegions({
	periodControlRegion: PeriodControlRegion
});

var PeriodsSeasonsLV = Mn.LayoutView.extend({
	template: "period-control/templates/periods-seasons.html",

	initialize: function(){
		_.bindAll(this, "toggleActiveButton", "showSeasonMap");
	},

	showSeasonMap: function(e){
		if(this.statusPlay){
			this.toggleStatus();
		}

		var $target = $(e.target);
		var id = $target.children().attr("id");
		id = parseInt(id.split("-")[1], 10);

        // we don't know which overlay is being shows; make sure all of them are removed
        _.each(this.model.get("layers"), function(obj){
            map.removeLayer(obj.overlay);
        });

        map.addLayer( (this.model.get("layers")[id]).overlay );

	},

	toggleActiveButton: function(){

		// id will be "option-1", "option-2", ..., "option-5"
		var id = $("#seasons-toolbar").find(".active").children().attr("id"), 
			newId;

		if(id===undefined){
			id = 0;
			newId = "#option-" + id;

			// activate the button
			$(newId).parent().toggleClass("active")
			return;
		}

		// disable the active class
		$("#" + id).parent().toggleClass("active");

		// parseInt will given us 0, 1, 2, ..., 4; the modulus operator will give is the "next" id
		// (if id is 4, will give us 1)
		id = ( (parseInt(id.split("-")[1], 10) + 1) % 5) ;
		newId = "#option-" + id;

		// activate
		$(newId).parent().toggleClass("active")


        // we don't know which overlay is being shows; make sure all of them are removed
        _.each(this.model.get("layers"), function(obj){
            map.removeLayer(obj.overlay);
        });

        map.addLayer( (this.model.get("layers")[id]).overlay );
	},

	clearInterval: function(){
		if(this.intervalId){
			clearInterval(this.intervalId);
			this.intervalId = undefined;
		}
	},

	onBeforeDestroy: function(){
		this.clearInterval();
	},

	toggleStatus: function(){
		this.statusPlay = !this.statusPlay;

		// this.statusPlay now has the new status
		// make sure the icon is in accordance with the status
		if(this.statusPlay){
			$("button#js-periods-play").find("span").removeClass("glyphicon-play").addClass("glyphicon-stop");
			this.intervalId = setInterval(this.toggleActiveButton, 1000);
			return;
		}
		else{
			$("button#js-periods-play").find("span").removeClass("glyphicon-stop").addClass("glyphicon-play");
			if(this.intervalId){
				this.clearInterval();
				return;
			}
		}
	},

	events: {
		"click label.btn": "showSeasonMap",
		"click button#js-periods-play": "toggleStatus",

	}
});






var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [9, 12, 15, 19, 22];

    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML += '<i style="background: rgb(45, 130, 184)"></i> 9<br>';
    div.innerHTML += '<i style="background: rgb(172, 221, 165)"></i> 12<br>';
    div.innerHTML += '<i style="background: rgb(255, 255, 193)"></i> 15<br>';
    div.innerHTML += '<i style="background: rgb(253, 174, 97)"></i> 19<br>';
    div.innerHTML += '<i style="background: rgb(215, 25, 27)"></i> 22<br>';

    return div;
};

legend.addTo(map);