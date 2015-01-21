## 1. Bootstrap the application

- Create the database using the same user (might be necessary to change the login configurations in pg_hba.conf, the method should be md5 [?])

- Create the database (using the same user that is given in database/settings.js)
	createdb test_150111

- update the database settings (user, password and database): server/config/dbSettings.js (see below) 
- run the initial scripts (update the database): database/000_bootstrap_db.sh
- insert the initial data: cd database/populate && node index.js
- install nunjucks globally: sudo npm install nunjucks -g


## change server/config/settings.js

uri

## 2. Start 

node index.js




```
module.exports = {

    postgres: {
        host: "127.0.0.1",
        database: "test_150111",
        username: "clima",
        password: "clima"
    },

    // NO NEED TO CHANGE ANYTHING BELOW!

    getConnectionString: function(db){
        var connectionString;
        switch(db){
            case "pg":
            case "postgres":
                connectionString = "postgres://" +
                                    this.postgres.username + ":" +
                                    this.postgres.password + "@" +
                                    this.postgres.host + "/" +
                                    this.postgres.database;
                break;
        }

        return connectionString;
    }
};


```