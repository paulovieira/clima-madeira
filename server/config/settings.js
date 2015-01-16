var path = require('path'),
    Nunjucks = require('hapi-nunjucks');

var rootPath = path.normalize(__dirname + '/../..');


module.exports = {

    rootPath: rootPath,

    host: "localhost",
    port: parseInt(process.env.PORT, 10) || 3000,
    debugEndpoint: "/debug/consol",  // endpoint to be used in the TV module

    // the default language is the first in the array below
    allowedLanguages: ["pt", "en"],

    // options for the Hapi.Server object (to be used in the main index.js)
    serverOptions: {
        connections: {
            router: {
                isCaseSensitive: false,
                stripTrailingSlash: true
            }            
        }
    },

    // options for the views (to be used in the main index.js)
    viewsOptions: {
        path: path.join(rootPath, 'server/views'),
        engines: {
            "html": Nunjucks
        }
    },

    // documentation: https://github.com/hapijs/joi#validatevalue-schema-options-callback
    joiOptions: {
        abortEarly: false,  // returns all the errors found (does not stop on the first error)
/*
        allowUnknown: true, // allows object to contain unknown keys (will be ignored)

        convert: ...
        skipFunctions: ...
        stripUnknown: ...
        language: ...
        presence: ...
        context: ...
*/
    }

};
