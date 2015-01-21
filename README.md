## 1. Bootstrap the application

- Create the database using the same user (might be necessary to change the login configurations in pg_hba.conf, the method should be md5 [?])

- Create the database (using the same user that is given in config/database.js)
	createdb test_150111

- update the configuration settings for the database (user, password and database): config/database.js (see below) 
- run the initial scripts (update the database): database/000_bootstrap_db.sh
- insert the initial data: cd database/populate && node index.js
- install nunjucks globally: sudo npm install nunjucks -g


## change server/config/settings.js

uri

## 2. Start 

node index.js


