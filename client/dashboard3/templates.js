(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["files/templates/files-delete-modal.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">Delete confirmation</h4>\n</div>\n\n\n<div class=\"modal-body\">\nAre you sure you want to delete file # ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "?\n</div>\n\n<div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-danger js-modal-delete\">Yes</button>\n    <button type=\"button\" class=\"btn btn-default js-modal-cancel\">Cancel</button>\n\n\n    <div id=\"message-status\" style=\"margin-top: 35px;\"></div>\n    <div id=\"\" style=\"margin-top: 10px;\">\n        <h5 id=\"message-links\"></h5>\n    </div>\n</div>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["files/templates/files-edit-modal.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">Edit file #";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</h4>\n</div>\n\n\n<div class=\"modal-body\">\n    <form>\n\n        <div class=\"form-group\">\n            <label for=\"js-edit-files-tags\">Tags</label>\n            <input type=\"text\" id=\"js-edit-files-tags\" class=\"form-control\" name=\"edit-files-tags\" value=\"";
output += runtime.suppressValue(env.getFilter("join").call(context, runtime.contextOrFrameLookup(context, frame, "tags"),", "), env.autoesc);
output += "\">\n        </div>\n\n        <div class=\"form-group\">\n            <label for=\"js-edit-name\">Name</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "name"), env.autoesc);
output += "\" disabled>\n        </div>\n\n        <div class=\"form-group\">\n            <label>Path</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "logicalPath"), env.autoesc);
output += "\" disabled>\n        </div>\n        <div class=\"form-group\">\n            <label>id</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "\" disabled>\n        </div>\n\n        <div class=\"form-group\">\n            <label>Uploaded at</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "uploadedAt"), env.autoesc);
output += "\" disabled>\n        </div>\n\n        <div class=\"form-group\">\n            <label>Owner</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "ownerData")),"firstName", env.autoesc), env.autoesc);
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "ownerData")),"lastName", env.autoesc), env.autoesc);
output += "\" disabled>\n        </div>\n    </form>\n</div>\n\n<div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-primary js-modal-save\">Gravar</button>\n    <button type=\"button\" class=\"btn btn-default js-modal-cancel\">Cancelar</button>\n\n    <div id=\"message-status\" style=\"margin-top: 35px;\"></div>\n    <div id=\"\" style=\"margin-top: 10px;\">\n        <h5 id=\"message-links\"></h5>\n    </div>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["files/templates/files-new.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"row\">\n    <div class=\"col-sm-10 col-sm-offset-1\" style=\"padding-top: 10px;\">\n\n        <h3 class=\"text-center\">Upload de novo ficheiro</h4>\n\n<!--         <form method=\"post\" action=\"/api/files\" enctype=\"multipart/form-data\"> -->\n\t\t<form enctype=\"multipart/form-data\">\n\n\t\t\t <div class=\"form-group\">\n                <label for=\"new_file_tags\">Tags (separar com vírgulas)</label>\n                <input type=\"text\" id=\"new_file_tags\" class=\"form-control\" name=\"tags\">\n\n                <label for=\"new_file\">Choose file</label>\n\t\t\t\t<input id=\"new_file\" name=\"new_file\" type=\"file\" multiple=false class=\"file\">\n\t\t\t</div>\n\n        </form>\n\n\n    </div>\n</div>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["files/templates/files-row.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<td>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</td>\n\n<td>\n    ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "name"), env.autoesc);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "logicalPath"), env.autoesc);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(env.getFilter("join").call(context, runtime.contextOrFrameLookup(context, frame, "tags"),", "), env.autoesc);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "uploadedAt"), env.autoesc);
output += "\n</td>\n";
output += "\n<td class=\"text-right\">\n    <button class=\"btn btn-primary btn-xs js-edit\"><span class=\"glyphicon glyphicon-pencil\"></span>\n    </button>\n    <button class=\"btn btn-danger btn-xs js-delete\"><span class=\"glyphicon glyphicon-trash\"></span>\n    </button>\n</td>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["files/templates/files-tab.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<ul class=\"nav nav-tabs\">\n    <li role=\"presentation\" class=\"active\">\n        <a href=\"#\" class=\"js-dashboard-sep\" data-tab-separator=\"files-all\">Todos os ficheiros</a>\n    </li>\n    <li role=\"presentation\">\n        <a href=\"#\" class=\"js-dashboard-sep\" data-tab-separator=\"files-new\">Novo ficheiro</a>\n    </li>\n</ul>\n\n<div id=\"files-region\"></div>";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["files/templates/files-table.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"xtable-responsive\">\n    <table class=\"table table-striped table-condensed table-dashboard\">\n\n        <thead>\n            <tr>\n            \n                <th style=\"width: 5%\">id</th>\n                <th style=\"width: 23%\">Name</th>\n                <th style=\"width: 20%\">Path</th>\n                <th style=\"width: 20%\">Tags</th>\n                <th style=\"width: 18%\">Uploaded At</th>\n";
output += "\n                <th style=\"width: 10%\"></th>\n            </tr>\n        </thead>\n\n        <tbody>\n        </tbody>\n\n    </table>\n</div>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["main-layout/templates/main-layout.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"row\" style=\"padding-top: 20px;\">\n\n    <div class=\"col-sm-3\" id=\"main-left-region\">\n    </div>\n\n    <div class=\"col-sm-9\" id=\"main-right-region\">\n    </div>\n\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["maps/templates/controls-delete-modal.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["maps/templates/controls-edit-modal.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">Edit control #";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</h4>\n</div>\n\n\n<div class=\"modal-body\">\n\n\n    <form>\n\n        control\n\n    </form>\n\n\n</div>\n\n<div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-primary js-modal-save\">Gravar</button>\n    <button type=\"button\" class=\"btn btn-default js-modal-cancel\">Cancelar</button>\n\n    <div id=\"message-status\" style=\"margin-top: 35px;\"></div>\n    <div id=\"\" style=\"margin-top: 10px;\">\n        <h5 id=\"message-links\"></h5>\n    </div>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["maps/templates/controls-row.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<td>\n\tControl #";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "\n</td>\n\n";
output += "\n\n<td class=\"text-right\">\n    <button class=\"btn btn-primary btn-xs js-edit\"><span class=\"glyphicon glyphicon-pencil\"></span>\n    </button>\n    <button class=\"btn btn-danger btn-xs js-delete\"><span class=\"glyphicon glyphicon-trash\"></span>\n    </button>\n</td>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["maps/templates/controls-table.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"xtable-responsive\">\n    <table class=\"table table-striped table-condensed table-dashboard\">\n\n        <thead>\n            <tr>\n            \n                <th style=\"width: 50%\"></th>\n\n";
output += "\n                <th style=\"width: 10%\"></th>\n            </tr>\n        </thead>\n\n        <tbody>\n        </tbody>\n\n    </table>\n</div>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["maps/templates/maps-edit-modal.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">Edit map #";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</h4>\n</div>\n\n\n<div class=\"modal-body\">\n\n\n    <form>\n\n        <div class=\"form-group\">\n            <label for=\"js-edit-text-pt\">Title (português)</label>\n            <input id=\"js-edit-desc-pt\" class=\"form-control\" name=\"title[pt]\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "title")),"pt", env.autoesc), env.autoesc);
output += "\">\n        </div>\n        <div class=\"form-group\">\n            <label for=\"js-edit-text-en\">Title (english)</label>\n            <input id=\"js-edit-desc-en\" class=\"form-control\" name=\"title[en]\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "title")),"en", env.autoesc), env.autoesc);
output += "\">\n        </div>\n\n\n        <div class=\"form-group\">\n            <label for=\"js-new-map-category\">Map category</label>\n\n            <select name=\"categoryId\" class=\"form-control\">\n\n            ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "mapCategories");
if(t_3) {var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("obj", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n                <option value=";
output += runtime.suppressValue(runtime.memberLookup((t_4),"id", env.autoesc), env.autoesc);
output += " ";
output += runtime.suppressValue((runtime.memberLookup((t_4),"id", env.autoesc) == runtime.contextOrFrameLookup(context, frame, "categoryId")?"selected":""), env.autoesc);
output += ">\n                    ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_4),"contents", env.autoesc)),"en", env.autoesc), env.autoesc);
output += "\n                </option>\n            ";
;
}
}
frame = frame.pop();
output += "\n            \n            </select>\n\n        </div>\n\n        <hr>\n\n        <h4>Controls</h4>\n        \n\n";
output += "\n    </form>\n\n    <div id=\"controls-region\"></div>\n";
output += "\n</div>\n\n<div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-primary js-modal-save\">Gravar</button>\n    <button type=\"button\" class=\"btn btn-default js-modal-cancel\">Cancelar</button>\n\n    <div id=\"message-status\" style=\"margin-top: 35px;\"></div>\n    <div id=\"\" style=\"margin-top: 10px;\">\n        <h5 id=\"message-links\"></h5>\n    </div>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["maps/templates/maps-new.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"row\">\n    <div class=\"col-sm-10 col-sm-offset-1\" style=\"padding-top: 20px;\">\n\n        <h4 class=\"text-center\">Criar um novo mapa</h4>\n        <form style=\"margin-top: 40px;\">\n\n\t\t\t<div class=\"row\">\n\n\t\t\t\t<div class=\"col-sm-5\">\n\t\t            <div class=\"form-group\">\n\t\t                <label for=\"js-new-map-code\">Map code</label>\n\t\t                <input type=\"text\" id=\"js-new-map-code\" class=\"form-control\" name=\"code\">\n\t\t            </div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"col-sm-7\">\n\t\t            <div class=\"form-group\">\n\t\t                <label for=\"js-new-map-category\">Map category</label>\n\n                        <select name=\"categoryId\" class=\"form-control\">\n\n                        ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "mapCategories");
if(t_3) {var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("obj", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n                            <option value=";
output += runtime.suppressValue(runtime.memberLookup((t_4),"id", env.autoesc), env.autoesc);
output += ">\n                                ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_4),"contents", env.autoesc)),"en", env.autoesc), env.autoesc);
output += "\n                            </option>\n                        ";
;
}
}
frame = frame.pop();
output += "\n                        \n                        </select>\n\n\t\t            </div>\n\t\t\t\t</div>\n\n            </div>\n\n            <div class=\"form-group\">\n                <label for=\"js-new-map-title-pt\">Map title (portuguese)</label>\n                <input type=\"text\" id=\"js-new-map-title-pt\" class=\"form-control\" name=\"title[pt]\" >\n            </div>\n            <div class=\"form-group\">\n                <label for=\"js-new-map-title-en\">Map title (english)</label>\n                <input type=\"text\" id=\"js-new-map-title-en\" class=\"form-control\" name=\"title[en]\" >\n            </div>\n\n        </form>\n\n";
output += "\n\n        <div class=\"row\" style=\"margin-top: 20px;\">\n        \t<div class=\"col-sm-6 col-sm-offset-3\">\n            \t<button type=\"button\" class=\"btn btn-primary btn-block js-save\">Create map</button>\n            </div>\n        </div>\n\n    </div>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["maps/templates/maps-row.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<td>\n\t";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "\n</td>\n\n<td>\n    ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "code"), env.autoesc);
output += "\n</td>\n\n<td>\n    ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "categoryData")),"contents", env.autoesc)),"en", env.autoesc), env.autoesc);
output += "\n</td>\n\n<td>\n    ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "ownerData")),"firstName", env.autoesc), env.autoesc);
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "ownerData")),"lastName", env.autoesc), env.autoesc);
output += "\n</td>\n\n";
output += "\n\n<td class=\"text-right\">\n    <button class=\"btn btn-primary btn-xs js-edit\"><span class=\"glyphicon glyphicon-pencil\"></span>\n    </button>\n    <button class=\"btn btn-danger btn-xs js-delete\"><span class=\"glyphicon glyphicon-trash\"></span>\n    </button>\n</td>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["maps/templates/maps-tab.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<ul class=\"nav nav-tabs\">\n    <li role=\"presentation\" class=\"active\">\n        <a href=\"#\" class=\"js-dashboard-sep\" data-tab-separator=\"shapes-all\">Todos os shapes</a>\n    </li>\n    <li role=\"presentation\">\n        <a href=\"#\" class=\"js-dashboard-sep\" data-tab-separator=\"shapes-new\">Carregar novo shape</a>\n    </li>\n\n    <li role=\"presentation\">\n        <a href=\"#\" class=\"js-dashboard-sep\" data-tab-separator=\"maps-all\">Todos os mapas</a>\n    </li>\n    <li role=\"presentation\">\n        <a href=\"#\" class=\"js-dashboard-sep\" data-tab-separator=\"maps-new\">Criar novo mapa</a>\n    </li>\n</ul>\n\n<div id=\"maps-region\"></div>";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["maps/templates/maps-table.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"xtable-responsive\">\n    <table class=\"table table-striped table-condensed table-dashboard\">\n\n        <thead>\n            <tr>\n            \n                <th style=\"width: 5%\">id</th>\n                <th style=\"width: 10%\">Code</th>\n                <th style=\"width: 15%\">Category</th>\n                <th style=\"width: 15%\">Owner</th>\n";
output += "\n                <th style=\"width: 10%\"></th>\n            </tr>\n        </thead>\n\n        <tbody>\n        </tbody>\n\n    </table>\n</div>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["maps/templates/shapes-delete-modal.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">Delete confirmation</h4>\n</div>\n\n\n<div class=\"modal-body\">\nAre you sure you want to delete shape # ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "?\n</div>\n\n<div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-danger js-modal-delete\">Yes</button>\n    <button type=\"button\" class=\"btn btn-default js-modal-cancel\">Cancel</button>\n\n\n    <div id=\"message-status\" style=\"margin-top: 35px;\"></div>\n    <div id=\"\" style=\"margin-top: 10px;\">\n        <h5 id=\"message-links\"></h5>\n    </div>\n</div>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["maps/templates/shapes-edit-modal.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">Edit shape #";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</h4>\n</div>\n\n\n<div class=\"modal-body\">\n    <form>\n\n        <div class=\"form-group\">\n            <label for=\"js-edit-text-pt\">Description (português)</label>\n            <input id=\"js-edit-desc-pt\" class=\"form-control\" name=\"edit-desc-pt\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "description")),"pt", env.autoesc), env.autoesc);
output += "\">\n        </div>\n        <div class=\"form-group\">\n            <label for=\"js-edit-text-en\">Description (english)</label>\n            <input id=\"js-edit-desc-en\" class=\"form-control\" name=\"edit-desc-en\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "description")),"en", env.autoesc), env.autoesc);
output += "\">\n        </div>\n\n        <hr>\n\n        <div class=\"row\">\n            <div class=\"col-sm-6\">\n                <div class=\"form-group\">\n                    <label>Shape code</label>\n                    <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "code"), env.autoesc);
output += "\" disabled>\n                </div>\n            </div>\n\n            <div class=\"col-sm-6\">\n                <div class=\"form-group\">\n                    <label>SRID</label>\n                    <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "srid"), env.autoesc);
output += "\" disabled>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"col-sm-6\">\n                <div class=\"form-group\">\n                    <label>Original file</label>\n                    <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "fileData")),"name", env.autoesc), env.autoesc);
output += "\" disabled>\n                </div>\n            </div>\n\n            <div class=\"col-sm-6\">\n                <div class=\"form-group\">\n                    <label>Created at</label>\n                    <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "createdAt"), env.autoesc);
output += "\" disabled>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"form-group\">\n            <label>Owner</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "ownerData")),"first_name", env.autoesc), env.autoesc);
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "ownerData")),"last_name", env.autoesc), env.autoesc);
output += "\" disabled>\n        </div>\n\n    </form>\n\n    <hr>\n\n        <div class=\"row\">\n            <div class=\"col-sm-10 col-sm-offset-1\">\n\n                <h4 class=\"text-center\">Column data</h4>\n\n                <table class=\"table table-striped table-condensed table-dashboard\">\n                    <thead>\n                        <tr>\n                            <th style=\"width: 50%\">Column name</th>\n                            <th style=\"width: 50%\">Data type</th>\n                        </tr>\n                    </thead>\n\n                    <tbody>\n                        ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "shapeColumnsData");
if(t_3) {var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("column", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n\n                        <tr>\n                            <td>";
output += runtime.suppressValue(runtime.memberLookup((t_4),"column_name", env.autoesc), env.autoesc);
output += "</td>\n                            <td>";
output += runtime.suppressValue(runtime.memberLookup((t_4),"data_type", env.autoesc), env.autoesc);
output += "</td>\n                        </tr>\n\n                        ";
;
}
}
frame = frame.pop();
output += "\n                    </tbody>\n                </table>\n\n            </div>\n        </div>\n\n</div>\n\n<div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-primary js-modal-save\">Gravar</button>\n    <button type=\"button\" class=\"btn btn-default js-modal-cancel\">Cancelar</button>\n\n    <div id=\"message-status\" style=\"margin-top: 35px;\"></div>\n    <div id=\"\" style=\"margin-top: 10px;\">\n        <h5 id=\"message-links\"></h5>\n    </div>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["maps/templates/shapes-new.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"row\">\n    <div class=\"col-sm-10 col-sm-offset-1\" style=\"padding-top: 20px;\">\n\n        <h4 class=\"text-center\">Carregar um novo shape para a base de dados</h4>\n        <form style=\"margin-top: 40px;\">\n\n\t\t\t<div class=\"row\">\n\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t            <div class=\"form-group\">\n\t\t                <label for=\"js-new-shape-code\">Shape code</label>\n\t\t                <input type=\"text\" id=\"js-new-shape-code\" class=\"form-control\" name=\"new-shape-code\">\n\t\t            </div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t            <div class=\"form-group\">\n\t\t                <label for=\"js-new-shape-srid\">SRID (projection identifier)</label>\n\t\t                <input type=\"text\" id=\"js-new-shape-srid\" class=\"form-control\" name=\"new-shape-srid\" value=\"4326\">\n\t\t            </div>\n\t\t\t\t</div>\n\n            </div>\n\n            <div class=\"form-group\">\n                <label for=\"js-new-shape-desc-pt\">Description (portuguese)</label>\n                <input type=\"text\" id=\"js-new-shape-desc-pt\" class=\"form-control\" name=\"new-shape-desc-pt\" >\n            </div>\n            <div class=\"form-group\">\n                <label for=\"js-new-shape-desc-en\">Description (english)</label>\n                <input type=\"text\" id=\"js-new-shape-desc-en\" class=\"form-control\" name=\"new-shape-desc-en\" >\n            </div>\n\n        </form>\n\n        <div id=\"zipped-shapes-region\"></div>\n\n        <div class=\"row\" style=\"margin-top: 20px;\">\n        \t<div class=\"col-sm-6 col-sm-offset-3\">\n            \t<button type=\"button\" class=\"btn btn-primary btn-block js-save\">Carregar shape!</button>\n            </div>\n        </div>\n\n    </div>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["maps/templates/shapes-row.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<td>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</td>\n\n<td>\n    ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "code"), env.autoesc);
output += "\n</td>\n\n<td>\n    ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "srid"), env.autoesc);
output += "\n</td>\n\n<td>\n    ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "fileData")),"name", env.autoesc), env.autoesc);
output += "\n</td>\n\n<td>\n    ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "ownerData")),"firstName", env.autoesc), env.autoesc);
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "ownerData")),"lastName", env.autoesc), env.autoesc);
output += "\n</td>\n\n";
output += "\n\n<td class=\"text-right\">\n    <button class=\"btn btn-primary btn-xs js-edit\"><span class=\"glyphicon glyphicon-pencil\"></span>\n    </button>\n    <button class=\"btn btn-danger btn-xs js-delete\"><span class=\"glyphicon glyphicon-trash\"></span>\n    </button>\n</td>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["maps/templates/shapes-table.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"xtable-responsive\">\n    <table class=\"table table-striped table-condensed table-dashboard\">\n\n        <thead>\n            <tr>\n            \n                <th style=\"width: 5%\">id</th>\n                <th style=\"width: 10%\">Code</th>\n                <th style=\"width: 5%\">SRID</th>\n                <th style=\"width: 10%\">File</th>\n                <th style=\"width: 10%\">Owner</th>\n";
output += "\n                <th style=\"width: 10%\"></th>\n            </tr>\n        </thead>\n\n        <tbody>\n        </tbody>\n\n    </table>\n</div>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["maps/templates/zipped-shapes-row.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "\n<td>\n \t<input type=\"radio\" name=\"shapes-radios\">\n</td>\n\n<td class=\"js-file-id\">";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</td>\n\n<td>\n    ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "name"), env.autoesc);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "ownerData")),"firstName", env.autoesc), env.autoesc);
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "ownerData")),"lastName", env.autoesc), env.autoesc);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "uploadedAt"), env.autoesc);
output += "\n</td>\n\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["maps/templates/zipped-shapes-table.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"xtable-responsive\">\n    <table class=\"table table-condensed table-hover table-dashboard\">\n\n        <thead>\n            <tr>\n                <th style=\"width: 5%\"></th>\n                <th style=\"width: 10%\">File id</th>\n                <th style=\"width: 20%\">Name</th>\n                <th style=\"width: 20%\">Owner</th>\n                <th style=\"width: 20%\">Uploaded at</th>\n            </tr>\n        </thead>\n\n        <tbody>\n        </tbody>\n\n    </table>\n</div>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["menu-left/templates/menu-left.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"list-group\">\n\n";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "items");
if(t_3) {var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("obj", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n\t<a href=\"#";
output += runtime.suppressValue(runtime.memberLookup((t_4),"itemCode", env.autoesc), env.autoesc);
output += "\" class=\"list-group-item\" style=\"padding-top: 13px; padding-bottom: 13px;\">\n\t\t<span class=\"glyphicon ";
output += runtime.suppressValue(runtime.memberLookup((t_4),"itemIcon", env.autoesc), env.autoesc);
output += "\"></span>&nbsp;\n\t\t";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_4),"itemTitle", env.autoesc)),runtime.memberLookup((t_4),"lang", env.autoesc), env.autoesc), env.autoesc);
output += "\n\t\t<span class=\"arrow-container pull-right\"></span>\n\t</a>\n\n";
;
}
}
frame = frame.pop();
output += "\n\n\n</div>";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["profile/templates/profile.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"row\">\n    <div class=\"col-sm-10 col-sm-offset-1\" style=\"padding-top: 20px;\">\n\n        <h3 class=\"text-center\">Dados pessoais</h3>\n        <form>\n            <div class=\"form-group\">\n                <label for=\"js-personal-first-name\">Primeiro nome</label>\n                <input type=\"text\" id=\"js-personal-first-name\" class=\"form-control\" name=\"firstName\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "firstName"), env.autoesc);
output += "\">\n            </div>\n            <div class=\"form-group\">\n                <label for=\"js-personal-last-name\">Apelido</label>\n                <input type=\"text\" id=\"js-personal-last-name\" class=\"form-control\" name=\"lastName\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "lastName"), env.autoesc);
output += "\">\n            </div>\n            <div class=\"form-group\">\n                <label for=\"js-personal-email\">Email</label>\n                <input type=\"text\" id=\"js-personal-email\" class=\"form-control\" name=\"email\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "email"), env.autoesc);
output += "\">\n            </div>\n        </form>\n\n        <div class=\"row\" style=\"margin-top: 20px;\">\n        \t<div class=\"col-sm-6 col-sm-offset-3\">\n            \t<button type=\"button\" class=\"btn btn-primary btn-block js-save\">Gravar</button>\n            </div>\n        </div>\n\n\n        <h3 class=\"text-center\" style=\"margin-top: 50px;\">Alterar password</h3>\n        <form>\n            <div class=\"form-group\">\n                <label for=\"js-personal-current-pw\">Password actual</label>\n                <input type=\"password\" id=\"js-personal-current-pw\" class=\"form-control\" name=\"currentPw\">\n            </div>\n            <div class=\"form-group\">\n                <label for=\"js-personal-new-pw\">Nova password</label>\n                <input type=\"password\" id=\"js-personal-new-pw\" class=\"form-control\" name=\"newPw\">\n            </div>\n            <div class=\"form-group\">\n                <label for=\"js-personal-new-pw-2\">Nova password (novamente)</label>\n                <input type=\"password\" id=\"js-personal-new-pw-2\" class=\"form-control\" name=\"newPw2\">\n            </div>\n        </form>\n\n        <div class=\"row\" style=\"margin-top: 20px;\">\n            <div class=\"col-sm-6 col-sm-offset-3\">\n                <button type=\"button\" class=\"btn btn-primary btn-block js-change-pw\">Alterar password</button>\n            </div>\n        </div>\n\n    </div>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["texts/templates/texts-delete-modal.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">Delete confirmation</h4>\n</div>\n\n\n<div class=\"modal-body\">\nAre you sure you want to delete text # ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "?\n</div>\n\n<div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-danger js-modal-delete\">Yes</button>\n    <button type=\"button\" class=\"btn btn-default js-modal-cancel\">Cancel</button>\n\n\n    <div id=\"message-status\" style=\"margin-top: 35px;\"></div>\n    <div id=\"\" style=\"margin-top: 10px;\">\n        <h5 id=\"message-links\"></h5>\n    </div>\n</div>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["texts/templates/texts-edit-modal.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">Edit text #";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</h4>\n</div>\n\n\n<div class=\"modal-body\">\n    <form>\n        <div class=\"form-group\">\n            <label for=\"js-edit-text-pt\">Português</label>\n            <textarea id=\"js-edit-text-pt\" class=\"form-control\" name=\"edit-text-pt\" rows=\"3\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "contents")),"pt", env.autoesc), env.autoesc);
output += "</textarea>\n        </div>\n        <div class=\"form-group\">\n            <label for=\"js-edit-text-en\">Inglês</label>\n            <textarea  id=\"js-edit-text-en\" class=\"form-control\" name=\"edit-text-en\" rows=\"3\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "contents")),"en", env.autoesc), env.autoesc);
output += "</textarea>\n        </div>\n        <div class=\"form-group\">\n            <label for=\"js-edit-text-tags\">Tags</label>\n            <input type=\"text\" id=\"js-edit-text-tags\" class=\"form-control\" name=\"edit-text-tags\" value=\"";
output += runtime.suppressValue(env.getFilter("join").call(context, runtime.contextOrFrameLookup(context, frame, "tags"),", "), env.autoesc);
output += "\">\n        </div>\n        <div class=\"form-group\">\n            <label>id</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "\" disabled>\n        </div>\n        <div class=\"form-group\">\n            <label>Last updated</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "lastUpdated"), env.autoesc);
output += "\" disabled>\n        </div>\n        <div class=\"form-group\">\n            <label>Author (of the last update)</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "authorData")),"firstName", env.autoesc), env.autoesc);
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "authorData")),"lastName", env.autoesc), env.autoesc);
output += "\" disabled>\n        </div>\n    </form>\n</div>\n\n<div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-primary js-modal-save\">Gravar</button>\n    <button type=\"button\" class=\"btn btn-default js-modal-cancel\">Cancelar</button>\n\n    <div id=\"message-status\" style=\"margin-top: 35px;\"></div>\n    <div id=\"\" style=\"margin-top: 10px;\">\n        <h5 id=\"message-links\"></h5>\n    </div>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["texts/templates/texts-new.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"row\">\n    <div class=\"col-sm-10 col-sm-offset-1\" style=\"padding-top: 20px;\">\n\n        ";
output += "\n        <form>\n            <div class=\"form-group\">\n                <label for=\"js-new-text-pt\">Português</label>\n                <textarea id=\"js-new-text-pt\" class=\"form-control\" name=\"new-text-pt\" rows=\"3\"></textarea>\n            </div>\n            <div class=\"form-group\">\n                <label for=\"js-new-text-en\">Inglês</label>\n                <textarea id=\"js-new-text-en\" class=\"form-control\" name=\"new-text-en\" rows=\"3\"></textarea>\n            </div>\n            <div class=\"form-group\">\n                <label for=\"js-new-text-tags\">Tags (separar com vírgulas)</label>\n                <input type=\"text\" id=\"js-new-text-tags\" class=\"form-control\" name=\"new-text-tags\">\n            </div>\n        </form>\n\n        <div class=\"row\" style=\"margin-top: 20px;\">\n        \t<div class=\"col-sm-6 col-sm-offset-3\">\n            \t<button type=\"button\" class=\"btn btn-primary btn-block js-save\">Gravar</button>\n            </div>\n        </div>\n\n    </div>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["texts/templates/texts-row.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<td>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</td>x\n\n<td>\n    ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "contents")),"pt", env.autoesc), env.autoesc);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "contents")),"en", env.autoesc), env.autoesc);
output += "\n</td>\n<td>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "authorData")),"firstName", env.autoesc), env.autoesc);
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "authorData")),"lastName", env.autoesc), env.autoesc);
output += "</td>\n\n<td>";
output += runtime.suppressValue(env.getFilter("join").call(context, runtime.contextOrFrameLookup(context, frame, "tags"),", "), env.autoesc);
output += "</td>\n\n\n<td class=\"text-right\">\n    <button class=\"btn btn-primary btn-xs js-edit\"><span class=\"glyphicon glyphicon-pencil\"></span>\n    </button>\n    <button class=\"btn btn-danger btn-xs js-delete\"><span class=\"glyphicon glyphicon-trash\"></span>\n    </button>\n</td>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["texts/templates/texts-tab.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<ul class=\"nav nav-tabs\">\n    <li role=\"presentation\" class=\"active\">\n        <a href=\"#\" class=\"js-dashboard-sep\" data-tab-separator=\"texts-all\">Todos os textos</a>\n    </li>\n    <li role=\"presentation\">\n        <a href=\"#\" class=\"js-dashboard-sep\" data-tab-separator=\"texts-new\">Novo texto</a>\n    </li>\n</ul>\n\n<div id=\"texts-region\"></div>";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["texts/templates/texts-table.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"xtable-responsive\">\n    <table class=\"table table-striped table-condensed table-dashboard\">\n\n        <thead>\n            <tr>\n                <th style=\"width: 4%\">id</th>\n                <th style=\"width: 30%\">pt</th>\n                <th style=\"width: 30%\">en</th>\n                <th style=\"width: 16%\">Author</th>\n                <th style=\"width: 10%\">Tags</th>\n                <th style=\"width: 10%\"></th>\n            </tr>\n        </thead>\n\n        <tbody>\n        </tbody>\n\n    </table>\n</div>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["users/templates/users-delete-modal.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">Delete confirmation</h4>\n</div>\n\n\n<div class=\"modal-body\">\nAre you sure you want to delete user # ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "?\n</div>\n\n<div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-danger js-modal-delete\">Yes</button>\n    <button type=\"button\" class=\"btn btn-default js-modal-cancel\">Cancel</button>\n\n\n    <div id=\"message-status\" style=\"margin-top: 35px;\"></div>\n    <div id=\"\" style=\"margin-top: 10px;\">\n        <h5 id=\"message-links\"></h5>\n    </div>\n</div>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["users/templates/users-edit-modal.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">Edit user #";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</h4>\n</div>\n\n\n<div class=\"modal-body\">\n    <form>\n\n        <div class=\"form-group\">\n            <label for=\"js-edit-user-first-name\">First Name</label>\n            <input type=\"text\" id=\"js-edit-user-first-name\" class=\"form-control\" name=\"edit-user-first-name\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "firstName"), env.autoesc);
output += "\" >\n        </div>\n\n        <div class=\"form-group\">\n            <label for=\"js-user-last-name\">Last Name</label>\n            <input type=\"text\" id=\"js-user-last-name\" class=\"form-control\" name=\"edit-user-last-name\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "lastName"), env.autoesc);
output += "\" >\n        </div>\n\n        <div class=\"form-group\">\n            <label for=\"js-edit-user-email\">Email</label>\n            <input type=\"text\" id=\"js-edit-user-email\" class=\"form-control\" name=\"edit-user-email\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "email"), env.autoesc);
output += "\" >\n        </div>\n\n        <div class=\"form-group\">\n            <label>id</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "\" disabled>\n        </div>\n        <div class=\"form-group\">\n            <label>Created At</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "createdAt"), env.autoesc);
output += "\" disabled>\n        </div>\n        \n    </form>\n</div>\n\n<div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-primary js-modal-save\">Gravar</button>\n    <button type=\"button\" class=\"btn btn-default js-modal-cancel\">Cancelar</button>\n\n    <div id=\"message-status\" style=\"margin-top: 35px;\"></div>\n    <div id=\"\" style=\"margin-top: 10px;\">\n        <h5 id=\"message-links\"></h5>\n    </div>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["users/templates/users-row.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<td>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</td>x\n\n<td>\n    ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "firstName"), env.autoesc);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "lastName"), env.autoesc);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "email"), env.autoesc);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "createdAt"), env.autoesc);
output += "\n</td>\n\n<td class=\"text-right\">\n    <button class=\"btn btn-primary btn-xs js-edit\"><span class=\"glyphicon glyphicon-pencil\"></span>\n    </button>\n    <button class=\"btn btn-danger btn-xs js-delete\"><span class=\"glyphicon glyphicon-trash\"></span>\n    </button>\n</td>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["users/templates/users-tab.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<ul class=\"nav nav-tabs\">\n    <li role=\"presentation\" class=\"active\">\n        <a href=\"#\" class=\"js-dashboard-sep\" data-tab-separator=\"users-all\">Todos os utilizadores</a>\n    </li>\n    <li role=\"presentation\">\n        <a href=\"#\" class=\"js-dashboard-sep\" data-tab-separator=\"users-new\">Novo utilizador</a>\n    </li>\n</ul>\n\n<div id=\"users-region\"></div>";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["users/templates/users-table.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"xtable-responsive\">\n    <table class=\"table table-striped table-condensed table-dashboard\">\n\n        <thead>\n            <tr>\n            \n                <th style=\"width: 5%\">id</th>\n                <th style=\"width: 20%\">First Name</th>\n                <th style=\"width: 20%\">Last Name</th>\n                <th style=\"width: 25%\">email</th>\n                <th style=\"width: 20%\">Created At</th>\n\n                <th style=\"width: 10%\"></th>\n            </tr>\n        </thead>\n\n        <tbody>\n        </tbody>\n\n    </table>\n</div>\n\n";
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
