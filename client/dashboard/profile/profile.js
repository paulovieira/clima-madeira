var UserM = Backbone.Model.extend({
	urlRoot: "/api/users",
	defaults: {
		"firstName": "",
		"lastName": "",
		"email": ""
	},
	initialize: function(){
	},
	parse: function(resp){
		if(_.isArray(resp)){ resp = resp[0]; }
//debugger;

		return resp;
	}
});


var ProfileLV = Mn.LayoutView.extend({
	template: "profile/templates/profile.html",

	ui: {
		saveBtn: "button.js-save",
		changePwBtn: "button.js-change-pw"
	},

	events: {
		"click @ui.saveBtn": "updateProfile",
		"click @ui.changePwBtn": "changePw"
	},

	updateProfile: function(){
debugger;
		var data = Backbone.Syphon.serialize(this);
		this.model.set(data);
		this.model.set("updateProfile", true);
	
		//this.ui.saveBtn.prop("disabled", true);
		Q(this.model.save()).then(
			function(data){
//				debugger;
				alert("Os dados foram actualizados com sucesso.");
				//this.ui.saveBtn.prop("disabled", false);
			},
			function(err){
//				debugger;
				alert("ERRO: os dados não foram actualizados.");
			}
		);
	},

	changePw: function(){

		var newPw     = $.trim(this.$("#js-personal-new-pw").val()    ),
			newPw2    = $.trim(this.$("#js-personal-new-pw-2").val()  ),
			currentPw = $.trim(this.$("#js-personal-current-pw").val());

		if(!currentPw){
			alert("Por favor insira a sua password actual.");
			return;			
		}
		if(newPw !== newPw2){
			alert("A nova password não é igual nos dois campos. Por favor tente novamente.");
			return;
		}

		this.model.set({
			currentPw: currentPw,
			newPw: newPw,
			updateProfile: true
		});

		Q(this.model.save()).then(
			function(data){
//				debugger;
				alert("Os dados foram actualizados com sucesso.");
				
			},
			function(err){
//				debugger;
				alert("ERRO: os dados não foram actualizados.");
			}
		);

		this.model.unset("currentPw", {silent: true});
		this.model.unset("newPw", {silent: true});
		debugger;
	}
});
