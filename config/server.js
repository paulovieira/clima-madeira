
module.exports = {

    // use "dev" to disable authentication/cookie
    environment: "!dev",

    host: "localhost",
    port: parseInt(process.env.PORT, 10) || 3000,
    //debugEndpoint: "/debug/consol",  // endpoint to be used in the TV module

    publicUri: "http://localhost",  // the domain name
    publicPort: 3000,  // probably 80

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
        path: global.rootPath + 'server/views',
        engines: {
            "html": require('hapi-nunjucks')
        }
    },

    // documentation: https://github.com/hapijs/joi#validatevalue-schema-options-callback
    joiOptions: {
        abortEarly: false,  // returns all the errors found (does not stop on the first error)
        allowUnknown: true, // allows object to contain unknown keys (they will be deleted)
        stripUnknown: true  // delete unknown keys
/*


        convert: ...
        skipFunctions: ...
        stripUnknown: ...
        language: ...
        presence: ...
        context: ...
*/
    },

};
