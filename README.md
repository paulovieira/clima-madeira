## 1. Bootstrap the application

- Create the database using the same user (might be necessary to change the login configurations in pg_hba.conf, the method should be md5 [?])

- Create the database (using the same user that is given in config/database.js)
	createdb test_150111

- update the configuration settings for the database (user, password and database): config/database.js (see below) 
- run the initial scripts (update the database): database/000_bootstrap_db.sh
- insert the initial data: cd database/populate && node index.js
- install global package:
    - nunjucks: sudo npm install nunjucks -g
    - forever: sudo npm install forever -g


## change config/server.js

publicUri
publicPort


## Start 

nodemon -e html,js index.js

or with forever:

START FOREVER IN "DEAMON MODE"
sudo forever start -m 50 -l forever_output.log -o server_stdout.log -e server_stderr.log --append --verbose --spinSleepTime 2000 --minUptime 1000  --uid "clima" server.js

LIST ALL THE PROCESSES
sudo forever list

STOP THE PROCESS WITH THE GIVEN REFERENCE
sudo forever stop clima


