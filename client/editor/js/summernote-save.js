
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
        ['toolbar-group', ['save']],
        ['toolbar-group', ['close']]
    ]
};

$('.is-editable').on("click", function(e){
//debugger;
    // if(!!Clima.$currentOpenEditor){
    //     Clima.$currentOpenEditor.destroy();
    //     Clima.$currentOpenEditor = null;
    // }

    var $target = $(e.target);
    //var h = $target.closest(".is-editable").html();
    //console.log("html: ", h);

    $target.closest(".is-editable").summernote(Clima.summernoteOptions);
	e.preventDefault();
//    Clima.$currentOpenEditor = $target;
});

$("body").on("click", ".note-editor", function(e){
//debugger;

	$target = $(e.target);

	if(!$target.hasClass("note-image-input")){
		e.preventDefault();
     }
//        return;

	// // if we click an editable element that is an anchor (or a children of an anchor), we must stop the default action
 //    if($(e.target).hasClass("is-editable")){
 //    	e.preventDefault();
 //        return;
 //    }

    

 //    // similar: if we have the editor already open and click inside it, and the editable text is an anchor (or a children of an anchor),
 //    // we must prevent the default action; but if the click is in the modal, it should propagate normally;
 //    //var $editable = $(e.target).parents(".note-editor");

 //    //if($editable.length > 0){
	// if($(e.target).hasClass("note-editable") || $(e.target).hasClass("btn-close-editor")){

 //        	e.preventDefault();

 //    }
 //    // otherwise, if we click outside the editor, close it!
	// // else{
	// // 	if(!!Clima.$currentOpenEditor){
	// //         Clima.$currentOpenEditor.destroy();
	// //         Clima.$currentOpenEditor = null;
	// // 	}
 // //    }
  	//e.stopPropagation();
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
        },

        close: function() {
        	var buttonHtml = "";

			buttonHtml += '<button type="button" style="padding-top: 5px; padding-bottom: 4px;" class="btn btn-default btn-sm btn-close" title="Close editor" data-event="close-editor" data-hide="true" tabindex="-1">';
			buttonHtml += '<i class="fa fa-times"></i>';
			buttonHtml += '<span style="font-size: 110%; padding: 0; margin-left: 7px;" class="btn-close-editor">Close</span>';
			buttonHtml += '</button>';
		 	
		 	return buttonHtml;
        }
    },

    events: { 
        "save-data": function(event, editor, layoutInfo) {
			var $editorElem = $(event.target).closest(".note-editor");
            var $editableElem = $editorElem.prev();


            var textId = $editableElem.data("textId");
            var textObj = _.findWhere(Clima.texts, {
                id: textId
            });
            var newContents = {};

	        if (!textObj) {
	            throw new Error("text not found: ", textId);
        	}

        	newContents[Clima.lang] = $editableElem.code();

	        var dataObj = {
	            id: textId,
	            contents: _.extend(textObj.contents, newContents),
	            //tags: textObj.tags
	            tags: []
	        };


            console.log(dataObj);
//debugger;
            $editorElem.find(".btn-save").prop('disabled', true);
            $editorElem.find(".btn-save-text").html("Saving...");

            var msg = "";
	        Q(
                $.ajax({
                    url: "/api/texts/" + textId,
                    type: "PUT",
                    data: dataObj
                })
            )
            .delay(400)
            .done(
                function(val) {
                	msg = Clima.lang === "pt" ? "As alterações foram gravadas com sucesso." : "Changes were successfully saved.";
                	alert(msg);

		            $editorElem.find(".btn-save").prop('disabled', false);
		            $editorElem.find(".btn-save-text").html("Save");                	
                },
                function(err) {
                	msg = Clima.lang === "pt" ? "ERRO: as alterações ao texto não foram gravadas." : "ERRO: changes to the text were not saved.";
                	alert(msg);

		            $editorElem.find(".btn-save").prop('disabled', false);
		            $editorElem.find(".btn-save-text").html("Save");
                }
            );

            


        },

        "close-editor": function(event, editor, layoutInfo) {
//        	debugger;
			var $editableElem = $(event.target).closest(".note-editor").prev();
			$editableElem.destroy();

			event.preventDefault();
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

