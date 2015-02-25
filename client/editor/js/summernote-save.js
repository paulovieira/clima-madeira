
Clima.summernoteOptions = {
    focus: true,
    // note: the div for each group of buttons will have the "note-toolbar-group" class (besides "btn-group")
    toolbar: [
        ['toolbar-group', ['style']],
        ['toolbar-group', ['bold', 'italic', 'underline', 'clear']],
        ['toolbar-group', ['fontname']],
        ['toolbar-group', ['color']],
        ['toolbar-group', ['ul', 'ol', 'paragraph']],
        ['toolbar-group', ['height']],
        ['toolbar-group', ['link', 'picture', 'hr']],
        ['toolbar-group', ['undo', 'redo',  'codeview']],
        ['toolbar-group', ['save']]
    ]
};

$('.is-editable').on("click", function(e){

    if(!!Clima.$currentOpenEditor){
        Clima.$currentOpenEditor.destroy();
        Clima.$currentOpenEditor = null;
    }

    var $target = $(e.target);
    $target.summernote(Clima.summernoteOptions);

    Clima.$currentOpenEditor = $target;
});

$("body").on("click", function(e){

	// if we click an editable element that is an anchor (or a children of an anchor), we must stop the default action
    if($(e.target).hasClass("is-editable")){
    	e.preventDefault();
        return;
    }

    // similar: if we have the editor already open and click inside it, and the editable text is an anchor (or a children of an anchor),
    // we must prevent the default action
    if($(e.target).parents(".note-editor").length > 0){
        e.preventDefault();
    }
    // otherwise, if we click outside the editor, close it!
	else{
		if(!!Clima.$currentOpenEditor){
	        Clima.$currentOpenEditor.destroy();
	        Clima.$currentOpenEditor = null;
		}
    }
});



$.summernote.addPlugin({

    buttons: { 
        save: function() {
        	var buttonHtml = "";

			buttonHtml += '<button type="button" style="padding-top: 5px; padding-bottom: 4px;" class="btn btn-default btn-sm btn-save" title="Save changes in the database" data-event="save-data" data-hide="true" tabindex="-1">';
			buttonHtml += '<i class="fa fa-floppy-o"></i>';
			buttonHtml += '<span style="font-size: 110%; padding: 0; margin-left: 7px;" class="btn-save-text">Save</span>';
			buttonHtml += '</button>';
		 	
		 	return buttonHtml;
        }
    },

    events: { 
        "save-data": function(event, editor, layoutInfo) {
			var $editorElem = $(event.target).closest(".note-editor");
            var $editableElem = $editorElem.prev();
//debugger;

            var textId = $editableElem.data("textId");
            var textObj = _.findWhere(Clima.texts, {
                id: textId
            });
            var newContents = {};

	        if (!textObj) {
	            throw new Error("text not found: ", textId);
	            return;
        	}

        	newContents[Clima.lang] = $editableElem.code();

	        var dataObj = {
	            id: textId,
	            contents: _.extend(textObj.contents, newContents),
	            tags: textObj.tags
	        };


            console.log(dataObj);

            $editorElem.find(".btn-save").prop('disabled', true);
            $editorElem.find(".btn-save-text").html("Saving...");
            
            //$editorElem.css("border-color", "green");
            alert("data was saved!");

            $editorElem.find(".btn-save").prop('disabled', false);
            $editorElem.find(".btn-save-text").html("Save");
        }
    }
});


// $('.is-editable').summernote({

// 	// note: the div for each group of buttons will have the "note-toolbar-group" class (besides "btn-group")
//     toolbar: [
//         ['toolbar-group', ['style']],
//         ['toolbar-group', ['bold', 'italic', 'underline', 'clear']],
//         ['toolbar-group', ['fontname']],
//         ['toolbar-group', ['color']],
//         ['toolbar-group', ['ul', 'ol', 'paragraph']],
//         ['toolbar-group', ['height']],
//         ['toolbar-group', ['link', 'picture', 'hr']],
//         ['toolbar-group', ['undo', 'redo',  'codeview']],
//         ['toolbar-group', ['save']]
//     ]
// });

