// Dependencies
var express     = require( 'express' ),
    auth        = require( './utilities/auth' ),
    middleware  = require( './utilities/middleware' ),
    routes      = {},
    server      = express(),
    app         = express.Router(),
    api         = express.Router();

// HTTP port
var port = process.env.PORT || 3000,
    dev = process.env.DEV || false;

server.set( 'view engine', 'jade' );

// Middleware configuration for the App and Api routers
middleware.app( app );
middleware.api( api );

[ // Require routes
    'users',
    'usergroups',
    'groups',
    'rounds',
    'bets',
    'specialbets',
    'teams',
    'toplists',
    'login',
    'calculate'
].map( function( route ) { routes[route] = require( './routes/' + route ); });

// ===============
// API Endpoints
// ===============
// api.use( auth.validate );

// Users
api.route( '/users/:id' )
    .get( routes.users.findOne )
    .put( routes.users.update );

// Groups
api.route( '/groups/:id' )
    .get( routes.groups.findOne )
    .put( routes.groups.update )
    .delete( routes.groups.remove );
api.route( '/groups' ).post( routes.groups.create );

// Rounds
api.route( '/rounds/:id' ).get( routes.rounds.find );

// User <-> Group relation
api.route( '/usergroups/:id' )
    .get( routes.usergroups.find )
    .delete( routes.usergroups.remove );
api.route( '/usergroups' ).post( routes.usergroups.create );

// Bets
api.route( '/bets/:id' )
    .get( routes.bets.find )
    .put( routes.bets.update )
    .post( routes.bets.create );

// Special bets
api.route( '/specialbets/:id' )
    .put( routes.specialbets.update )
    .post( routes.specialbets.create );

// Teams
api.route( '/teams' ).get( routes.teams.all );
api.route( '/teams/:id' ).get( routes.teams.findOne );

// Top lists
api.route( '/toplists' ).get( routes.toplists.all );
    
// 404 Handler
api.use( function( req, res, next ) {
    res.json( 404, { statusCode: 404, error: 'API endpoint does not exist' } );
});
// Error handler
api.use( function( err, req, res, next ) {
    console.log( '[API]', err );
    res.json( 500, { statusCode: 500, error: 'internal server error' } );
});

// ====================
// Application routes
// ====================
app.get( '/login',      routes.login.form );
app.post( '/login',     routes.login.login );
app.get( '/logout',     routes.login.logout );
app.post( '/calculate', routes.calculate.game );
app.post( '/users',     routes.users.create );

app.get( '/', function( req, res ) {
    res.render( 'index' );
});

app.get( '/app', auth.check, function( req, res ) {
    res.render( 'app', { id: req.session.userId, dev: dev } );
});

app.get( '/register', function( req, res ) {
    res.render( 'register', {
        error: req.query.error,
        token: req.csrfToken()
    });
});

// TODO Proper admin backend
app.get( '/admin-calculate', function( req, res ) {
    res.render( 'admin', {
        error: req.query.error,
        success: req.query.success,
        token: req.csrfToken()
    });
});

// 404 Handler
app.use( function( req, res, next ) {
    var err = new Error( 'Page Not Found' );
    err.status = 404;
    next( err );
});

// Error handler
app.use( function( err, req, res, next ) {
    console.log( '[APP]', err );
    // TODO better error pages
    err.status = err.status || 500;
    res.status( err.status );
    res.render( 'error', { status: err.status } );
});

// Make server use App/API endpoints
server.use( '/api', api );
server.use( '/', app );

// Start listening for HTTP requests
server.listen( port, function() {
    console.log( '[SERVER]: Started listening on port ' + port );
});
