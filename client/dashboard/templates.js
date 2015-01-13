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
return function(ctx, cb) { return nunjucks.render("default/templates/default.html", ctx, cb); }})();
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
return function(ctx, cb) { return nunjucks.render("mainLayout/templates/main-layout.html", ctx, cb); }})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["menuLeft/templates/menu-left-macros.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var macro_t_1 = runtime.makeMacro(
["groupId", "groupTitle", "groupItems"], 
[], 
function (l_groupId, l_groupTitle, l_groupItems, kwargs) {
frame = frame.push();
kwargs = kwargs || {};
if (kwargs.hasOwnProperty("caller")) {
frame.set("caller", kwargs.caller); }
frame.set("groupId", l_groupId);
frame.set("groupTitle", l_groupTitle);
frame.set("groupItems", l_groupItems);
var t_2 = "";t_2 += "\n\n<div class=\"panel-group\" style=\"margin-bottom: 4px;\">\n  <div class=\"panel panel-default\">\n  \n    <div class=\"panel-heading\">\n      <h4 class=\"panel-title\">\n        <a data-toggle=\"collapse\" href=\"#";
t_2 += runtime.suppressValue(l_groupId, env.autoesc);
t_2 += "\">\n          ";
t_2 += runtime.suppressValue(l_groupTitle, env.autoesc);
t_2 += "\n        </a>\n      </h4>\n    </div>\n\n\n    <ul id=\"";
t_2 += runtime.suppressValue(l_groupId, env.autoesc);
t_2 += "\" class=\"list-group panel-collapse collapse in\">\n        ";
frame = frame.push();
var t_5 = l_groupItems;
if(t_5) {var t_4 = t_5.length;
for(var t_3=0; t_3 < t_5.length; t_3++) {
var t_6 = t_5[t_3];
frame.set("item", t_6);
frame.set("loop.index", t_3 + 1);
frame.set("loop.index0", t_3);
frame.set("loop.revindex", t_4 - t_3);
frame.set("loop.revindex0", t_4 - t_3 - 1);
frame.set("loop.first", t_3 === 0);
frame.set("loop.last", t_3 === t_4 - 1);
frame.set("loop.length", t_4);
t_2 += "\n            <li class=\"list-group-item\" id=\"";
t_2 += runtime.suppressValue(runtime.memberLookup((t_6),"itemId", env.autoesc), env.autoesc);
t_2 += "\">\n                ";
t_2 += runtime.suppressValue(runtime.memberLookup((t_6),"itemTitle", env.autoesc), env.autoesc);
t_2 += "\n            </li>\n        ";
;
}
}
frame = frame.pop();
t_2 += "\n    </ul>\n\n\n  </div>\n</div>\n\n";
;
frame = frame.pop();
return new runtime.SafeString(t_2);
});
context.addExport("menuGroup");
context.setVariable("menuGroup", macro_t_1);
output += "\n\n\n\n";
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
return function(ctx, cb) { return nunjucks.render("menuLeft/templates/menu-left-macros.html", ctx, cb); }})();
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
return function(ctx, cb) { return nunjucks.render("menuLeft/templates/menuLeftGroup.html", ctx, cb); }})();
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
return function(ctx, cb) { return nunjucks.render("menuLeft/templates/menuLeftItem.html", ctx, cb); }})();
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
return function(ctx, cb) { return nunjucks.render("texts/templates/newText.html", ctx, cb); }})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["texts/templates/textRow.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<td>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "id"), env.autoesc);
output += "</td>\n<td><input type=\"text\" class=\"js-pt\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "pt"), env.autoesc);
output += "\"></td>\n<td><input type=\"text\" class=\"js-en\" value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "en"), env.autoesc);
output += "\"></td>\n<td>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "authorData")),"firstName", env.autoesc), env.autoesc);
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "authorData")),"lastName", env.autoesc), env.autoesc);
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
return function(ctx, cb) { return nunjucks.render("texts/templates/textRow.html", ctx, cb); }})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["texts/templates/textsTable.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "\n<div class=\"row\">\n    <div class=\"col-sm-10 center-blockx\">\n\n\t\t<div class=\"table-responsive\">\t\n\t\t\t<table class=\"table table-striped\">\n\n\t\t\t\t<thead>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th>id</th>\n\t\t\t\t\t\t<th>pt</th>\n\t\t\t\t\t\t<th>en</th>\n\t\t\t\t\t\t<th>author</th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\n\t\t\t\t<tbody>\n\t\t\t\t</tbody>\n\t\t\t  \n\t\t\t</table>\n\t\t</div>\n\n\t\t<p class=\"text-center\">\n\t\t\t<button type=\"button\" class=\"btn btn-primary btn-lg\" id=\"update-texts\">\n\t\t\t\t&nbsp;&nbsp;Save&nbsp;&nbsp;\n\t\t\t</button>\t\t\n\t\t</p>\n\t\t\n\n    </div>\n</div>\n\n\n";
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
return function(ctx, cb) { return nunjucks.render("texts/templates/textsTable.html", ctx, cb); }})();

