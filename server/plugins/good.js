// PLUGIN: Good

// hapi process monitoring
// https://github.com/hapijs/good

var goodOptions = {
    opsInterval: 1000,
    reporters: [{
        reporter: require('good-console'),
        args:[
            { 
                error: "*",   // all internal errors (thrown) will be logged
                response: "*"
            }, 
            {
                format: "YYYY-MM-DD HH:mm:ss.SSS"
            }
        ]
    }]
};

module.exports = function registerScooter(server){

    server.register(
        {
            register: require('good'),
            options: goodOptions
        }, 
        function (err) {

            if (err){ throw err; }

            console.log("plugin registered: good");
        }
    );

};


