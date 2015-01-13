To compile the nunjucks templates, nunjucks should be installed globally:

    sudo npm install nunjucks -g

This will also install the nunjucks-precompile script

We can precompiling a whole directory:

    nunjucks-precompile . > templates.js

The script will search all subdirectories for the templates, includes, macros, etc.

To load the templates in the browser, use nunjucks-slim.js

http://mozilla.github.io/nunjucks/api.html#browser-usage

http://mozilla.github.io/nunjucks/getting-started.html