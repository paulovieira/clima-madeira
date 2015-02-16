
module.exports = {

    host: "localhost",
    port: 3000,
    //debugEndpoint: "/debug/consol",  // endpoint to be used in the TV module

    publicUri: "http://localhost",  // the domain name
    publicPort: 3000,  // probably 80

    // the default language is the first in the array below
    allowedLanguages: ["pt", "en"],


    hapi: {

        // options for the Hapi.Server object (to be used in the main index.js)
        server: {
            connections: {
                router: {
                    isCaseSensitive: false,
                    stripTrailingSlash: true
                }            
            }
        },

        // options for the views (to be used in the main index.js)
        views: {
            path: global.rootPath + 'server/views',
            engines: {
                "html": require('hapi-nunjucks')
            }
        },

        auth: {
            mode: "try"
        },

        // documentation: https://github.com/hapijs/joi#validatevalue-schema-options-callback
        joi: {
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

    },


    email: {
        // TODO: add this file to ignore
        mandrill: {
            host: "smtp.mandrillapp.com",
            port: 587,
            smtpUsername: "x@y.com",
            apiKey: "123456789"
        },

        fromEmail: "paulovieira@gmail.com",
        fromName: "CLIMA-MADEIRA",

        subject: "Password recovery",
        body: "To recover your password, please click the following link: "
    },

    db: {

        postgres: {
            host: "127.0.0.1",
            database: "test_150111",
            username: "clima",
            password: "clima",

            getConnectionString: function(){
                return "postgres://" +
                        this.username + ":" +
                        this.password + "@" +
                        this.host + "/" +
                        this.database;
            }
        },
    }

};
