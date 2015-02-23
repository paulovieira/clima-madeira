postgrator:

1) create a new db
2) create config/postgrator.js
3) export NODE_ENV=postgrator && node database/update_db.js 
4) change a seed file

## 1. Bootstrap the application

- Create the database using the same user (might be necessary to change the login configurations in pg_hba.conf, the method should be md5 [?])

- Create the database (using the same user that is given in config/database.js)
	createdb test_150111

- update the configuration settings for the database (user, password and database) in the config/prod.js
 
- run the initial scripts (update the database): 
    cd database && ./run_sql.sh

- insert the initial data: 
    export NODE_ENV=prod && node database/initial-data/populate/index.js 
- 
- install global package:
    - (???) nunjucks: sudo npm install nunjucks -g
    - forever: sudo npm install forever -g


## change config/server.js

publicUri
publicPort





## Start 

export NODE_ENV=prod
nodemon -e html,js index.js

or with forever:

START FOREVER IN "DEAMON MODE"

export NODE_ENV=prod
sudo forever start -m 50 -l forever_output.log -o server_stdout.log -e server_stderr.log --append --verbose --spinSleepTime 2000 --minUptime 1000  --uid "clima" server.js

LIST ALL THE PROCESSES
sudo forever list

STOP THE PROCESS WITH THE GIVEN REFERENCE
sudo forever stop clima


