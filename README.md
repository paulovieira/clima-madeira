s## 0. Install node packages

    sudo npm install

## 1. Prepare the database

Create the database using the same user (might be necessary to change the login configurations in pg_hba.conf, the method should be md5 [?])

    createdb test_150111

Run the initial scripts (create tables, sql functions, views, etc): 
   
    cd database 
    ./run_sql.sh test_150111

Set the environment:

    cd .. 
    export NODE_ENV=prod

Update the configuration settings for the database (user, password and database name) for the environment that was defined:

    emacs config/prod.js
    (edit the values in db.postgres)
 
Insert the initial data: 

    node database/initial-data/populate/index.js 


## 2. Set the required configurations in config/prod.js

    emacs config/prod.js
    (edit publicUri and publicPort)


## 3. Start the application

Make sure the required global modules are installed (nodemon, forever)

    sudo npm install forever -g
    sudo npm install nodemon -g

Make a quick test with nodemon:

    nodemon index.js

Then run the app permanently with forever or PM2 (the app will execute in "deamon mode"):

    export NODE_APP_NAME=clima

    sudo forever start -m 50 -l forever_output.log -o server_stdout.log -e server_stderr.log --append --verbose --spinSleepTime 2000 --minUptime 1000  --uid "$NODE_APP_NAME" index.js

## 4. Commands to manage the process with forever

List all the processes:

    sudo forever list

Stop the process with the given reference (stop it before any updates):

    sudo forever stop $NODE_APP_NAME


