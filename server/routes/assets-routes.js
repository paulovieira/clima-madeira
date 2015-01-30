var routeTable = [

    // STATIC ASSETS - the handler is given here directly (unlike the handlers for the base routes)
    {
        method: 'GET',
        path: '/common/{anyPath*}',
        handler: {
            directory: { path: './client/common' }
        },
        config: {
            auth: false,
        }
    },

    {
        method: 'GET',
        path: '/dashboard/{anyPath*}',
        handler: {
            directory: { path: './client/dashboard' }
        },
        config: {
            auth: false,
        }
    },

    {
        method: 'GET',
        path: '/ferramenta/{anyPath*}',
        handler: {
            directory: { path: './client/ferramenta' }
        },
        config: {
            auth: false,
        }
    },

    {
        method: 'GET',
        path: '/test/{anyPath*}',
        handler: {
            directory: { path: './client/test' }
        },
        config: {
            auth: false,
        }
    }

];

module.exports = routeTable;