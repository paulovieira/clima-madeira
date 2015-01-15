
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
                 serialization: {
                    entities: false
                  },
				//template: "<button class='k-button k-toolx'>view html</button>",
				template: '<a href="" role="button" class="k-tool k-group-start k-group-end" unselectable="on"><span>Save</span></a>',
				exec: function(e){
					//debugger;
					var editor = $(this).data("kendoEditor");

					console.log(JSON.stringify(editor.value()));
                    var textId = $(this).data("id");

                    var dataObj = {
                        id: textId, 
                        contents: {}
                    };

                    dataObj.contents[Clima.lang] = editor.value();
//                    debugger;
// {en: "Climate and Climate Scenarios Observatory", pt: "Observatório de Clima e Cenários Climáticos"}

/*
// TODO: in texts_update, create a pre function that will do the following
1) read the texts with the given ids from the db
2) for each text in the payload, verify if some language is missing
3) if so, copy the text of that language from the current text in the db (_.extend?)

*/
                    Q($.ajax({
                                url: "/api/texts/" + textId,
                                type: "PUT",
                                data: dataObj
                            }))
                        .done(function(val){
                            console.log(val);
                        },
                        function(err){
                            console.log(err);
                        })

				},

    		},
        ]
    });


    var editor2 = $(".is-editable").data("kendoEditor");
    editor2.body.style.backgroundColor = "transparent";
    editor2.body.style.borderStyle = "dashed";
    editor2.body.style.borderColor = "#191919";
    editor2.body.style.borderRadius = "10px";


    





