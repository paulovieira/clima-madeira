

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

/*
var geojsonMarkerOptions = {
    radius: 4,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
*/
var heatmapConfig = {

	"blur": 0.7,

	// radius should be small ONLY if scaleRadius is true (or small radius is intended)
	"radius": 0.012,
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
	.then(function(datax){
		console.log("datax: ", datax);
//		debugger;
/*
		L.geoJson(data, {
			pointToLayer: function pointToLayer(feature, latlng) {
				return L.circleMarker(latlng, geojsonMarkerOptions);
			},
		}).addTo(map);
*/


		// code for the official heatmap plugin
		// var heat = L.heatLayer(data, {
		// 	radius: 30,
		// 	blur: 30,
		// 	gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
		// }).addTo(map);


var heatmapLayer = new HeatmapOverlay(heatmapConfig);
map.addLayer(heatmapLayer);

// var testData = {
//   max: 8,
//   data: [{lat: 32.629, lng: -16.949, value: 3}]
// };


var heatData = {
  min: _.max(),
  max: 10,
  data: [
			{
			lat: 32.629,
			lng: -16.949,
			value: 9.9
			},
			{
			lat: 32.829,
			lng: -16.938,
			value: 7.1
			}
		]
};

heatmapLayer.setData(datax);


	})
	.catch(function(err){
		console.log(err);
	});

