## 1. Bootstrap the application

1) Create the database (might be necessary to change the login configurations in pg_hba.conf, the method should be md5 [?])
2) update the database settings (user, password and database): server/config/dbSettings.js 
3) run the initial scripts (update the database): database/000_bootstrap_db.sh
4) insert the initial data: cd database/populate && node index.js
5) install nunjucks globally: sudo npm install nunjucks -g


## 2. Start 

node index.js