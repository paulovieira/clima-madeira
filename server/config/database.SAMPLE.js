module.exports = {

    postgres: {
        host: "127.0.0.1",
        database: "db_name",
        username: "user",
        password: "pass"
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

