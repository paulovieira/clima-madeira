    var testData = {
        min: 5,
        max: 10,

        data: [{
            xlat: 32.629,
            xlng: -16.949,
            value: 10
        }, {
            xlat: 32.829,
            xlng: -16.938,
            value: 5
        }]
    };

    var cfg = {
        "blur": 0.90,
        "radius": 0.05,
        //"radius": 50,
        "maxOpacity": 0.8,
        "minOpacity": 0.1,
        "scaleRadius": true,
        "useLocalExtrema": false,
        latField: 'xlat',
        lngField: 'xlng',
        "valueField": 'value',

    };

    var baseLayer = L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
            maxZoom: 18
        }
    );

    var map = new L.Map('map', {
        center: new L.LatLng(32.74, -16.95),
        zoom: 9,
        //layers: [baseLayer, heatmapLayer]
        layers: [baseLayer]
    });



    var heatmapLayer = new HeatmapOverlay(cfg);
    map.addLayer(heatmapLayer);

    heatmapLayer.setData(testData);