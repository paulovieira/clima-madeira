var MainLayout = Mn.LayoutView.extend({
	template: "main-layout/templates/main-layout.html",
	initialize: function(){
		leftMenuChannel.on("show:main:right", this.showViewRight, this);
	},
	regions: {
		mainLeftRegion: "#main-left-region",
		mainRightRegion: "#main-right-region"
	},
	onBeforeShow: function(view, region){
//debugger;


		var menuLeftIV = new MenuLeftIV({
			collection: menuLeftC
		});
		this.mainLeftRegion.show(menuLeftIV);
/*
		this.showViewRight("profile");
		setTimeout(function(){
			$(".panel-body").first().find(".arrow-container").addClass("glyphicon glyphicon-chevron-right");
		}, 5);
*/
	},

	showViewRight: function(code){

		switch(code){
			case "#profile":
				this.showProfile();
				break;
			case "#texts":
				this.showTexts();
				break;
			default:
				throw new Error("showViewRight: unknown code");
				break;
		}
	},


/*
	showViewRight: function(code){

		switch(code){
			case "profile":
				this.showProfile();
				break;
			case "texts-all":
				this.showAllTexts();
				break;
			case "texts-new":
				this.showTextNew();
				break;
			case "users-all":
				this.showAllUsers();
				break;
			case "users-new":
				this.showNewUser();
				break;
			case "files-all":
				this.showAllFiles();
				break;
			case "files-new":
				this.showNewFile();
				break;
			case "maps-all":
				this.showAllMaps();
				break;
			case "maps-new":
				this.showNewMap();
				break;
			default:
				throw new Error("showViewRight: unknown code");
				break;
		}
	},
*/
	showProfile: function(){
		var userM = new UserM();
		userM.set("id", Clima.userId);

		var profileLV = new ProfileLV({
			model: userM
		});

		var self = this;

		Q(userM.fetch())
			.then(
				function(){ 
					self.mainRightRegion.show(profileLV); 
				}, 
				function(jqXHR){
					var msg = jqXHR.responseJSON.message;
					alert("ERROR: " + msg);
					throw new Error(msg);
				}
			)
			.done();
	},

	showTexts: function(){

		var textsTab = new TextsTabLV();
		this.mainRightRegion.show(textsTab);

		// var textsTableCV = new TextsTableCV({
		// 	collection: textsC
		// });

		// var fulfilled = _.bind(
		// 	function(){ 
		// 		this.mainRightRegion.show(textsTableCV); 
		// 	}, 
		// 	this);

		// Q(textsC.fetch()).then(
		// 	fulfilled, 
		// 	function(err){
		// 		debugger;
		// 	}
		// );
	},

/*
	showAllTexts: function(){

		var textsTableCV = new TextsTableCV({
			collection: textsC
		});

		var fulfilled = _.bind(
			function(){ 
				this.mainRightRegion.show(textsTableCV); 
			}, 
			this);

		Q(textsC.fetch()).then(
			fulfilled, 
			function(err){
				debugger;
			}
		);
	},

	showTextNew: function(){

		var textM = new TextM();
		var textNewLV = new TextNewLV({
			model: textM
		});
		this.mainRightRegion.show(textNewLV); 
	},

	showAllUsers: function(){
		var usersTableCV = new UsersTableCV({
			collection: usersC
		});

		var fulfilled = _.bind(
				function(){ 
					this.mainRightRegion.show(usersTableCV); 
				}, 
			this);

		Q(usersC.fetch()).then(
			fulfilled, 
			function(err){
				debugger;
			}
		);
	},

	showNewUser: function(){
		debugger;

		var userM = new UserM();
		var newUserLV = new NewUserLV({
			model: userM
		});
		this.mainRightRegion.show(newUserLV); 
	},

	showAllFiles: function(){
		var filesTableCV = new FilesTableCV({
			collection: filesC
		});

		var fulfilled = _.bind(
				function(){ 
					this.mainRightRegion.show(filesTableCV); 
				}, 
			this);

		Q(filesC.fetch()).done(
			fulfilled, 
			function(err){
				debugger;
			}
		);
	},

	showNewFile: function(){

		var fileM = new FileM();
		var fileNewLV = new FileNewLV({
			model: fileM
		});
		this.mainRightRegion.show(fileNewLV); 
	},

	showAllMaps: function(){
		var mapsTableCV = new MapsListTableCV({
			collection: mapsC
		});

		var fulfilled = _.bind(
				function(){ 

					var mapCategories = textsC.filter(function(model){
						return _.contains(model.get("tags"), "map_category");
					});

					mapsC.each(function(model){
						model.set("mapCategories", new Backbone.Collection(mapCategories).toJSON());
					});

					this.mainRightRegion.show(mapsTableCV); 
				}, 
			this);


		Q.all([mapsC.fetch(), textsC.fetch()])
			.then(fulfilled)
			.done(undefined, 
				function(err){
					alert("ERROR: could not retrieve data from the server.")
					throw err;
				}
			);


		// Q(mapsC.fetch()).done(
		// 	fulfilled, 
		// 	function(err){
		// 		debugger;
		// 	}
		// );
	},

	showNewMap: function(){
		var mapsListNewTableCV = new MapsListNewTableCV({
			collection: filesC,
			filter: function(child, index, collection) {
				return _.contains(child.get("tags"), "map") || 
						_.contains(child.get("tags"), "maps") ||
						_.contains(child.get("tags"), "mapa") ||
						_.contains(child.get("tags"), "mapas") ||
						_.contains(child.get("tags"), "shape") ||
						_.contains(child.get("tags"), "shapes");
			}

		});

		var fulfilled = _.bind(
				function(){
					//debugger;
					var mapCategories = textsC.filter(function(model){
						// if(_.contains(model.get("tags"), "map_category")){
						// 	return true;
						// }
						// return false;

						return _.contains(model.get("tags"), "map_category");
					});

					filesC.each(function(model){
						model.set("mapCategories", new Backbone.Collection(mapCategories).toJSON());
					});

					this.mainRightRegion.show(mapsListNewTableCV);
				}, 
			this);

		Q.all([filesC.fetch(), textsC.fetch(), mapsC.fetch()])
			.then(fulfilled)
			.done(undefined, 
				function(err){
					alert("ERROR: could not retrieve data from the server.")
					throw err;
				}
			);

	},
*/

});
