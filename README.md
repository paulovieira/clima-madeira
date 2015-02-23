
## 1. Prepare the database

- Create the database using the same user (might be necessary to change the login configurations in pg_hba.conf, the method should be md5 [?])

- Create the database:
	createdb test_150111

- update the configuration settings for the database (user, password and database name) in the config/prod.js (or whatever environment will be used)
 
- run the initial scripts (create tables and sql functins): 
    cd database
    emacs run_sql.sh (edit the name of the database)
    ./run_sql.sh

- insert the initial data: 
    cd ..
    export NODE_ENV=prod && node database/initial-data/populate/index.js 

- make sure the required global packages are installed:
    - forever: sudo npm install forever -g


## 2. Set the required configurations in config/server.js

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


