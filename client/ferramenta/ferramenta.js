//var sidebarChannel = Backbone.Radio.channel('sidebar');

var Ferramenta = new Mn.Application();
Ferramenta.$modal = $("#modal");
Ferramenta.$modalSm = $("#modal-sm");

Ferramenta.addRegions({
//    mainRegion: "#main-region",
    modalRegion: "#modal-content-region",
    modalSmRegion: "#modal-sm-content-region"
});



var mapHeight = $(window).height() - $(".navbar").height() - $(".footer").height();
var mapHeight = $(window).height() - $(".navbar").height() - 23;
$("#map").height(mapHeight);

var data;
var showCoordinates = function() {
    console.log("show coordinates");
};

// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map', {
/*
    contextmenu: true,
    contextmenuWidth: 280,
    contextmenuItems: [{
        text: nunjucks.render("contextMenu/templates/base-layers.html"),
    }, {
        separator: true,
    }, ]
*/
});


map.setView([32.7517543, -16.9605921], 11);

var mapboxAccessToken = "pk.eyJ1IjoicGF1bG9zYW50b3N2aWVpcmEiLCJhIjoidWlIaGRJayJ9.xDEbXL8LPTO0gJW-NBN8eg";
var tileLayers = {

    base: {
        "Hydda.Base": L.tileLayer.provider('Hydda.Base'), // maxZoom: 18
        "Esri.WorldShadedRelief": L.tileLayer.provider('Esri.WorldShadedRelief'), // maxZoom: 13
        "OpenMapSurfer.Grayscale": L.tileLayer.provider('OpenMapSurfer.Grayscale'),
    },

    rivers: {
        "Esri.WorldGrayCanvas": L.tileLayer.provider('Esri.WorldGrayCanvas'), // maxZoom: 16
        "Esri.WorldTopoMap": L.tileLayer.provider('Esri.WorldTopoMap'),
    },

    streets: {
        "Esri.WorldStreetMap": L.tileLayer.provider('Esri.WorldStreetMap'),
        "MapQuestOpen.OSM": L.tileLayer.provider('MapQuestOpen.OSM'),
        "HERE.normalDayGrey": L.tileLayer.provider('HERE.normalDayGrey', {
            'app_id': 'Y8m9dK2brESDPGJPdrvs',
            'app_code': 'dq2MYIvjAotR8tHvY8Q_Dg'
        }),
    },

    terrain: {
        "Mapbox.Emerald": L.tileLayer('https://{s}.tiles.mapbox.com/v4/examples.map-i87786ca/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
            maxZoom: 18,
            id: 'paulosantosvieira.l4h4omm9'
        }),
        "Esri.DeLorme": L.tileLayer.provider('Esri.DeLorme'), // maxZoom: 11
        "Acetate.hillshading": L.tileLayer.provider('Acetate.hillshading'),
        "Thunderforest.Outdoors": L.tileLayer.provider('Thunderforest.Outdoors'),
        "HERE.terrainDay": L.tileLayer.provider('HERE.terrainDay', {
            'app_id': 'Y8m9dK2brESDPGJPdrvs',
            'app_code': 'dq2MYIvjAotR8tHvY8Q_Dg'
        }),
    },

    satellite: {
        "MapQuestOpen.Aerial": L.tileLayer.provider('MapQuestOpen.Aerial'), // maxZoom: 11
        "Esri.WorldImagery": L.tileLayer.provider('Esri.WorldImagery'), // maxZoom: 13
        "HERE.satelliteDay": L.tileLayer.provider('HERE.satelliteDay', {
            'app_id': 'Y8m9dK2brESDPGJPdrvs',
            'app_code': 'dq2MYIvjAotR8tHvY8Q_Dg'
        }), // maxZoom: 19
    }
}

tileLayers.base["Hydda.Base"].addTo(map);



L.easyButton('fa-bars',
    function() {
        sidebar.toggle();
    },
    'Show the options menu'
);



