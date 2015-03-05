
## 1. Prepare the database

Create the database using the same user (might be necessary to change the login configurations in pg_hba.conf, the method should be md5 [?])

    createdb test_150111

Run the initial scripts (create tables, sql functions, views, etc): 
   
    cd database && ./run_sql.sh test_150111

Update the configuration settings for the database (user, password and database name) in the config/prod.js (or whatever environment will be used)
 
Insert the initial data: 

    cd ..
    export NODE_ENV=prod && node database/initial-data/populate/index.js 


## 2. Set the required configurations in config/prod.js

publicUri
publicPort



## 3. Start the application

Make sure the required global modules are installed (nodemon, forever)

    sudo npm install forever -g
    sudo npm install nodemon -g

Make sure all the local modules are installed:

    sudo npm install 

Set the environment and start.

with nodemon:

    export NODE_ENV=prod

    nodemon -e html,js index.js

with forever (the app will execute in "deamon mode"):

    export NODE_ENV=prod

    sudo forever start -m 50 -l forever_output.log -o server_stdout.log -e server_stderr.log --append --verbose --spinSleepTime 2000 --minUptime 1000  --uid "clima" index.js

# 4. Commands to manage the process with forever

List all the processes:

    sudo forever list

Stop the process with the given reference (we named it "clima"):

    sudo forever stop clima


