// Dependencies
var crypto          = require( 'crypto' ),
    express         = require( 'express' ),
    logger          = require( 'morgan' ),
    bodyparser      = require( 'body-parser' ),
    cookieParser    = require( 'cookie-parser' ),
    cookieSession   = require( 'cookie-session' ),
    csrf            = require( 'csurf' ),
    fs              = require( 'fs' );

var cookieParserSecret = crypto.randomBytes( 64 ).toString( 'base64' ),
    cookieSessionSecret = crypto.randomBytes( 64 ).toString( 'base64' );

// Application configuration
exports.App = function( app ) {
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

// API configuration
exports.Api = function( api ) {
    api.use( logger() );
    api.use( bodyparser() );
    api.use( cookieParser( cookieParserSecret ) );
    api.use( cookieSession({ secret: cookieSessionSecret }) );
    api.use( csrf() );
};
