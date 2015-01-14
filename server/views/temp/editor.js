
    $("#topEditor").kendoEditor({
        tools: [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "justifyLeft",
            "justifyCenter",
            "justifyRight",
            "justifyFull",
            "createLink",
            "unlink",
            "insertImage",
            "createTable",
            "addColumnLeft",
            "addColumnRight",
            "addRowAbove",
            "addRowBelow",
            "deleteRow",
            "deleteColumn",
            "foreColor",
            "backColor"
        ]
    });

    var topEditor = $("#topEditor").data("kendoEditor");



    $(".column").kendoEditor({
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

//    var columnEditor = $(".column").data("kendoEditor");

console.log(Date());