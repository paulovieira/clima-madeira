module.exports = function(grunt) {


    grunt.initConfig({

        /*** nunjucks - compile client-side templates (to be loaded using nunjucks-slim) ***/

        nunjucks: {

            dashboard: {
                baseDir: 'client/dashboard',
                src: ['client/dashboard/**/*.html'],
                dest: 'client/dashboard/templates.js',
                options: {}
            },

        },


        /*** browserify - compile client-side apps ***/

        browserify: {

            "lib": {
                src: [],
                dest: 'client/test/lib.js',
                options: {
                    alias: [
                        './client/common/js/jquery.js:jQuery',
                    ]
                }
            },

            "test-dev": {
                src: ["client/test/js/**/*.js"],
                dest: "client/test/app.js",
                options: {
                	external: ['jQuery'],
                    browserifyOptions: {
                        debug: true
                    }
                },
            },

            "test-prod": {
                src: ["client/test/js/**/*.js"],
                dest: "client/test/app.js",
                //exclude: "client/test/app.js",
                options: {
                    banner: "/** this is the banner for the prod version **/",
                	external: ['jQuery'],
                    browserifyOptions: {
                        debug: false
                    }
                }
            }
        },


        /*** watch task ***/

        watch: {
            "dashboard templates": {
                files: 'client/dashboard/**/*.html',
                tasks: ['nunjucks:dashboard']
            },
            "compile-js-dev test": {
                files: 'client/test/js/**/*.js',
                tasks: ['browserify:test-dev']
            },
        }
    });

    grunt.loadNpmTasks('grunt-nunjucks');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // register task(can be explicitely executed in the command line: "grunt compile-js" will compile all the client-side apps)

    // NOTE: "grunt compile-js:test" and "grunt browserify:test" are equivalent (will execute the same task:target)
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('compile-templates', ['nunjucks:dashboard']);

    grunt.registerTask('compile-js-dev', ['browserify:test-dev']);
    grunt.registerTask('compile-js-prod', ['browserify:test-prod']);

};
