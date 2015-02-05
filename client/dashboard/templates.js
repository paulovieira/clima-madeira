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
output += "\n\n<div class=\"panel panel-primary\" style=\"border-radius: 0;\">\n\n    <div class=\"panel-heading\" style=\"border-radius: 0;\">\n        <a data-toggle=\"collapse\" href=\"#";
output += runtime.suppressValue(runtime.memberLookup((t_8),"groupCode", env.autoesc), env.autoesc);
output += "\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_8),"groupTitle", env.autoesc)),"pt", env.autoesc), env.autoesc);
output += "</a>\n    </div>\n\n    <div class=\"panel-body\" style=\"padding: 0; \">\n\n    \t";
output += runtime.suppressValue((lineno = 12, colno = 15, runtime.callWrap(t_4, "listGroup", [runtime.memberLookup((t_8),"groupCode", env.autoesc),runtime.memberLookup((t_8),"groupItems", env.autoesc)])), env.autoesc);
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["menuLeft/templates/test.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
env.getTemplate("menuLeft/templates/test3.html", function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(t_1.hasOwnProperty("test3")) {
var t_4 = t_1.test3;
} else {
cb(new Error("cannot import 'test3'")); return;
}
context.setVariable("test3", t_4);
output += "\n<ul>\n";
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
output += "\n\n\t<li id=\"";
output += runtime.suppressValue(runtime.memberLookup((t_8),"groupCode", env.autoesc), env.autoesc);
output += "\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_8),"groupTitle", env.autoesc)),"pt", env.autoesc), env.autoesc);
output += "</li>\n\n";
;
}
}
frame = frame.pop();
output += "\n</ul>\n\n";
output += runtime.suppressValue((lineno = 9, colno = 6, runtime.callWrap(t_4, "test3", ["xxx"])), env.autoesc);
output += "  \n\n";
output += runtime.suppressValue((lineno = 11, colno = 6, runtime.callWrap(t_4, "test3", ["yyy"])), env.autoesc);
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["menuLeft/templates/test2.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "this is included\n\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["menuLeft/templates/test3.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var macro_t_1 = runtime.makeMacro(
["x"], 
[], 
function (l_x, kwargs) {
frame = frame.push();
kwargs = kwargs || {};
if (kwargs.hasOwnProperty("caller")) {
frame.set("caller", kwargs.caller); }
frame.set("x", l_x);
var t_2 = "";t_2 += "\n\nthis is the macro: ";
t_2 += runtime.suppressValue(l_x, env.autoesc);
t_2 += "\n\n";
;
frame = frame.pop();
return new runtime.SafeString(t_2);
});
context.addExport("test3");
context.setVariable("test3", macro_t_1);
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
