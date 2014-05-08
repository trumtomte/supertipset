// Dependencies
var express         = require( 'express' ),
    logger          = require( 'morgan' ),
    bodyparser      = require( 'body-parser' ),
    cookieParser    = require( 'cookie-parser' ),
    cookieSession   = require( 'cookie-session' ),
    csrf            = require( 'csurf' ),
    mysql           = require( 'mysql' ),
    fs              = require( 'fs' ),
    app             = express();

// HTTP port
var port = process.env.PORT || 3000;

// Create a MySQL connection
conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'supertipset'
});

// Connect to the database
conn.connect(function( err ) {
    if ( err ) throw err;
    console.log( 'Connected to the database!' );
});

// Authentication utility
var auth = require( './utilities/auth' );

app.set( 'view engine', 'jade' );

// ExpressJS configuration
app.use( logger( 'dev' ) );
app.use( function( req, res, next ) {
    switch( req.url ) {
        case '/robots.txt': // fallthrough
        case '/humans.txt':
            fs.readFile( '.' + req.url, function( err, data ) {
                if ( err ) next( err );
                res.type( 'text/plain' );
                res.send( data );
            });
            break;
        case '/sitemap.xml':
            fs.readFile( './sitemap.xml', function( err, data ) {
                if ( err ) next( err );
                res.type( 'application/xml' );
                res.send( data );
            });
            break;
        default:
            next();
            break;
    }
});
app.use( '/assets', express.static( __dirname + '/assets' ) );
app.use( bodyparser() );
app.use( cookieParser( 'kpofgkhoe155rtuhsdkqwe08uq9we' ) );
app.use( cookieSession({ secret: 'asjdoiasdj9awpewqeidwimdiwq' }) );
app.use( csrf() );
app.use( function( req, res, next ) {
    res.cookie( 'XSRF-TOKEN', req.csrfToken() );
    next();
});

// API endpoints
var routes = {
    users:      require( './routes/users' )( conn ),
    usergroups: require( './routes/usergroups' )( conn ),
    groups:     require( './routes/groups' )( conn ),
    rounds:     require( './routes/rounds' )( conn ),
    bets:       require( './routes/bets' )( conn )
};

app.get( '/api/users/:id',      routes.users.findOne );
app.get( '/api/usergroups/:id', routes.usergroups.find );
app.get( '/api/groups/:id',     routes.groups.findOne );
app.get( '/api/rounds/:id',     routes.rounds.find );

// Bets
app.get( '/api/bets/:id',       routes.bets.find );
app.put( '/api/bets/:id',       routes.bets.update );
app.post( '/api/bets/:id',      routes.bets.create );

app.get( '/app', auth.check, function( req, res ) {
    res.render( 'app', { id: req.session.userId, dev: true } );
});

app.get( '/login', function( req, res ) {
    res.render( 'login', { error: req.query.error, token: req.csrfToken() } );
});

app.post( '/login', function( req, res ) {
    var username = req.body.username,
        password = req.body.password;

    conn.query( 'SELECT id, username, password FROM Users WHERE username = ?', [username], function( err, rows ) {
        if ( err ) {
            console.log( 'Database error' );
            return res.redirect( '/login?error=1' );
        }

        if ( ! rows.length ) {
            console.log( 'User not found in database' );
            return res.redirect( '/login?error=1' );
        }

        var user = rows[0];
        
        auth.compare( password, user.password, function( valid ) {
            if ( ! valid ) {
                return res.redirect( '/login?error=1' );
            }

            req.session.userId = user.id;
            return res.redirect( '/app' );
        });
    });
});

app.get( '/logout', function( req, res ) {
    delete req.session.userId;
    res.redirect( '/login' );
});

app.get( '/', function( req, res ) {
    res.send( 'le index page' );
});

// 404 - passes the error to the error handler
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

app.listen( port, function() {
    console.log( 'Started listening on port 3000' );
});
