- create repo at github
    + create the ignore file: server/config/dbSettings.js
- create new npm module:
    + backbone-pg DONE
    + change-case-keys DONE
- when saving important fields that will be used to identigy somethiing (such as emails), make sure we use toLowerCase

-the main index.js file shouldn't have any logic from hapi. It should be used to set global configurations, 

    require('pretty-error').start();
    require('colors');
    Nunjucks.configure(...)
    start pg

-enviar password por email
-criar utilizadores
-criar grupos
-criar textos
-editar textos inline



-create a big "SAVE" in the bottom
-loop over the texts collection
-filter by the hasChanged attribute
-create a new collection with the filtered models
-use collection.save() 


-texts rest route: take into account the validations for put and post (we should delete some properties in the client before sending the payload)