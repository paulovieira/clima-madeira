(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["default/templates/default.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"row\">\n    <div class=\"col-sm-12\">\n    \tMake a selection in the left menu\n    </div>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["files/templates/fileDeleteModal.html"] = (function() {function root(env, context, frame, runtime, cb) {
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["files/templates/fileEditModal.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">Edit file #";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</h4>\n</div>\n\n\n<div class=\"modal-body\">\n    <form>\n\n        <div class=\"form-group\">\n            <label for=\"js-edit-tags\">Tags</label>\n            <input type=\"text\" id=\"js-edit-tags\" class=\"form-control\" name=\"tags\" value=\"";
output += runtime.suppressValue(env.getFilter("join").call(context, runtime.contextOrFrameLookup(context, frame, "tags"),", "), env.autoesc);
output += "\">\n        </div>\n\n        <div class=\"form-group\">\n            <label for=\"js-edit-name\">Name</label>\n            <input type=\"text\" id=\"js-edit-name\" class=\"form-control\" name=\"name\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "name"), env.autoesc);
output += "\" disabled>\n        </div>\n\n        <div class=\"form-group\">\n            <label>Path</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "path"), env.autoesc);
output += "\" disabled>\n        </div>\n        <div class=\"form-group\">\n            <label>id</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "\" disabled>\n        </div>\n\n        <div class=\"form-group\">\n            <label>Uploaded at</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "uploadedAt"), env.autoesc);
output += "\" disabled>\n        </div>\n\n      <div class=\"form-group\">\n            <label>Owner</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["files/templates/fileNew.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"row\">\n    <div class=\"col-sm-10 col-sm-offset-1\" style=\"padding-top: 20px;\">\n\n        <h3 class=\"text-center\">Upload de novo ficheiro</h3>\n\n<!--         <form method=\"post\" action=\"/api/files\" enctype=\"multipart/form-data\"> -->\n\t\t<form enctype=\"multipart/form-data\">\n\n            <div class=\"form-group\">\n\n            </div>\n\n\t\t\t <div class=\"form-group\">\n                <label for=\"newfiletags\">Tags (separar com vírgulas)</label>\n                <input type=\"text\" id=\"newfiletags\" class=\"form-control\" name=\"tags\">\n\n                <label for=\"newfile\">Choose file</label>\n\t\t\t\t<input id=\"newfile\" name=\"newfile\" type=\"file\" multiple=false class=\"file\">\n\t\t\t</div>\n\n        </form>\n\n\n    </div>\n</div>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["files/templates/fileRow.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<td>\n\t";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "\n</td>\n\n<td>\n    ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "name"), env.autoesc);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "path"), env.autoesc);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(env.getFilter("join").call(context, runtime.contextOrFrameLookup(context, frame, "tags"),", "), env.autoesc);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "ownerData")),"firstName", env.autoesc), env.autoesc);
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "ownerData")),"lastName", env.autoesc), env.autoesc);
output += "\n</td>\n\n<td>\n    <button class=\"btn btn-primary btn-xs js-edit\"><span class=\"glyphicon glyphicon-pencil\"></span>\n    </button>\n    <button class=\"btn btn-danger btn-xs js-delete\"><span class=\"glyphicon glyphicon-trash\"></span>\n    </button>\n</td>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["files/templates/filesTable.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"xtable-responsive\">\n    <table class=\"table table-striped table-condensed table-dashboard\">\n\n        <thead>\n            <tr>\n                <th style=\"width: 4%\">id</th>\n                <th style=\"width: 30%\">Name</th>\n                <th style=\"width: 30%\">Path</th>\n                <th style=\"width: 10%\">Tags</th>\n                <th style=\"width: 16%\">Owner</th>\n                <th style=\"width: 10%\"></th>\n            </tr>\n        </thead>\n\n        <tbody>\n        </tbody>\n\n    </table>\n</div>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["mainLayout/templates/main-layout.html"] = (function() {function root(env, context, frame, runtime, cb) {
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["menuLeft/templates/list-group.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var macro_t_1 = runtime.makeMacro(
["code", "items"], 
[], 
function (l_code, l_items, kwargs) {
frame = frame.push();
kwargs = kwargs || {};
if (kwargs.hasOwnProperty("caller")) {
frame.set("caller", kwargs.caller); }
frame.set("code", l_code);
frame.set("items", l_items);
var t_2 = "";t_2 += "\n\n<div style=\"margin-bottom: 0;\" id=\"";
t_2 += runtime.suppressValue(l_code, env.autoesc);
t_2 += "\" class=\"list-group panel-collapse collapse in\">\n\n";
frame = frame.push();
var t_5 = l_items;
if(t_5) {var t_4 = t_5.length;
for(var t_3=0; t_3 < t_5.length; t_3++) {
var t_6 = t_5[t_3];
frame.set("obj", t_6);
frame.set("loop.index", t_3 + 1);
frame.set("loop.index0", t_3);
frame.set("loop.revindex", t_4 - t_3);
frame.set("loop.revindex0", t_4 - t_3 - 1);
frame.set("loop.first", t_3 === 0);
frame.set("loop.last", t_3 === t_4 - 1);
frame.set("loop.length", t_4);
t_2 += "\n\n<a href=\"#\" class=\"list-group-item\" data-list-item=\"";
t_2 += runtime.suppressValue(runtime.memberLookup((t_6),"itemCode", env.autoesc), env.autoesc);
t_2 += "\" style=\"border-radius: 0;\">\n    <span>";
t_2 += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_6),"itemTitle", env.autoesc)),"pt", env.autoesc), env.autoesc);
t_2 += "</span>\n    <span class=\"arrow-container pull-right\"></span>\n</a>\n\n";
;
}
}
frame = frame.pop();
t_2 += "\n\n</div>\n\n";
;
frame = frame.pop();
return new runtime.SafeString(t_2);
});
context.addExport("listGroup");
context.setVariable("listGroup", macro_t_1);
output += "\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["menuLeft/templates/panel.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
env.getTemplate("menuLeft/templates/list-group.html", function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(t_1.hasOwnProperty("listGroup")) {
var t_4 = t_1.listGroup;
} else {
cb(new Error("cannot import 'listGroup'")); return;
}
context.setVariable("listGroup", t_4);
output += "\n\n";
frame = frame.push();
var t_7 = runtime.contextOrFrameLookup(context, frame, "items");
if(t_7) {var t_6 = t_7.length;
for(var t_5=0; t_5 < t_7.length; t_5++) {
var t_8 = t_7[t_5];
frame.set("obj", t_8);
frame.set("loop.index", t_5 + 1);
frame.set("loop.index0", t_5);
frame.set("loop.revindex", t_6 - t_5);
frame.set("loop.revindex0", t_6 - t_5 - 1);
frame.set("loop.first", t_5 === 0);
frame.set("loop.last", t_5 === t_6 - 1);
frame.set("loop.length", t_6);
output += "\n\n<div class=\"panel panel-primary\" style=\"border-radius: 0;\">\n\n    <div class=\"panel-heading\" style=\"border-radius: 0;\">\n    \t<span class=\"glyphicon ";
output += runtime.suppressValue(runtime.memberLookup((t_8),"panelIcon", env.autoesc), env.autoesc);
output += "\" aria-hidden=\"true\"></span>&nbsp;\n        <a data-toggle=\"collapse\" href=\"#";
output += runtime.suppressValue(runtime.memberLookup((t_8),"panelCode", env.autoesc), env.autoesc);
output += "\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_8),"panelTitle", env.autoesc)),runtime.memberLookup((t_8),"lang", env.autoesc), env.autoesc), env.autoesc);
output += "</a>\n    </div>\n\n    <div class=\"panel-body\" style=\"padding: 0; \">\n\n    \t";
output += runtime.suppressValue((lineno = 13, colno = 15, runtime.callWrap(t_4, "listGroup", [runtime.memberLookup((t_8),"panelCode", env.autoesc),runtime.memberLookup((t_8),"panelItems", env.autoesc)])), env.autoesc);
output += " \n\n    </div>\n\n\n</div>\n\n";
;
}
}
frame = frame.pop();
output += "\n\n";
cb(null, output);
})});
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["texts/templates/textDeleteModal.html"] = (function() {function root(env, context, frame, runtime, cb) {
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["texts/templates/textEditModal.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">Edit text #";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</h4>\n</div>\n\n\n<div class=\"modal-body\">\n    <form>\n        <div class=\"form-group\">\n            <label for=\"js-edit-text-pt\">Português</label>\n            <textarea id=\"js-edit-text-pt\" class=\"form-control\" name=\"pt\" rows=\"3\">";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "pt"), env.autoesc);
output += "</textarea>\n        </div>\n        <div class=\"form-group\">\n            <label for=\"js-edit-text-en\">Inglês</label>\n            <textarea  id=\"js-edit-text-en\" class=\"form-control\" name=\"en\" rows=\"3\">";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "en"), env.autoesc);
output += "</textarea>\n        </div>\n        <div class=\"form-group\">\n            <label for=\"js-edit-text-tags\">Tags</label>\n            <input type=\"text\" id=\"js-edit-text-tags\" class=\"form-control\" name=\"tags\" value=\"";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["texts/templates/textNew.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"row\">\n    <div class=\"col-sm-10 col-sm-offset-1\" style=\"padding-top: 20px;\">\n\n        <h3 class=\"text-center\">Criar um novo texto</h3>\n        <form>\n            <div class=\"form-group\">\n                <label for=\"js-new-text-pt\">Português</label>\n                <textarea id=\"js-new-text-pt\" class=\"form-control\" name=\"pt\" rows=\"3\"></textarea>\n            </div>\n            <div class=\"form-group\">\n                <label for=\"js-new-text-en\">Inglês</label>\n                <textarea id=\"js-new-text-en\" class=\"form-control\" name=\"en\" rows=\"3\"></textarea>\n            </div>\n            <div class=\"form-group\">\n                <label for=\"js-new-text-tags\">Tags (separar com vírgulas)</label>\n                <input type=\"text\" id=\"js-new-text-tags\" class=\"form-control\" name=\"tags\">\n            </div>\n        </form>\n\n        <div class=\"row\" style=\"margin-top: 20px;\">\n        \t<div class=\"col-sm-6 col-sm-offset-3\">\n            \t<button type=\"button\" class=\"btn btn-primary btn-block js-save\">Gravar</button>\n            </div>\n        </div>\n\n    </div>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["texts/templates/textRow.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<td>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</td>x\n\n<td>\n    ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "pt"), env.autoesc);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "en"), env.autoesc);
output += "\n</td>\n<td>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "authorData")),"firstName", env.autoesc), env.autoesc);
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "authorData")),"lastName", env.autoesc), env.autoesc);
output += "</td>\n\n<td>";
output += runtime.suppressValue(env.getFilter("join").call(context, runtime.contextOrFrameLookup(context, frame, "tags"),", "), env.autoesc);
output += "</td>\n\n<td>\n    <button class=\"btn btn-primary btn-xs js-edit\"><span class=\"glyphicon glyphicon-pencil\"></span>\n    </button>\n    <button class=\"btn btn-danger btn-xs js-delete\"><span class=\"glyphicon glyphicon-trash\"></span>\n    </button>\n</td>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["texts/templates/textsTable.html"] = (function() {function root(env, context, frame, runtime, cb) {
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["users/templates/userDeleteModal.html"] = (function() {function root(env, context, frame, runtime, cb) {
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["users/templates/userEditModal.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">Edit user #";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</h4>\n</div>\n\n\n<div class=\"modal-body\">\n    <form>\n\n        <div class=\"form-group\">\n            <label for=\"js-first-name\">First Name</label>\n            <textarea id=\"js-first-name\" class=\"form-control\" name=\"firstName\" rows=\"1\">";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "firstName"), env.autoesc);
output += "</textarea>\n        </div>\n\n        <div class=\"form-group\">\n            <label for=\"js-last-name\">Last Name</label>\n            <textarea id=\"js-last-name\" class=\"form-control\" name=\"lastName\" rows=\"1\">";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "lastName"), env.autoesc);
output += "</textarea>\n        </div>\n\n        <div class=\"form-group\">\n            <label for=\"js-email\">Email</label>\n            <textarea id=\"js-email\" class=\"form-control\" name=\"email\" rows=\"1\">";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "email"), env.autoesc);
output += "</textarea>\n        </div>\n\n        <div class=\"form-group\">\n            <label>id</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "\" disabled>\n        </div>\n        <div class=\"form-group\">\n            <label>Created At</label>\n            <input type=\"text\" class=\"form-control\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "createdAt"), env.autoesc);
output += "\" disabled>\n        </div>\n\n\n    </form>\n</div>\n\n<div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-primary js-modal-save\">Gravar</button>\n    <button type=\"button\" class=\"btn btn-default js-modal-cancel\">Cancelar</button>\n\n    <div id=\"message-status\" style=\"margin-top: 35px;\"></div>\n    <div id=\"\" style=\"margin-top: 10px;\">\n        <h5 id=\"message-links\"></h5>\n    </div>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["users/templates/userNew.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"row\">\n    <div class=\"col-sm-10\" style=\"padding-top: 50px;\">\n\n\t\t<form class=\"form-horizontal\">\n\n\t\t  <div class=\"form-group\">\n\t\t    <label for=\"js-first-name\" class=\"col-sm-4 control-label\">First name</label>\n\t\t    <div class=\"col-sm-4\">\n\t\t      <input type=\"text\" class=\"form-control\" id=\"js-first-name\">\n\t\t    </div>\n\t\t  </div>\n\n\t\t  <div class=\"form-group\">\n\t\t    <label for=\"js-last-name\" class=\"col-sm-4 control-label\">Last name</label>\n\t\t    <div class=\"col-sm-4\">\n\t\t      <input type=\"text\" class=\"form-control\" id=\"js-last-name\">\n\t\t    </div>\n\t\t  </div>\n\n\t\t  <div class=\"form-group\">\n\t\t    <label for=\"js-email\" class=\"col-sm-4 control-label\">Email</label>\n\t\t    <div class=\"col-sm-4\">\n\t\t      <input type=\"text\" class=\"form-control\" id=\"js-email\">\n\t\t    </div>\n\t\t  </div>\n\n\t\t</form>\n\n\t\t<p class=\"text-center\">\n\t\t\t<button type=\"button\" class=\"btn btn-primary btn-lg\" id=\"create-user\">\n\t\t\t\t&nbsp;&nbsp;Save&nbsp;&nbsp;\n\t\t\t</button>\t\t\n\t\t</p>\n\n\t</div>\n</div>";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["users/templates/userRow.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "\n<td>\n\t";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "\n</td>\n\n<td>\n    ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "firstName"), env.autoesc);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "lastName"), env.autoesc);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "email"), env.autoesc);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "createdAt"), env.autoesc);
output += "\n</td>\n\n<td>\n    <button class=\"btn btn-primary btn-xs js-edit\"><span class=\"glyphicon glyphicon-pencil\"></span>\n    </button>\n    <button class=\"btn btn-danger btn-xs js-delete\"><span class=\"glyphicon glyphicon-trash\"></span>\n    </button>\n</td>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["users/templates/usersTable.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "\n<div class=\"xtable-responsive\">\n    <table class=\"table table-striped table-condensed table-dashboard\">\n\n\t\t<thead>\n\t\t\t<tr>\n\t\t\t\t<th>id</th>\n\t\t\t\t<th>First Name</th>\n\t\t\t\t<th>Last Name</th>\n\t\t\t\t<th>email</th>\n\t\t\t\t<th>Created At</th>\n\t\t\t</tr>\n\t\t</thead>\n\n        <tbody>\n        </tbody>\n\n    </table>\n</div>\n\n";
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
