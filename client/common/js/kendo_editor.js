  // custom tool for the editor bar
var saveTool = {
    name: "save",

    //template: "<button class='k-button k-toolx'>view html</button>",
    template: '<a href style="padding: 0px 15px; color: black; text-decoration: none;" role="button" class="k-tool k-group-start k-group-end" unselectable="on" title="Save this text">' +
        '<span unselectable="on">Save</span>' +
        ' </a>',

      exec: function() {
        debugger;

            var editor = $(this).data("kendoEditor"),
                textId = $(this).data("textId"),
                textObj = _.findWhere(Clima.texts, {
                    id: textId
                }),
                newContents = {};

        if (!textObj) {
            alert("ERROR: Text not found.")
            exit;        };


        // don't use $.trim() here because what we get is an html entity ("&nbsp;"), and not
        // an actual space; the trimming is done in the server, after the decoding of the entities
        newContents[Clima.lang] = editor.value().trim();

        var dataObj = {
            id: textId,
            contents: _.extend(textObj.contents, newContents),
            tags: textObj.tags
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
                    Clima.$currentEl.css("border-color", "red");
                    alert("ERROR: text not saved.");
                }
            );

    }

};

// if the is-editable span is a child of an anchor element, we must prevent the browser from making the
// GET request for that page (that is, deactivate the links)
$(".is-editable").on("click", function(e) {
    e.preventDefault();
});

$(".is-editable").kendoEditor({
    encoded: false,
    serialization: {
        entities: false
    },
    tools: [
        "bold",
        "italic",
        "underline",
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "justifyFull",
        "insertUnorderedList",
        "insertOrderedList",
        "createLink",
        "unlink",
        "insertImage",
        "subscript",
        "superscript",
        "formatting",
        "viewHtml",
        "cleanFormatting",
        "foreColor",
        "backColor",
        saveTool
        //{ name: "save"}
    ]
});

// force the width of the toolbar of the editor
$(".editorToolbarWindow").parent().css("width", "500px");
