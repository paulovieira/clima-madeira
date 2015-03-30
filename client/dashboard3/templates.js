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
output += "</td>\n\n<td class=\"text-right\">\n    <button class=\"btn btn-primary btn-xs js-edit\"><span class=\"glyphicon glyphicon-pencil\"></span>\n    </button>\n    <button class=\"btn btn-danger btn-xs js-delete\"><span class=\"glyphicon glyphicon-trash\"></span>\n    </button>\n</td>\n\n";
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
output += "<ul class=\"nav nav-tabs\">\n    <li role=\"presentation\" class=\"active\">\n        <a href=\"#\" data-tab-separator=\"texts-all\">Todos os textos</a>\n    </li>\n    <li role=\"presentation\">\n        <a href=\"#\" data-tab-separator=\"texts-new\">Novo texto</a>\n    </li>\n</ul>\n\n<div id=\"texts-region\"></div>";
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
