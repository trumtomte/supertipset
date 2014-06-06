// Dependencies
var express         = require( 'express' ),
    logger          = require( 'morgan' ),
    bodyparser      = require( 'body-parser' ),
    cookieParser    = require( 'cookie-parser' ),
    cookieSession   = require( 'cookie-session' ),
    csrf            = require( 'csurf' ),
    fs              = require( 'fs' );

var cookieParserSecret = '1823uc98duaks9duoisdfsdjkhfhkq0weu0djdqwd',
    cookieSessionSecret = 'pokrktg9031u4hhkadkKJDHKSD8QWEH1sdusd772EWJ';

// Middleware application configuration
exports.conf = function( app ) {
    app.set( 'view engine', 'jade' );
    app.use( logger() );
    app.use( function( req, res, next ) {
        // One of three static files
        if ( req.url == '/robots.txt' ||
             req.url == '/humans.txt' ||
             req.url == '/sitemap.xml' ) {

            fs.readFile( '.' + req.url, function( err, data ) {
                if ( err ) next( err );

                res.type( req.url.substr( req.url.length - 3 ) == 'txt' ? 'text/plain' : 'application/xml' );
                res.send( data );
            });

            return;
        }

        next();
    });
    app.use( '/assets', express.static( __dirname + '/../assets' ) );
    app.use( bodyparser() );
    app.use( cookieParser( cookieParserSecret ) );
    app.use( cookieSession({ secret: cookieSessionSecret }) );
    app.use( csrf() );
    app.use( function( req, res, next ) {
        res.cookie( 'XSRF-TOKEN', req.csrfToken() );
        next();
    });
};
