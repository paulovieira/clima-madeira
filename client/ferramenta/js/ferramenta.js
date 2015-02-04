var showCoordinates = function() {
    console.log("show coordinates");
};

// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map', {
    contextmenu: true,
    contextmenuWidth: 280,
    contextmenuItems: [{
        text: nunjucks.render("contextMenu/templates/base-layers.html"),
    }, {
        separator: true,
    }, ]
});

map.setView([32.74, -16.95], 11);

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

var sidebar = L.control.sidebar('sidebar', {
    position: 'left',
    autoPan: true,
    closeButton: false
});

setTimeout(function() {
    sidebar.show();
}, 200);

map.addControl(sidebar);


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


getData()
    .then(function(heatData) {
        //		console.log("heatData: ", heatData);
        //		debugger;



        var heatmapLayer = new HeatmapOverlay(heatmapConfig);
        map.addLayer(heatmapLayer);


        heatmapLayer.setData(heatData);


    })
    .catch(function(err) {
        console.log(err);
    });
