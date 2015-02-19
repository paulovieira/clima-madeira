var config = require('config');
//var utils = require(global.rootPath +  'server/common/utils.js');
var pre = require(global.rootPath +  'server/common/pre.js');
var validate = require(global.rootPath + 'server/common/validate.js');
var baseHandlers = require(global.rootPath + 'server/routes/base-handlers.js');

var routes = [


    // if lang param is not given, direct immediately to the default laguage
    {
        path: "/",
        method: "GET",
        handler: baseHandlers.index,
        
        config: {
            auth: false,
        }
    },


    {
        path: "/{lang}",
        method: "GET",
        handler: baseHandlers.generalPage,

        config: {
            auth: {
                mode: "try"
            },

            validate: {
                params: validate.params.lang
            },

            pre: [
                [
                    pre.db.read_texts  // assign to textsC
                ],
                pre.transform_texts,   // assign to texts
                pre.extractImages     // assign to images
            ]
        }

    },


    {
        path: "/{lang}/{page1}",
        method: "GET",
        handler: baseHandlers.generalPage,

        config: {
            auth: {
                mode: "try"
            },

            validate: {
                params: validate.params.lang
            },

            pre: [
                [pre.db.read_texts],
                pre.transform_texts,
                pre.extractImages
            ]
        }
    },


    {
        path: "/{lang}/{page1}/{page2}",
        method: "GET",
        handler: baseHandlers.generalPage,

        config: {
            auth: {
                mode: "try"
            },

            validate: {
                params: validate.params.lang
            },

            pre: [
                [pre.db.read_texts],
                pre.transform_texts,
                pre.extractImages
            ]
        }
    },


    {
        method: "GET",
        path: "/{lang}/recover",
        handler: baseHandlers.recover,

        config: {
            auth: false,

            validate: {
                params: validate.params.lang,
                query: validate.query.recoverToken
            },

            pre: [
                [pre.db.read_texts, pre.db.read_user_by_token],
                pre.transform_texts
            ]
        }

    },


    {
        method: "GET",
        path: "/{lang}/404",
        handler: baseHandlers.missing,

        config: {
            auth: false,

            validate: {
                params: validate.params.lang
            },

            pre: [
                [pre.db.read_texts],
                pre.transform_texts
            ]
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
                params: validate.params.lang
            },

            pre: [
                [pre.db.read_texts],
                pre.transform_texts
            ]
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
                params: validate.params.lang
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
                params: validate.params.lang
            }
        }
    },

    {
        method: "GET",
        path: "/{lang}/dashboard",
        handler: baseHandlers.dashboard,

        config: {

            //auth: utils.getAuthConfig("try"),

            auth: config.get('hapi.auth'),

            validate: {
                params: validate.params.lang
            },

            pre: [
                [pre.db.read_texts],
                pre.transform_texts
            ]
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
                params: validate.params.lang
            }
        }
    },


    {
        method: "GET",
        path: "/{lang}/testpre",
        handler: baseHandlers.testpre,

        config: {
            auth: {
                mode: "try"
            },

            validate: {
                params: validate.params.lang
            },

            pre: [
                // running the pre method in parallel is equivalent to using only 1 pre method
                // taking care of several promises and using Q.all([promise1, promise2]);
                // the route handler will only execute when ALL the pre-handlers have called reply()
                //[pre.db.read_texts, pre.db.read_users],  
                [pre.db.read_users],
                //                utils.pre.db.read_texts,
                //              utils.pre.db.read_users
            ]
        }
    },


    {
        method: "GET",
        path: "/test_footer",
        handler: function(request, reply){
            return reply.view("test_footer");
        },
        config: {
            auth: false
        }
    },

];

//utils.addPrerequisites(routes);

console.log("Routes without the redirectOnInvalidLang pre-requisite:");

routes
    .filter(function(routeObj) {
        if (routeObj.config &&
            routeObj.config.validate &&
            routeObj.config.validate.params === validate.params.lang) {
            return true;
        }

        console.log("   " + routeObj.path);
        return false;
    })
    .forEach(function(routeObj) {
        routeObj.config.pre = routeObj.config.pre || [];
        routeObj.config.pre.unshift(pre.redirectOnInvalidLang);
    });

module.exports = routes;
