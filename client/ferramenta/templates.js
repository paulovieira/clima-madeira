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

