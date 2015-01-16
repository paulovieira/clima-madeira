// different transform objects to be passed Hoek.transform to modify the response objects 
// (to be used in the API endpoints)

var transforms = {

	text: {
	    // a) properties to be maintained
	    "id": "id",
	    "tags": "tags",
	    "contents": "contents",
	    "lastUpdated": "lastUpdated",

	    // b) the new properties (move properties from the nested object to the top object)
	    "pt": "contents.pt",
	    "en": "contents.en",

	    // c) changed propeties (some fields from authorData, such as pwHash, will be deleted)
	    "authorData.id": "authorData.id",
	    "authorData.firstName": "authorData.firstName",
	    "authorData.lastName": "authorData.lastName",
	    //"authorData.email": "authorData.email",

	    // d) deleted properties: "contentsDesc", "authorId", "active"
	}

};

module.exports = transforms;


