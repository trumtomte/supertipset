// Dependencies
var express     = require( 'express' ),
    auth        = require( './utilities/auth' ),
    middleware  = require( './utilities/middleware' ),
    routes      = {},
    app         = express(),
    // Custom router for API endpoints
    api         = express.Router();

// HTTP port
var port = process.env.PORT || 3000,
    dev = process.env.DEV ? true : false;

// Middleware configuration
// TODO split into two separate routers (App/API)
middleware.conf( app );

[ // API Routes
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

// API endpoints
api.use( auth.validate );
api.get( '/users/:id',          routes.users.findOne );
api.put( '/users/:id',          routes.users.update );
api.get( '/groups/:id',         routes.groups.findOne );
api.delete( '/groups/:id',      routes.groups.remove );
api.put( '/groups/:id',         routes.groups.update );
api.post( '/groups',            routes.groups.create );
api.get( '/rounds/:id',         routes.rounds.find );
api.get( '/usergroups/:id',     routes.usergroups.find );
api.delete( '/usergroups/:id',  routes.usergroups.remove );
api.post( '/usergroups',        routes.usergroups.create );
api.get( '/bets/:id',           routes.bets.find );
api.put( '/bets/:id',           routes.bets.update );
api.post( '/bets/:id',          routes.bets.create );
api.put( '/specialbets/:id',    routes.specialbets.update );
api.post( '/specialbets/:id',   routes.specialbets.create );
api.get( '/teams',              routes.teams.all );
api.get( '/teams/:id',          routes.teams.findOne );
api.get( '/toplists',           routes.toplists.all );
// Define API entry endpoint
app.use( '/api', api );

// Login
app.get( '/login',  routes.login.form );
app.get( '/logout', routes.login.logout );
app.post( '/login', routes.login.login );

// Backend
app.get( '/app', auth.check, function( req, res ) {
    res.render( 'app', { id: req.session.userId, dev: dev } );
});

app.post( '/calculate', routes.calculate.game );
app.get( '/admin-calculate', function( req, res ) {
    res.render( 'admin', {
        error: req.query.error,
        success: req.query.success,
        token: req.csrfToken()
    });
});

// Frontend
app.get( '/', function( req, res ) {
    res.render( 'index' );
});

app.get( '/register', function( req, res ) {
    res.render( 'register', {
        error: req.query.error,
        token: req.csrfToken()
    });
});
app.post( '/users', routes.users.create );

// 404 (passes the error to the error handler)
app.use( function( req, res, next ) {
    var err = new Error( 'Page Not Found' );
    err.status = 404;
    next( err );
});

// Error handler
app.use( function( err, req, res, next ) {
    // TODO more correctly split middleware between the App and API?
    if ( req.path.split( '/' )[1] == 'api' ) {
        console.log( err );
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
