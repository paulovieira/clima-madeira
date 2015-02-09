// PLUGIN: Hapi Swagger

// a Swagger interface for HAPI
// https://github.com/glennjones/hapi-swagger

module.exports = function registerHapiSwagger(server) {

    server.register(
        {
            register: require('hapi-swagger'),
            options: {
                basePath: 'http://localhost:3000',
                apiVersion: 0.1,

                // NOTE 150207 - i couldn't understand how to use this option
                authorizations: {
                    "session": {
                        type: "apiKey",
                        passAs: "header",
                        keyname: "authentication"
                    }
                },
            }
        },

        function(err) {
            if (err) {
                server.log(['error'], 'hapi-swagger load error: ' + err)
            }
            else {
                console.log("plugin registered: hapi-swagger");
                server.log(['start'], 'hapi-swagger interface loaded')
            }
        }

    );
};
