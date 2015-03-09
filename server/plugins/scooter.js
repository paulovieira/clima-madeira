// PLUGIN: Scooter

// a User-agent information plugin for hapi
// https://github.com/hapijs/scooter

module.exports = function registerScooter(server){

    server.register(
        {
            register: require('scooter'),
            options: {}
        }, 
        function (err) {

            if (err){ throw err; }

            console.log("plugin registered: scooter");
        }
    );

};


