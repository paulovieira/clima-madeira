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
