(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/pvieira/github/clima-madeira/client/dashboard2/index.js":[function(require,module,exports){








/*****************/

var leftMenuChannel = Backbone.Radio.channel('leftMenu');

var Dashboard = new Mn.Application();
Dashboard.$modal = $("#modal");

Dashboard.addRegions({
	mainRegion: "#main-region",
	modalRegion: "#modal-content-region"
});




var menuLeftC = new Backbone.Collection([
{
	panelCode: "profile",
	panelTitle: {pt: "Home", en: "Home"},
	panelIcon: "glyphicon-home",
	panelItems: [
		{
			itemCode: "profile",
			itemTitle: {pt: "Dados pessoais", en: "Personal data"},

		}
	]	

},

{
	panelCode: "texts",
	panelTitle: Clima.texts[12].contents,
	panelIcon: "glyphicon-font",
	panelItems: [
		{
			itemCode: "texts-all",
			itemTitle: Clima.texts[13].contents,

		},
		{
			itemCode: "texts-new",
			itemTitle: Clima.texts[14].contents,

		}
	]	

},

{
	panelCode: "users",
	panelTitle: {pt: "Utilizadores", en: "Users"},
	panelIcon: "glyphicon-user",
	panelItems: [
		{
			itemCode: "users-all",
			itemTitle: { pt: "Todos os utilizadores", en: "All users"},

		},
		{
			itemCode: "users-new",
			itemTitle: { pt: "Novo utilizador", en: "New user"},

		}
	]	
},


{
	panelCode: "groups",
	panelTitle: {pt: "Grupos", en: "Grups"},
	panelIcon: "glyphicon-user",
	panelItems: [
		{
			itemCode: "groups-all",
			itemTitle: { pt: "Todos os grupos", en: "All groups"},

		},
		{
			itemCode: "groups-new",
			itemTitle: { pt: "Novo grupo", en: "New group"},

		}
	]	
},

{
	panelCode: "files",
	panelTitle: {pt: "Ficheiros", en: "Files"},
	panelIcon: "glyphicon-folder-open",
	panelItems: [
		{
			itemCode: "files-all",
			itemTitle: { pt: "Todos os ficheiros", en: "All files"},

		},
		{
			itemCode: "files-new",
			itemTitle: { pt: "Novo ficheiro", en: "New file"},

		}
	]	
},
]);

menuLeftC.each(function(model){
	model.set("lang", Clima.lang);
});






// USERS
/*
var UserM = Backbone.Model.extend({

	url: "/api/users",

	initialize: function(){

	},


	parse: function(resp){
		if(_.isArray(resp)){ resp = resp[0]; }

		resp.createdAt = moment(resp.createdAt).format('YYYY-MM-DD HH:mm:ss');
		return resp;
	}
});

var UsersC = Backbone.Collection.extend({
	model: UserM,
	url: "/api/users",
});

var usersC = new UsersC();
*/


/*
var UserRowLV = Mn.LayoutView.extend({
	template: "users/templates/userRow.html",
	tagName: "tr",
});

var UsersTableCV = Mn.CompositeView.extend({
	template: "users/templates/usersTable.html",
	childView: UserRowLV,
	childViewContainer: "tbody",
	events: {
		"click button#update-users": "updateUsers"
	},
	updateUsers: function(){
		this.collection.save();
	}
});


var NewUserLV = Mn.LayoutView.extend({
	template: "users/templates/newUser.html",

	onBeforeDestroy: function(){
		debugger;
		this.model.trigger("auto:destroy");
//		delete this.model;
//		this.model
	},

	onRender: function(){
//		this.stickit();
	},

	events: {
		"click button#create-user": "createUser"
	},

	createUser: function(){
		Q(this.model.save()).then(
			function(val){
				debugger;
			},
			function(err){
				debugger;
			}
		);
	}
});
*/








// new version - using nunjucks instead of collectionView
var MenuLeftIV = Mn.ItemView.extend({
	template: "menuLeft/templates/panel.html",

	events: {
		"click .list-group-item": function(e){
			var $target   = $(e.target),
				$anchorEl = $target.is("span") ? $target.parent() : $target;

			$(".arrow-container").removeClass("glyphicon glyphicon-chevron-right");
			$anchorEl.find(".arrow-container").addClass("glyphicon glyphicon-chevron-right");

			leftMenuChannel.trigger("show:main:right", $anchorEl.data("listItem"));
		}
	}
});


// NESTING LEVEL 0

var MainLayout = Mn.LayoutView.extend({
	template: "mainLayout/templates/main-layout.html",
	initialize: function(){
		leftMenuChannel.on("show:main:right", this.showViewRight, this);
	},
	regions: {
		mainLeftRegion: "#main-left-region",
		mainRightRegion: "#main-right-region"
	},
	onBeforeShow: function(view, region){
//debugger;

		// var menuLeftGroupsCV = new MenuLeftGroupsCV({
		// 	collection: menuLeftC
		// });
		//this.mainLeftRegion.show(menuLeftGroupsCV);

		var menuLeftIV = new MenuLeftIV({
			collection: menuLeftC
		});
		this.mainLeftRegion.show(menuLeftIV);

		this.showViewRight("profile");
		setTimeout(function(){
			$(".panel-body").first().find(".arrow-container").addClass("glyphicon glyphicon-chevron-right");
		}, 5);
	},

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
			default:
				throw new Error("showViewRight: unknown code");
				break;
		}
	},

	showProfile: function(){
		var userM = new UserM();
		userM.set("id", Clima.userId);

		var profileLV = new ProfileLV({
			model: userM
		});

		var fulfilled = _.bind(
			function(){ 
				this.mainRightRegion.show(profileLV); 
			}, 
			this);

		Q(userM.fetch()).then(
			fulfilled, 
			function(err){
				debugger;
			}
		);
	},


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
debugger;
		var usersTableCV = new UsersTableCV({
			collection: usersC
		});

		var fulfilled = _.bind(
				function(){ 
					//console.log(textsC.toJSON()); 
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
});

var mainLayout = new MainLayout();

Dashboard.mainRegion.show(mainLayout);






},{}]},{},["/home/pvieira/github/clima-madeira/client/dashboard2/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5cblxuXG5cblxuXG5cbi8qKioqKioqKioqKioqKioqKi9cblxudmFyIGxlZnRNZW51Q2hhbm5lbCA9IEJhY2tib25lLlJhZGlvLmNoYW5uZWwoJ2xlZnRNZW51Jyk7XG5cbnZhciBEYXNoYm9hcmQgPSBuZXcgTW4uQXBwbGljYXRpb24oKTtcbkRhc2hib2FyZC4kbW9kYWwgPSAkKFwiI21vZGFsXCIpO1xuXG5EYXNoYm9hcmQuYWRkUmVnaW9ucyh7XG5cdG1haW5SZWdpb246IFwiI21haW4tcmVnaW9uXCIsXG5cdG1vZGFsUmVnaW9uOiBcIiNtb2RhbC1jb250ZW50LXJlZ2lvblwiXG59KTtcblxuXG5cblxudmFyIG1lbnVMZWZ0QyA9IG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKFtcbntcblx0cGFuZWxDb2RlOiBcInByb2ZpbGVcIixcblx0cGFuZWxUaXRsZToge3B0OiBcIkhvbWVcIiwgZW46IFwiSG9tZVwifSxcblx0cGFuZWxJY29uOiBcImdseXBoaWNvbi1ob21lXCIsXG5cdHBhbmVsSXRlbXM6IFtcblx0XHR7XG5cdFx0XHRpdGVtQ29kZTogXCJwcm9maWxlXCIsXG5cdFx0XHRpdGVtVGl0bGU6IHtwdDogXCJEYWRvcyBwZXNzb2Fpc1wiLCBlbjogXCJQZXJzb25hbCBkYXRhXCJ9LFxuXG5cdFx0fVxuXHRdXHRcblxufSxcblxue1xuXHRwYW5lbENvZGU6IFwidGV4dHNcIixcblx0cGFuZWxUaXRsZTogQ2xpbWEudGV4dHNbMTJdLmNvbnRlbnRzLFxuXHRwYW5lbEljb246IFwiZ2x5cGhpY29uLWZvbnRcIixcblx0cGFuZWxJdGVtczogW1xuXHRcdHtcblx0XHRcdGl0ZW1Db2RlOiBcInRleHRzLWFsbFwiLFxuXHRcdFx0aXRlbVRpdGxlOiBDbGltYS50ZXh0c1sxM10uY29udGVudHMsXG5cblx0XHR9LFxuXHRcdHtcblx0XHRcdGl0ZW1Db2RlOiBcInRleHRzLW5ld1wiLFxuXHRcdFx0aXRlbVRpdGxlOiBDbGltYS50ZXh0c1sxNF0uY29udGVudHMsXG5cblx0XHR9XG5cdF1cdFxuXG59LFxuXG57XG5cdHBhbmVsQ29kZTogXCJ1c2Vyc1wiLFxuXHRwYW5lbFRpdGxlOiB7cHQ6IFwiVXRpbGl6YWRvcmVzXCIsIGVuOiBcIlVzZXJzXCJ9LFxuXHRwYW5lbEljb246IFwiZ2x5cGhpY29uLXVzZXJcIixcblx0cGFuZWxJdGVtczogW1xuXHRcdHtcblx0XHRcdGl0ZW1Db2RlOiBcInVzZXJzLWFsbFwiLFxuXHRcdFx0aXRlbVRpdGxlOiB7IHB0OiBcIlRvZG9zIG9zIHV0aWxpemFkb3Jlc1wiLCBlbjogXCJBbGwgdXNlcnNcIn0sXG5cblx0XHR9LFxuXHRcdHtcblx0XHRcdGl0ZW1Db2RlOiBcInVzZXJzLW5ld1wiLFxuXHRcdFx0aXRlbVRpdGxlOiB7IHB0OiBcIk5vdm8gdXRpbGl6YWRvclwiLCBlbjogXCJOZXcgdXNlclwifSxcblxuXHRcdH1cblx0XVx0XG59LFxuXG5cbntcblx0cGFuZWxDb2RlOiBcImdyb3Vwc1wiLFxuXHRwYW5lbFRpdGxlOiB7cHQ6IFwiR3J1cG9zXCIsIGVuOiBcIkdydXBzXCJ9LFxuXHRwYW5lbEljb246IFwiZ2x5cGhpY29uLXVzZXJcIixcblx0cGFuZWxJdGVtczogW1xuXHRcdHtcblx0XHRcdGl0ZW1Db2RlOiBcImdyb3Vwcy1hbGxcIixcblx0XHRcdGl0ZW1UaXRsZTogeyBwdDogXCJUb2RvcyBvcyBncnVwb3NcIiwgZW46IFwiQWxsIGdyb3Vwc1wifSxcblxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0aXRlbUNvZGU6IFwiZ3JvdXBzLW5ld1wiLFxuXHRcdFx0aXRlbVRpdGxlOiB7IHB0OiBcIk5vdm8gZ3J1cG9cIiwgZW46IFwiTmV3IGdyb3VwXCJ9LFxuXG5cdFx0fVxuXHRdXHRcbn0sXG5cbntcblx0cGFuZWxDb2RlOiBcImZpbGVzXCIsXG5cdHBhbmVsVGl0bGU6IHtwdDogXCJGaWNoZWlyb3NcIiwgZW46IFwiRmlsZXNcIn0sXG5cdHBhbmVsSWNvbjogXCJnbHlwaGljb24tZm9sZGVyLW9wZW5cIixcblx0cGFuZWxJdGVtczogW1xuXHRcdHtcblx0XHRcdGl0ZW1Db2RlOiBcImZpbGVzLWFsbFwiLFxuXHRcdFx0aXRlbVRpdGxlOiB7IHB0OiBcIlRvZG9zIG9zIGZpY2hlaXJvc1wiLCBlbjogXCJBbGwgZmlsZXNcIn0sXG5cblx0XHR9LFxuXHRcdHtcblx0XHRcdGl0ZW1Db2RlOiBcImZpbGVzLW5ld1wiLFxuXHRcdFx0aXRlbVRpdGxlOiB7IHB0OiBcIk5vdm8gZmljaGVpcm9cIiwgZW46IFwiTmV3IGZpbGVcIn0sXG5cblx0XHR9XG5cdF1cdFxufSxcbl0pO1xuXG5tZW51TGVmdEMuZWFjaChmdW5jdGlvbihtb2RlbCl7XG5cdG1vZGVsLnNldChcImxhbmdcIiwgQ2xpbWEubGFuZyk7XG59KTtcblxuXG5cblxuXG5cbi8vIFVTRVJTXG4vKlxudmFyIFVzZXJNID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcblxuXHR1cmw6IFwiL2FwaS91c2Vyc1wiLFxuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG5cblx0fSxcblxuXG5cdHBhcnNlOiBmdW5jdGlvbihyZXNwKXtcblx0XHRpZihfLmlzQXJyYXkocmVzcCkpeyByZXNwID0gcmVzcFswXTsgfVxuXG5cdFx0cmVzcC5jcmVhdGVkQXQgPSBtb21lbnQocmVzcC5jcmVhdGVkQXQpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpO1xuXHRcdHJldHVybiByZXNwO1xuXHR9XG59KTtcblxudmFyIFVzZXJzQyA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcblx0bW9kZWw6IFVzZXJNLFxuXHR1cmw6IFwiL2FwaS91c2Vyc1wiLFxufSk7XG5cbnZhciB1c2Vyc0MgPSBuZXcgVXNlcnNDKCk7XG4qL1xuXG5cbi8qXG52YXIgVXNlclJvd0xWID0gTW4uTGF5b3V0Vmlldy5leHRlbmQoe1xuXHR0ZW1wbGF0ZTogXCJ1c2Vycy90ZW1wbGF0ZXMvdXNlclJvdy5odG1sXCIsXG5cdHRhZ05hbWU6IFwidHJcIixcbn0pO1xuXG52YXIgVXNlcnNUYWJsZUNWID0gTW4uQ29tcG9zaXRlVmlldy5leHRlbmQoe1xuXHR0ZW1wbGF0ZTogXCJ1c2Vycy90ZW1wbGF0ZXMvdXNlcnNUYWJsZS5odG1sXCIsXG5cdGNoaWxkVmlldzogVXNlclJvd0xWLFxuXHRjaGlsZFZpZXdDb250YWluZXI6IFwidGJvZHlcIixcblx0ZXZlbnRzOiB7XG5cdFx0XCJjbGljayBidXR0b24jdXBkYXRlLXVzZXJzXCI6IFwidXBkYXRlVXNlcnNcIlxuXHR9LFxuXHR1cGRhdGVVc2VyczogZnVuY3Rpb24oKXtcblx0XHR0aGlzLmNvbGxlY3Rpb24uc2F2ZSgpO1xuXHR9XG59KTtcblxuXG52YXIgTmV3VXNlckxWID0gTW4uTGF5b3V0Vmlldy5leHRlbmQoe1xuXHR0ZW1wbGF0ZTogXCJ1c2Vycy90ZW1wbGF0ZXMvbmV3VXNlci5odG1sXCIsXG5cblx0b25CZWZvcmVEZXN0cm95OiBmdW5jdGlvbigpe1xuXHRcdGRlYnVnZ2VyO1xuXHRcdHRoaXMubW9kZWwudHJpZ2dlcihcImF1dG86ZGVzdHJveVwiKTtcbi8vXHRcdGRlbGV0ZSB0aGlzLm1vZGVsO1xuLy9cdFx0dGhpcy5tb2RlbFxuXHR9LFxuXG5cdG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuLy9cdFx0dGhpcy5zdGlja2l0KCk7XG5cdH0sXG5cblx0ZXZlbnRzOiB7XG5cdFx0XCJjbGljayBidXR0b24jY3JlYXRlLXVzZXJcIjogXCJjcmVhdGVVc2VyXCJcblx0fSxcblxuXHRjcmVhdGVVc2VyOiBmdW5jdGlvbigpe1xuXHRcdFEodGhpcy5tb2RlbC5zYXZlKCkpLnRoZW4oXG5cdFx0XHRmdW5jdGlvbih2YWwpe1xuXHRcdFx0XHRkZWJ1Z2dlcjtcblx0XHRcdH0sXG5cdFx0XHRmdW5jdGlvbihlcnIpe1xuXHRcdFx0XHRkZWJ1Z2dlcjtcblx0XHRcdH1cblx0XHQpO1xuXHR9XG59KTtcbiovXG5cblxuXG5cblxuXG5cblxuLy8gbmV3IHZlcnNpb24gLSB1c2luZyBudW5qdWNrcyBpbnN0ZWFkIG9mIGNvbGxlY3Rpb25WaWV3XG52YXIgTWVudUxlZnRJViA9IE1uLkl0ZW1WaWV3LmV4dGVuZCh7XG5cdHRlbXBsYXRlOiBcIm1lbnVMZWZ0L3RlbXBsYXRlcy9wYW5lbC5odG1sXCIsXG5cblx0ZXZlbnRzOiB7XG5cdFx0XCJjbGljayAubGlzdC1ncm91cC1pdGVtXCI6IGZ1bmN0aW9uKGUpe1xuXHRcdFx0dmFyICR0YXJnZXQgICA9ICQoZS50YXJnZXQpLFxuXHRcdFx0XHQkYW5jaG9yRWwgPSAkdGFyZ2V0LmlzKFwic3BhblwiKSA/ICR0YXJnZXQucGFyZW50KCkgOiAkdGFyZ2V0O1xuXG5cdFx0XHQkKFwiLmFycm93LWNvbnRhaW5lclwiKS5yZW1vdmVDbGFzcyhcImdseXBoaWNvbiBnbHlwaGljb24tY2hldnJvbi1yaWdodFwiKTtcblx0XHRcdCRhbmNob3JFbC5maW5kKFwiLmFycm93LWNvbnRhaW5lclwiKS5hZGRDbGFzcyhcImdseXBoaWNvbiBnbHlwaGljb24tY2hldnJvbi1yaWdodFwiKTtcblxuXHRcdFx0bGVmdE1lbnVDaGFubmVsLnRyaWdnZXIoXCJzaG93Om1haW46cmlnaHRcIiwgJGFuY2hvckVsLmRhdGEoXCJsaXN0SXRlbVwiKSk7XG5cdFx0fVxuXHR9XG59KTtcblxuXG4vLyBORVNUSU5HIExFVkVMIDBcblxudmFyIE1haW5MYXlvdXQgPSBNbi5MYXlvdXRWaWV3LmV4dGVuZCh7XG5cdHRlbXBsYXRlOiBcIm1haW5MYXlvdXQvdGVtcGxhdGVzL21haW4tbGF5b3V0Lmh0bWxcIixcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcblx0XHRsZWZ0TWVudUNoYW5uZWwub24oXCJzaG93Om1haW46cmlnaHRcIiwgdGhpcy5zaG93Vmlld1JpZ2h0LCB0aGlzKTtcblx0fSxcblx0cmVnaW9uczoge1xuXHRcdG1haW5MZWZ0UmVnaW9uOiBcIiNtYWluLWxlZnQtcmVnaW9uXCIsXG5cdFx0bWFpblJpZ2h0UmVnaW9uOiBcIiNtYWluLXJpZ2h0LXJlZ2lvblwiXG5cdH0sXG5cdG9uQmVmb3JlU2hvdzogZnVuY3Rpb24odmlldywgcmVnaW9uKXtcbi8vZGVidWdnZXI7XG5cblx0XHQvLyB2YXIgbWVudUxlZnRHcm91cHNDViA9IG5ldyBNZW51TGVmdEdyb3Vwc0NWKHtcblx0XHQvLyBcdGNvbGxlY3Rpb246IG1lbnVMZWZ0Q1xuXHRcdC8vIH0pO1xuXHRcdC8vdGhpcy5tYWluTGVmdFJlZ2lvbi5zaG93KG1lbnVMZWZ0R3JvdXBzQ1YpO1xuXG5cdFx0dmFyIG1lbnVMZWZ0SVYgPSBuZXcgTWVudUxlZnRJVih7XG5cdFx0XHRjb2xsZWN0aW9uOiBtZW51TGVmdENcblx0XHR9KTtcblx0XHR0aGlzLm1haW5MZWZ0UmVnaW9uLnNob3cobWVudUxlZnRJVik7XG5cblx0XHR0aGlzLnNob3dWaWV3UmlnaHQoXCJwcm9maWxlXCIpO1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdCQoXCIucGFuZWwtYm9keVwiKS5maXJzdCgpLmZpbmQoXCIuYXJyb3ctY29udGFpbmVyXCIpLmFkZENsYXNzKFwiZ2x5cGhpY29uIGdseXBoaWNvbi1jaGV2cm9uLXJpZ2h0XCIpO1xuXHRcdH0sIDUpO1xuXHR9LFxuXG5cdHNob3dWaWV3UmlnaHQ6IGZ1bmN0aW9uKGNvZGUpe1xuXHRcdHN3aXRjaChjb2RlKXtcblx0XHRcdGNhc2UgXCJwcm9maWxlXCI6XG5cdFx0XHRcdHRoaXMuc2hvd1Byb2ZpbGUoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwidGV4dHMtYWxsXCI6XG5cdFx0XHRcdHRoaXMuc2hvd0FsbFRleHRzKCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInRleHRzLW5ld1wiOlxuXHRcdFx0XHR0aGlzLnNob3dUZXh0TmV3KCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInVzZXJzLWFsbFwiOlxuXHRcdFx0XHR0aGlzLnNob3dBbGxVc2VycygpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJ1c2Vycy1uZXdcIjpcblx0XHRcdFx0dGhpcy5zaG93TmV3VXNlcigpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcInNob3dWaWV3UmlnaHQ6IHVua25vd24gY29kZVwiKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9LFxuXG5cdHNob3dQcm9maWxlOiBmdW5jdGlvbigpe1xuXHRcdHZhciB1c2VyTSA9IG5ldyBVc2VyTSgpO1xuXHRcdHVzZXJNLnNldChcImlkXCIsIENsaW1hLnVzZXJJZCk7XG5cblx0XHR2YXIgcHJvZmlsZUxWID0gbmV3IFByb2ZpbGVMVih7XG5cdFx0XHRtb2RlbDogdXNlck1cblx0XHR9KTtcblxuXHRcdHZhciBmdWxmaWxsZWQgPSBfLmJpbmQoXG5cdFx0XHRmdW5jdGlvbigpeyBcblx0XHRcdFx0dGhpcy5tYWluUmlnaHRSZWdpb24uc2hvdyhwcm9maWxlTFYpOyBcblx0XHRcdH0sIFxuXHRcdFx0dGhpcyk7XG5cblx0XHRRKHVzZXJNLmZldGNoKCkpLnRoZW4oXG5cdFx0XHRmdWxmaWxsZWQsIFxuXHRcdFx0ZnVuY3Rpb24oZXJyKXtcblx0XHRcdFx0ZGVidWdnZXI7XG5cdFx0XHR9XG5cdFx0KTtcblx0fSxcblxuXG5cdHNob3dBbGxUZXh0czogZnVuY3Rpb24oKXtcblxuXHRcdHZhciB0ZXh0c1RhYmxlQ1YgPSBuZXcgVGV4dHNUYWJsZUNWKHtcblx0XHRcdGNvbGxlY3Rpb246IHRleHRzQ1xuXHRcdH0pO1xuXG5cdFx0dmFyIGZ1bGZpbGxlZCA9IF8uYmluZChcblx0XHRcdGZ1bmN0aW9uKCl7IFxuXHRcdFx0XHR0aGlzLm1haW5SaWdodFJlZ2lvbi5zaG93KHRleHRzVGFibGVDVik7IFxuXHRcdFx0fSwgXG5cdFx0XHR0aGlzKTtcblxuXHRcdFEodGV4dHNDLmZldGNoKCkpLnRoZW4oXG5cdFx0XHRmdWxmaWxsZWQsIFxuXHRcdFx0ZnVuY3Rpb24oZXJyKXtcblx0XHRcdFx0ZGVidWdnZXI7XG5cdFx0XHR9XG5cdFx0KTtcblx0fSxcblxuXHRzaG93VGV4dE5ldzogZnVuY3Rpb24oKXtcblxuXHRcdHZhciB0ZXh0TSA9IG5ldyBUZXh0TSgpO1xuXHRcdHZhciB0ZXh0TmV3TFYgPSBuZXcgVGV4dE5ld0xWKHtcblx0XHRcdG1vZGVsOiB0ZXh0TVxuXHRcdH0pO1xuXHRcdHRoaXMubWFpblJpZ2h0UmVnaW9uLnNob3codGV4dE5ld0xWKTsgXG5cdH0sXG5cblx0c2hvd0FsbFVzZXJzOiBmdW5jdGlvbigpe1xuZGVidWdnZXI7XG5cdFx0dmFyIHVzZXJzVGFibGVDViA9IG5ldyBVc2Vyc1RhYmxlQ1Yoe1xuXHRcdFx0Y29sbGVjdGlvbjogdXNlcnNDXG5cdFx0fSk7XG5cblx0XHR2YXIgZnVsZmlsbGVkID0gXy5iaW5kKFxuXHRcdFx0XHRmdW5jdGlvbigpeyBcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHRleHRzQy50b0pTT04oKSk7IFxuXHRcdFx0XHRcdHRoaXMubWFpblJpZ2h0UmVnaW9uLnNob3codXNlcnNUYWJsZUNWKTsgXG5cdFx0XHRcdH0sIFxuXHRcdFx0dGhpcyk7XG5cblx0XHRRKHVzZXJzQy5mZXRjaCgpKS50aGVuKFxuXHRcdFx0ZnVsZmlsbGVkLCBcblx0XHRcdGZ1bmN0aW9uKGVycil7XG5cdFx0XHRcdGRlYnVnZ2VyO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH0sXG5cblx0c2hvd05ld1VzZXI6IGZ1bmN0aW9uKCl7XG5cdFx0ZGVidWdnZXI7XG5cblx0XHR2YXIgdXNlck0gPSBuZXcgVXNlck0oKTtcblx0XHR2YXIgbmV3VXNlckxWID0gbmV3IE5ld1VzZXJMVih7XG5cdFx0XHRtb2RlbDogdXNlck1cblx0XHR9KTtcblx0XHR0aGlzLm1haW5SaWdodFJlZ2lvbi5zaG93KG5ld1VzZXJMVik7IFxuXHR9LFxufSk7XG5cbnZhciBtYWluTGF5b3V0ID0gbmV3IE1haW5MYXlvdXQoKTtcblxuRGFzaGJvYXJkLm1haW5SZWdpb24uc2hvdyhtYWluTGF5b3V0KTtcblxuXG5cblxuXG4iXX0=
