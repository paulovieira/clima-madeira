

// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map').setView([32.74, -16.95], 11);

// add an OpenStreetMap tile layer

L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
	maxZoom: 18,
	id: 'examples.map-i875mjb7'
}).addTo(map);



function getData(){

	var deferred = Q.defer();

	$.ajax({
		type: "GET",
		url: "/api/shapes_climaticos",
		success: function(data){
//debugger;
			return deferred.resolve(data);
		},
		error: function(jqXhr, status, error){
//debugger;
			var errorMessage = "status: " + status
							+ ", error: " + error;

			return deferred.reject(new Error(errorMessage));
		}
	});

	return deferred.promise;
};


var heatmapConfig = {

	"blur": 0.8,

	// radius should be small ONLY if scaleRadius is true (or small radius is intended)
	"radius": 0.013,
	//"blur": 20,
	"maxOpacity": 0.8, 
	"minOpacity": 0.2,

	// scales the radius based on map zoom
	"scaleRadius": true, 
	// if set to false the heatmap uses the global maximum for colorization
	// if activated: uses the data maximum within the current map boundaries 
	//   (there will always be a red spot with useLocalExtremas true)
	"useLocalExtrema": false,
	// which field name in your data represents the latitude - default "lat"
	//"latField": 'lat',
	// which field name in your data represents the longitude - default "lng"
	//"lngField": 'lng',
	// which field name in your data represents the data value - default "value"
	//"valueField": "value",

};


getData()
	.then(function(heatData){
//		console.log("heatData: ", heatData);
//		debugger;



		var heatmapLayer = new HeatmapOverlay(heatmapConfig);
		map.addLayer(heatmapLayer);


		heatmapLayer.setData(heatData);


	})
	.catch(function(err){
		console.log(err);
	});

