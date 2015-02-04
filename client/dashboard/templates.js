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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["mainLayout/templates/main-layout.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"row\">\n\n    <div class=\"col-sm-3\" id=\"main-left-region\">\n    </div>\n\n    <div class=\"col-sm-9\" id=\"main-right-region\">\n    </div>\n\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["menuLeft/templates/menu-left-macros.html"] = (function() {function root(env, context, frame, runtime, cb) {
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["menuLeft/templates/menuLeftGroup.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"panel-group\" style=\"margin-bottom: 5px;\">\n  <div class=\"panel panel-primary\">\n\n    <div class=\"panel-heading\">\n      <h4 class=\"panel-title\">\n        <a data-toggle=\"collapse\" href=\"#";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "groupCode"), env.autoesc);
output += "\">\n\n          ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "groupTitle")),runtime.contextOrFrameLookup(context, frame, "lang"), env.autoesc), env.autoesc);
output += "\n\n        </a>\n      </h4>\n    </div>\n\n\n    <div class=\"mn-items-region\">\n    </div>\n\n  </div>\n</div>\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["menuLeft/templates/menuLeftItem.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<a href=\"#\" class=\"list-group-item\" id=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "itemCode"), env.autoesc);
output += "\">\n    <span class=\"\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "itemTitle")),runtime.contextOrFrameLookup(context, frame, "lang"), env.autoesc), env.autoesc);
output += " </span>\n    <span class=\"mn-arrow-region pull-right\" ></span>\n</a>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["texts/templates/newText.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"row\">\n    <div class=\"col-sm-10\" style=\"padding-top: 50px;\">\n\n\t\t<form class=\"form-horizontal\">\n\t\t  <div class=\"form-group\">\n\t\t    <label for=\"pt\" class=\"col-sm-2 control-label\">pt</label>\n\t\t    <div class=\"col-sm-10\">\n\t\t      <input type=\"text\" class=\"form-control\" id=\"js-new-pt\" placeholder=\"Insira o novo texto (português)\">\n\t\t    </div>\n\t\t  </div>\n\n\t\t  <div class=\"form-group\">\n\t\t    <label for=\"en\" class=\"col-sm-2 control-label\">en</label>\n\t\t    <div class=\"col-sm-10\">\n\t\t      <input type=\"text\" class=\"form-control\" id=\"js-new-en\" placeholder=\"Insert new text (english)\">\n\t\t    </div>\n\t\t  </div>\n\n\t\t</form>\n\n\t\t<p class=\"text-center\">\n\t\t\t<button type=\"button\" class=\"btn btn-primary btn-lg\" id=\"create-text\">\n\t\t\t\t&nbsp;&nbsp;Save&nbsp;&nbsp;\n\t\t\t</button>\t\t\n\t\t</p>\n\n\t</div>\n</div>";
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
output += "</td>x\n<td><input type=\"text\" class=\"js-pt\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "pt"), env.autoesc);
output += "\"></td>\n<td><input type=\"text\" class=\"js-en\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "en"), env.autoesc);
output += "\"></td>\n<td>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "author"), env.autoesc);
output += "</td>\n<td>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "lastUpdated"), env.autoesc);
output += "</td>\n";
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
output += "\n<div class=\"row\">\n    <div class=\"col-sm-10 center-blockx\">\n\n\t\t<div class=\"table-responsive\">\t\n\t\t\t<table class=\"table table-striped\">\n\n\t\t\t\t<thead>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th>idxxx</th>\n\t\t\t\t\t\t<th>pt</th>\n\t\t\t\t\t\t<th>en</th>\n\t\t\t\t\t\t<th>Author</th>\n\t\t\t\t\t\t<th>Last Update:</th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\n\t\t\t\t<tbody>\n\t\t\t\t</tbody>\n\t\t\t  \n\t\t\t</table>\n\t\t</div>\n\n\t\t<p class=\"text-center\">\n\t\t\t<button type=\"button\" class=\"btn btn-primary btn-lg\" id=\"update-texts\">\n\t\t\t\t&nbsp;&nbsp;Save&nbsp;&nbsp;\n\t\t\t</button>\t\t\n\t\t</p>\n\t\t\n\n    </div>\n</div>\n\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["users/templates/newUser.html"] = (function() {function root(env, context, frame, runtime, cb) {
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
output += "\n\n<td>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</td>\n<td>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "firstName"), env.autoesc);
output += "</td>\n<td>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "lastName"), env.autoesc);
output += "</td>\n<td>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "email"), env.autoesc);
output += "</td>\n<td>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "createdAt"), env.autoesc);
output += "</td>";
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
output += "\n<div class=\"row\">\n    <div class=\"col-sm-10 center-blockx\">\n\n\t\t<div class=\"table-responsive\">\t\n\t\t\t<table class=\"table table-striped\">\n\n\t\t\t\t<thead>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th>id</th>\n\t\t\t\t\t\t<th>First Name</th>\n\t\t\t\t\t\t<th>Last Name</th>\n\t\t\t\t\t\t<th>email</th>\n\t\t\t\t\t\t<th>Created At</th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\n\t\t\t\t<tbody>\n\t\t\t\t</tbody>\n\t\t\t  \n\t\t\t</table>\n\t\t</div>\n\n\t\t<p class=\"text-center\">\n\t\t\t<button type=\"button\" class=\"btn btn-primary btn-lg\" id=\"update-texts\">\n\t\t\t\t&nbsp;&nbsp;Save&nbsp;&nbsp;\n\t\t\t</button>\t\t\n\t\t</p>\n\t\t\n\n    </div>\n</div>\n\n\n";
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
