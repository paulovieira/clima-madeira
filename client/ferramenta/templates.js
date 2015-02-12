(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["contextMenu/templates/base-layers.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<h5><b>Base layer</b></h5>\n\n\n\n<div class=\"panel panel-default\" style=\"padding: 0;\">\n    <div class=\"panel-heading\">\n        <b>Simple</b>\n    </div>\n    <div class=\"panel-body\" style=\"padding: 0;\">\n        <div class=\"list-group\" style=\"margin: 0;\">\n            <a href=\"#\" class=\"list-group-item\" style=\"border-radius: 0; border-left: none;\">Hydda Base</a>\n            <a href=\"#\" class=\"list-group-item active\" style=\"border-radius: 0; border-left: none;\">Esri World Shaded Relief</a>\n            <a href=\"#\" class=\"list-group-item\" style=\"border-radius: 0; border-left: none;\">OSM Grayscale</a>\n        </div>\n    </div>\n</div>\n\n<div class=\"panel panel-default\" style=\"padding: 0;\">\n    <div class=\"panel-heading\">\n        <b>Rivers</b>\n    </div>\n    <div class=\"panel-body\" style=\"padding: 0;\">\n        <div class=\"list-group\" style=\"margin: 0;\">\n            <a href=\"#\" class=\"list-group-item\" style=\"border-radius: 0; border-left: none;\">Esri World Gray Canvas</a>\n            <a href=\"#\" class=\"list-group-item active\" style=\"border-radius: 0; border-left: none;\">Esri World Topo Map</a>\n        </div>\n    </div>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["period-control/templates/periods-seasons.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"btn-toolbar\" role=\"toolbar\" id=\"seasons-toolbar\">\n\n    <div class=\"btn-group\" data-toggle=\"buttons\">\n        <label class=\"btn btn-default\">\n            <input type=\"radio\" name=\"options\" id=\"option-0\" autocomplete=\"off\"> Anual\n        </label>\n        <label class=\"btn btn-default\">\n            <input type=\"radio\" name=\"options\" id=\"option-1\" autocomplete=\"off\"> Inverno\n        </label>\n        <label class=\"btn btn-default\">\n            <input type=\"radio\" name=\"options\" id=\"option-2\" autocomplete=\"off\"> Primavera\n        </label>\n        <label class=\"btn btn-default\">\n            <input type=\"radio\" name=\"options\" id=\"option-3\" autocomplete=\"off\"> Verão\n        </label>\n        <label class=\"btn btn-default\">\n            <input type=\"radio\" name=\"options\" id=\"option-4\" autocomplete=\"off\"> Outono\n        </label>\n    </div>\n\n\n\t<div class=\"btn-group\" role=\"group\">\n\t    <button type=\"button\" class=\"btn btn-primary\" id=\"js-periods-play\">\n\t        <span class=\"glyphicon glyphicon-play\" aria-hidden=\"true\"></span>\n\t    </button>\n\t</div>\n\n\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["sidebar/templates/sidebarOptionsModal.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"row\">\n    <div class=\"col-sm-10 col-sm-offset-1\">\n\n        <div class=\"modal-header\">\n            <h4 class=\"modal-title\">Layer: ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "description"), env.autoesc);
output += "</h4>\n        </div>\n\n\n        <div class=\"modal-body\">\n\n            <form class=\"form-horizontal\">\n                <div class=\"form-group\">\n                    <label for=\"js-layer-opacity\" class=\"col-sm-2 control-label\">Opacidade</label>\n                    <div class=\"col-sm-10\">\n                        <input type=\"text\" class=\"form-control\" id=\"js-layer-opacity\" name=\"opacity\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "opacity"), env.autoesc);
output += "\">\n                    </div>\n                </div>\n            </form>\n\n\n        ";
output += "    \n        </div>\n\n        <div class=\"modal-footer\">\n            <button type=\"button\" class=\"btn btn-primary js-modal-save\">Actualizar</button>\n            <button type=\"button\" class=\"btn btn-default js-modal-cancel\">Cancelar</button>\n\n            <div id=\"message-status\" style=\"margin-top: 35px;\"></div>\n            <div id=\"\" style=\"margin-top: 10px;\">\n                <h5 id=\"message-links\"></h5>\n            </div>\n        </div>\n\n    </div>\n</div>";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