function getData() {

    var deferred = Q.defer();

    $.ajax({
        type: "GET",
        url: "/api/shapes_climaticos",
        success: function(data) {
            //debugger;
            return deferred.resolve(data);
        },
        error: function(jqXhr, status, error) {
            //debugger;
            var errorMessage = "status: " + status + ", error: " + error;

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

/*
getData()
    .then(function(heatData) {
        //		console.log("heatData: ", heatData);
        //		debugger;


        data = {
        	type: "FeatureCollection",
        	features: heatData
        };

        var breaks = _.range(5, 26, 1);
		isobands = turf.isolines(data, 'tmean_ref', 160, breaks);

		var temp = [];
		for(var i=0, l = isobands.features.length; i<l; i++){
			temp.push(isobands.features[i].properties.tmean_ref);
		}

		var min = _.min(temp),
			max = _.max(temp);

		var scale = chroma.scale(['blue', 'red']).domain([min, max]);


		L.geoJson(isobands, {
			style: function(feature){
				//console.log(scale(feature.properties.tmean_ref).hex());
				return { 
					color: scale(feature.properties.tmean_ref).hex(),
					weight: 2,
				};
			}
		})
		.addTo(map);

        //var heatmapLayer = new HeatmapOverlay(heatmapConfig);
        //map.addLayer(heatmapLayer);


        //heatmapLayer.setData(heatData);



    })
    .catch(function(err) {
        console.log(err);
    });
*/


var rasterBaseUrl = "/ferramenta/images/png/";
var rasterCollection = new Backbone.Collection([
{
    description : "Temperatura média (referência: 1970-1999)",
    layers: [
        {
            imageUrl: rasterBaseUrl + '0_Tref_Anual_color.png',
            overlay: undefined
        },
        {
            imageUrl: rasterBaseUrl + '1_Tref_Inverno2_color.png',
            overlay: undefined
        },
        {
            imageUrl: rasterBaseUrl + '2_Tref_Primavera2_color.png',
            overlay: undefined
        },
        {
            imageUrl: rasterBaseUrl + '3_Tref_verao2_color.png',
            overlay: undefined
        },
        {
            imageUrl: rasterBaseUrl + '4_Tref_Outono2_color.png',
            overlay: undefined
        }
    ],
    imageBounds : [[32.8706293, -17.2659376 ], [32.6328793, -16.6552465]],
//    options     : { opacity: 0.4 },
    opacity     : 0.9,
    checkboxId  : "#js-temp-ref-layer",
    optionsId   : "#js-temp-ref-options"
}

]);

var models = rasterCollection.models;
for(var i=0, l=models.length; i<l; i++){
/*
    _.each(models[i].get("layers"), function(obj){
        obj.overlay = L.imageOverlay(
                            obj.imageUrl, 
                            models[i].get("imageBounds"), 
                            { opacity: models[i].get("opacity") }
                        );
    });
    

    $(models[i].get("checkboxId")).on("click", function(e){
        var isChecked = $(e.target).is(":checked");

        if(isChecked){
            map.addLayer( ((models[i].get("layers"))[0]).overlay );

            var periodsSeasonsLV = new PeriodsSeasonsLV({
                model: models[i]
            });
            Ferramenta.periodControlRegion.show(periodsSeasonsLV);
        }
        else{
            Ferramenta.periodControlRegion.empty();

            // we don't know which overlay is being shows; make sure all of them are removed
            _.each(models[i].get("layers"), function(obj){
                map.removeLayer(obj.overlay);
            });
        }
    });


    $(model.get("optionsId")).on("click", function(e){
        console.log("options");

        var layerOptionsModalLV = new LayerOptionsModalLV({
            model: model
        });

        Ferramenta.modalRegion.show(layerOptionsModalLV);
        Ferramenta.$modal.modal("show");
    });
*/


};





_.each(models[0].get("layers"), function(obj){
    obj.overlay = L.imageOverlay(
                        obj.imageUrl, 
                        models[0].get("imageBounds"), 
                        { opacity: models[0].get("opacity") }
                    );
});


$(models[0].get("checkboxId")).on("click", function(e){
    var isChecked = $(e.target).is(":checked");

    if(isChecked){
        map.addLayer( ((models[0].get("layers"))[0]).overlay );

        var periodsSeasonsLV = new PeriodsSeasonsLV({
            model: models[0]
        });
        Ferramenta.periodControlRegion.show(periodsSeasonsLV);
    }
    else{
        Ferramenta.periodControlRegion.empty();

        // we don't know which overlay is being shows; make sure all of them are removed
        _.each(models[0].get("layers"), function(obj){
            map.removeLayer(obj.overlay);
        });
    }
});



$(models[0].get("optionsId")).on("click", function(e){

    var layerOptionsModalLV = new LayerOptionsModalLV({
        model: models[0]
    });

    Ferramenta.modalRegion.show(layerOptionsModalLV);
    Ferramenta.$modal.modal("show");
});