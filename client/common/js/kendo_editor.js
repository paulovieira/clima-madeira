
// if the is-editable span is a child of an anchor element, we must prevent the browser from making the
// GET request for that page (that is, deactivate the links)
$(".is-editable").on("click", function(e) {
    e.preventDefault();
});

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
            exec: function() {
                debugger;

                var editor = $(this).data("kendoEditor"),
                    textId = $(this).data("textId"),
                    textObj = _.findWhere(Clima.texts, {
                        id: textId
                    }),
                    newContents = {};

                if (!textObj) {
                    alert("Text not found.")
                    exit;
                };


                // don't use $.trim() here because what we get is an html entity ("&nbsp;"), and not
                // an actual space; the trimming is done in the server, after the decoding of the entities
                newContents[Clima.lang] = editor.value();

                var dataObj = {
                    id: textId,
                    contents: _.extend(textObj.contents, newContents )
                };

                Clima.$currentEl = $(this);

                var url = "/api/texts/" + textId;
                Q(
                    $.ajax({
                        url: url,
                        type: "PUT",
                        data: dataObj
                    })
                )
                    .done(
                        function(val) {
                            debugger;
                            Clima.$currentEl.css("border-color", "#00cd00");
                        },
                        function(err) {
                            debugger;
                            //Clima.$currentEl.css("border-color", "red");
                            alert("ERROR: text not saved");
                        }
                );

            },

        },
    ]
});