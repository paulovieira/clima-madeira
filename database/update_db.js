var Path = require('path'),
    fs = require("fs"),
    crypto = require("crypto"),
    config = require("config"),
    minimist = require("minimist"),
    _ = require("underscore"),
    Q = require("q");

var postgrator = require('./postgrator.js');

var argv = minimist(process.argv.slice(2), {
    string: ["version", "v"]
});

var migrationVersion = argv.version ? argv.version : 
                        argv.v ? argv.v :
                        "max";


postgrator.setConfig({
    migrationDirectory: Path.normalize(__dirname) + '/migrations', 
    driver: 'pg',
    host:     config.get("db.postgres.host"),
    database: config.get("db.postgres.database"),
    username: config.get("db.postgres.username"),
    password: config.get("db.postgres.password")
}); 


function fileChksum (filename) {
    var currentPath = Path.normalize(__dirname);
    var fullPath = Path.join(currentPath, filename);

    return checksum(fs.readFileSync(fullPath, 'utf8'));
}

function checksum (str) {
    return crypto.createHash('md5').update(str, 'utf8').digest('hex');
}

var deferred = Q.defer();

postgrator.migrate(migrationVersion, function (err, migrations) {

    postgrator.endConnection(function () {
        console.log("end connection");
        // connection is closed, unless you are using SQL Server
    });    

    if (err) {
        console.log(err);
        return deferred.reject(err);
    } 
    // else { 
    //     migrations.forEach(function(obj){
    //         console.log(obj);
    //     });
    // }

    return deferred.resolve(migrations);
});

deferred.promise
.then(
    function(migrations){
        return require("./populate/020-read-seeds-checksum.js");
//        console.log("will now populate the tables");

        // var promisesArray = [];

        // // 1) obter o md5sum dos ficheiros em seeds
        // // 2) ler os md5sum desses ficheiros na db
        // // 3) se forem diferentes, correr o respectivo scripts(s)

        // promisesArray.push(require("./populate/020-read-seeds-checksum.js"));
        // //promisesArray.push(require("./populate/029-populate-users.js"));
        // //promisesArray.push(require("./populate/039-populate-groups.js"));

        // //populate_users.then
        // return Q.all(promisesArray);
    }
)
.then(
    function(seeds_checksum){

        var texts = _.findWhere(seeds_checksum, {name: "texts.js"}) || {};

        var currentChksum = fileChksum("./populate/seeds/texts.js");
        if(texts.md5 !== currentChksum){

            console.log("checksum does not match");
            console.log("   will now run the correct populate script (returns a promise)");
            console.log("   will now update the checksum in the database");
            
        }

    }
)
.done(
    function(){
        console.log("all done!");
    },
    function(err){
        console.log("\n\nERROR!\n");
        console.log(err);
    }
);
