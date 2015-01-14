
    $(".is-editable").kendoEditor({
        tools: [
            "bold",
            "italic",
            "underline",
            "createLink",
            "unlink",
            "insertImage",
            "foreColor",
            "backColor",
            "viewHtml",

    		{ 
				name: "custom3", 
				//template: "<button class='k-button k-toolx'>view html</button>",
				template: '<a href="" role="button" class="k-tool k-group-start k-group-end" unselectable="on"><span>Save</span></a>',
				exec: function(e){
					//debugger;
					var editor = $(this).data("kendoEditor");
					var str = editor.value();
					console.log(JSON.stringify(str));
				}
    		},
        ]
    });







