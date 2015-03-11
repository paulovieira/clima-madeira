
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
        // should be redefined in some other configuration file (that should be present in .gitignore)
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

        // should be redefined in some other configuration file (that should be present in .gitignore)
        postgres: {
            host: "127.0.0.1",
            database: "db_name",
            username: "db_username",
            password: "db_password",

            getConnectionString: function(){
                return "postgres://" +
                        this.username + ":" +
                        this.password + "@" +
                        this.host + "/" +
                        this.database;
            }
        },
    },

    availableRoutes: [

        {
            param1: "",
            param2: "",
            param3: ""
        },

        // ----------------------
        
        {
            param1: "introducao",
            param2: "mensagem",
            param3: ""
        },
        {
            param1: "introducao",
            param2: "metodologia",
            param3: ""
        },
        {
            param1: "introducao",
            param2: "workshops",
            param3: ""
        },            {
            param1: "introducao",
            param2: "equipa",
            param3: ""
        },

        // ----------------------
        
        {
            param1: "sumario-executivo",
            param2: "",
            param3: ""
        },

        // ----------------------
        {
            param1: "sectores",
            param2: "clima",
            param3: ""
        },            
        {
            param1: "sectores",
            param2: "clima",
            param3: "forest-growth"
        },            
        // ----------------------
        {
            param1: "sectores",
            param2: "adaptacao",
            param3: ""
        },
        {
            param1: "sectores",
            param2: "adaptacao",
            param3: "forest-growth"
        },
        // ----------------------
        {
            param1: "sectores",
            param2: "saude",
            param3: ""
        },
        {
            param1: "sectores",
            param2: "saude",
            param3: "forest-growth"
        },
        // ----------------------
        {
            param1: "sectores",
            param2: "turismo",
            param3: ""
        },
        {
            param1: "sectores",
            param2: "turismo",
            param3: "forest-growth"
        },
        // ----------------------
        {
            param1: "sectores",
            param2: "energia",
            param3: ""
        },
        {
            param1: "sectores",
            param2: "energia",
            param3: "forest-growth"
        },
        // ----------------------
        {
            param1: "sectores",
            param2: "biodiversidade",
            param3: ""
        },
        {
            param1: "sectores",
            param2: "biodiversidade",
            param3: "forest-growth" 
        },
        // ----------------------
        {
            param1: "sectores",
            param2: "risco-hidrologico",
            param3: ""
        },
        {
            param1: "sectores",
            param2: "risco-hidrologico",
            param3: "forest-growth"
        },
        // ----------------------
        {
            param1: "sectores",
            param2: "qualidade-disponibilidade-agua",
            param3: ""
        },
        {
            param1: "sectores",
            param2: "qualidade-disponibilidade-agua",
            param3: "forest-growth"
        },
        // ----------------------
        {
            param1: "sectores",
            param2: "agricultura-florestas",
            param3: ""
        },
        {
            param1: "sectores",
            param2: "agricultura-florestas",
            param3: "forest-growth"
        },

        // ----------------------

        // ----------------------
        
        {
            param1: "cartografia",
            param2: "",
            param3: ""
        },

        // ----------------------
        
        {
            param1: "estrategia-adaptacao",
            param2: "",
            param3: ""
        }

    ]


};
