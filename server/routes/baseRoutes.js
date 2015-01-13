var config = require('../config/settings.js');
var utils = require('../config/utils.js');
var baseHandlers = require('../handlers/baseHandlers.js');

var routes = [

    {
        path: "/{lang}",
        method: "GET",
        handler: baseHandlers.home,

        config: {
            auth: {
                mode: "try"
            },
            validate: {
                params: utils.validate.params.lang
            }
        }

    },

    // if lang param is not given, direct immediately to the default laguage
    {
        path: "/",
        method: "GET",
        handler: baseHandlers.index,
        config: {
            auth: {
                mode: "try"
            },
            /*            app: { lang: false } */
        }
    },

    {
        method: "GET",
        path: "/{lang}/404",
        handler: baseHandlers.missing,

        config: {
            auth: false,
            validate: {
                params: utils.validate.params.lang
            }
        }

    },

    {
        method: "GET",
        path: "/{lang}/login",
        handler: baseHandlers.login,

        config: {
            auth: {
                mode: "try"
            },
            validate: {
                params: utils.validate.params.lang
            }
        }
    },

    {
        method: "POST",
        path: "/{lang}/loginAuthenticate",
        handler: baseHandlers.loginAuthenticate,

        config: {
            auth: {
                mode: "try"
            },
            validate: {
                params: utils.validate.params.lang
            }
        }
    },

    {
        method: "GET",
        path: "/{lang}/logout",
        handler: baseHandlers.logout,
        config: {
            auth: false,
            validate: {
                params: utils.validate.params.lang
            }
        }
    },

    {
        method: "GET",
        path: "/{lang}/dashboard",
        handler: baseHandlers.dashboard,

        config: {

            auth: {
                mode: "try"
            },

//            auth: false,
            validate: {
                params: utils.validate.params.lang
            }
        },
    },

    // catch-all route
    {
        method: "GET",
        path: "/{lang}/{anyPath*}",
        handler: baseHandlers.catchAll,

        config: {
            auth: {
                mode: "try"
            },
            validate: {
                params: utils.validate.params.lang
            }
        }
    },
];

//utils.addPrerequisites(routes);

console.log("Routes without the redirectOnInvalidLang pre-requisite:");

routes
    .filter(function(routeObj) {
        if (routeObj.config &&
            routeObj.config.validate &&
            routeObj.config.validate.params === utils.validate.params.lang) {
            return true;
        }

        console.log("	" + routeObj.path);
        return false;
    })
    .forEach(function(routeObj) {
        routeObj.config.pre = routeObj.config.pre || [];
        routeObj.config.pre.push(utils.preRequisites.redirectOnInvalidLang);
    });

module.exports = routes;
