var leftMenuChannel = Backbone.Radio.channel('leftMenu');

var Dashboard = new Mn.Application();
Dashboard.$modal1 = $("#modal-1");
Dashboard.$modal2 = $("#modal-2");

Dashboard.addRegions({
	mainRegion: "#main-region",
	modal1Region: "#modal1-content-region",
	modal2Region: "#modal2-content-region"
});

var mainLayout = new MainLayout();

Dashboard.mainRegion.show(mainLayout);


