// Dependencies
var express     = require( 'express' ),
    auth        = require( './utilities/auth' ),
    middleware  = require( './utilities/middleware' ),
    routes      = {},
    app         = express(),
    // Custom router for API endpoints
    api         = express.Router();

// HTTP port
var port = process.env.PORT || 3000;

// Middleware configuration
middleware.conf( app );

[ // API Routes
    'users',
    'usergroups',
    'groups',
    'rounds',
    'bets',
    'specialbets',
    'teams',
    'login'
].map( function( route ) { routes[route] = require( './routes/' + route ); });

// API endpoints
api.get( '/users/:id',          routes.users.findOne );
api.get( '/groups/:id',         routes.groups.findOne );
api.get( '/rounds/:id',         routes.rounds.find );
api.get( '/usergroups/:id',     routes.usergroups.find );
api.get( '/bets/:id',           routes.bets.find );
api.put( '/bets/:id',           routes.bets.update );
api.post( '/bets/:id',          routes.bets.create );
api.put( '/specialbets/:id',    routes.specialbets.update );
api.get( '/teams',              routes.teams.all );
api.get( '/teams/:id',          routes.teams.findOne );
// Define API entry endpoint
app.use( '/api', api );

// Login
app.get( '/login',  routes.login.form );
app.get( '/logout', routes.login.logout );
app.post( '/login', routes.login.login );

// Backend
app.get( '/app', auth.check, function( req, res ) {
    res.render( 'app', { id: req.session.userId, dev: true } );
});

// Frontend
app.get( '/', function( req, res ) {
    res.render( 'index' );
});

// 404 (passes the error to the error handler)
app.use( function( req, res, next ) {
    var err = new Error( 'Page Not Found' );
    err.status = 404;
    next( err );
});

// Error handler
app.use( function( err, req, res, next ) {
    console.log( '[ERROR]', err, '[REQUEST]', req);

    if ( req.path.split( '/' )[1] == 'api' ) {
        res.json( 500, { statusCode: 500, error: 'Internal Server Error' } );
    } else {
        err.status = err.status || 500;
        res.status( err.status );
        res.render( 'error', { status: err.status } );
    }
});

// Start listening for requests
app.listen( port, function() {
    console.log( '[SERVER]: Started listening on port ' + port );
});
