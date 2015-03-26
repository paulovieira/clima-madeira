var _ = require('underscore');
var Hoek = require("hoek");
// different transform objects to be passed Hoek.transform to modify the response objects 
// (to be used in the API endpoints)

var transforms = {

	//  transform maps to be used in Hoek.transform
	maps: {
		text: {
		    // a) properties to be maintained
		    "id": "id",
		    "tags": "tags",
		    "contents": "contents",
		    "lastUpdated": "lastUpdated",

		    // b) new properties (move properties from the nested object to the top object)
		    "pt": "contents.pt",
		    "en": "contents.en",

		    // c) changed properties (some fields from authorData, such as pwHash, will be deleted)
		    "authorData.id": "authorData.id",
		    "authorData.firstName": "authorData.firstName",
		    "authorData.lastName": "authorData.lastName",
		    //"authorData.email": "authorData.email",

		    // d) deleted properties: "contentsDesc", "authorId", "active"
		},

		user: {
		    // a) properties to be maintained
		    "id": "id",
		    "email": "email",
		    "firstName": "firstName",
		    "lastName": "lastName",
		    "createdAt": "createdAt",
		    "userTexts": "userTexts",
		    "userGroups": "userGroups"

		    // d) deleted properties: "recover", "pwHash", "recoverValidUntil"
		},

		files: {
		    // a) properties to be maintained
		    "id": "id",
		    "name": "name",
		    "logicalPath": "logicalPath",
		    "tags": "tags",
		    "description": "description",
		    "properties":"properties",
		    "uploadedAt":"uploadedAt",

		    // c) changed properties (some fields from ownerData, such as pwHash, will be deleted)
		    "ownerData.id": "ownerData.id",
		    "ownerData.firstName": "ownerData.firstName",
		    "ownerData.lastName": "ownerData.lastName",
		},

		maps: {
		    // a) properties to be maintained
		    "id": "id",
		    "code": "code",
		    "title": "title",
		    "description": "description",
		    "properties": "properties",
		    "categoryId": "categoryId",
		    "ownerId": "ownerId",
		    "createdAt": "createdAt",

		    // c) changed properties (some fields from ownerData, such as pwHash, will be deleted)
		    "ownerData.id": "ownerData.id",
		    "ownerData.email": "ownerData.email",
		    "ownerData.firstName": "ownerData.firstName",
		    "ownerData.lastName": "ownerData.lastName",

		    "categoryData.id": "categoryData.id",
		    "categoryData.contents": "categoryData.contents",
		    "categoryData.properties": "categoryData.properties",
		    "categoryData.active": "categoryData.active",

		    // d) deleted properties: "categoryId", "fileId", "tableName"
		}

	},

	// calls Hoek.transform  with the given transform map to all the objects in the array
	transformArray: function(array, transformMap, options){
	    if(!_.isArray(array)){ array = [array]; }		

	    var i, li;
        for(i=0, li=array.length; i<li; i++){ 
            array[i] = Hoek.transform(array[i], transformMap, options);
        }

        return array;
	},

	// given an array of geoJson features, returns an array of arrays, each one with lat,lon,val,
	// to be used in Leaflet.Heat plugin; the value is relative to the property whose key given in the 2nd arg
	heatmapArray: function(array, key){
	    var i, li;
	    var valueTemp;
        for(i=0, li=array.length; i<li; i++){ 
        	valueTemp = "" + array[i].properties[key];
            array[i] = [array[i].geometry.coordinates[1], array[i].geometry.coordinates[0]];
            array[i].push(valueTemp);
        }

        return array;
	},

	// similar to the above; to be used with the heatmap.js plugin
	// http://www.patrick-wied.at/static/heatmapjs/example-heatmap-leaflet.html
	heatmapData2: function(array, key){
	    var i, li;
	    var arrayValue = [];

        for(i=0, li=array.length; i<li; i++){ 
        	arrayValue.push({
        		lat: array[i].geometry.coordinates[1],
        		lng: array[i].geometry.coordinates[0],
        		value: array[i].properties[key]
        	});
        }

        var maxValue = (_.max(arrayValue, function(obj){ return obj.value; }))["value"],
    		minValue = (_.min(arrayValue, function(obj){ return obj.value; }))["value"];

        return { max: maxValue, min: minValue, data: arrayValue };
	}
};

module.exports = transforms;


