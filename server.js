// Dependencies
var express         = require( 'express' ),
    mysql           = require( 'mysql' ),
    auth            = require( './utilities/auth' ),
    middleware      = require( './utilities/middleware' ),
    routes          = {},
    app             = express();

// HTTP port
var port = process.env.PORT || 3000;

// Create a MySQL connection
var conn = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS || '',
    database: process.env.MYSQL_DB || 'supertipset'
});

// Connect to the database
conn.connect(function( err ) {
    if ( err ) throw err;
    console.log( '[SERVER]: Database connection established' );
});

// Middleware configuration
middleware( app );

// API routes
['users', 'usergroups', 'groups', 'rounds', 'bets', 'login'].map( function( route ) {
    routes[route] = require( './routes/' + route )( conn );
});

// API
app.get( '/api/users/:id',      routes.users.findOne );
app.get( '/api/groups/:id',     routes.groups.findOne );
app.get( '/api/rounds/:id',     routes.rounds.find );
app.get( '/api/usergroups/:id', routes.usergroups.find );
app.get( '/api/bets/:id',       routes.bets.find );
app.put( '/api/bets/:id',       routes.bets.update );
app.post( '/api/bets/:id',      routes.bets.create );

// Login
app.get( '/login',  routes.login.form );
app.post( '/login', routes.login.login );
app.get( '/logout', routes.login.logout );

app.get( '/app', auth.check, function( req, res ) {
    res.render( 'app', { id: req.session.userId, dev: true } );
});

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
    res.status( err.status );
    res.render( 'error', { status: err.status } );
});

// Start listening for requests
app.listen( port, function() {
    console.log( '[SERVER]: Started listening on port ' + port );
});
