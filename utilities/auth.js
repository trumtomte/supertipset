var crypto = require( 'crypto' );

// Middleware for checking if user is logged in
function check( req, res, next ) {
    if ( ! req.session.userId ) {
        res.redirect( '/login?error=1' );
    } else {
        next();
    }
}

// Compare password hashes
function compare( input, password, callback ) {
    // Get password parts (salt, hash, iterations)
    var parts = password.split( '::' ),
        salt = parts[0],
        dbhash = parts[1],
        iterations = +parts[2];
    
    // Generate hash based on the parts and compare it to the database hash
    crypto.pbkdf2( input, salt, iterations, 64, function( err, hash ) {
        if ( err ) {
            return callback( false );
        }

        if ( dbhash == hash.toString( 'base64' ) ) {
            return callback( true );
        }

        return callback( false );
    });
}

exports = module.exports = { check: check, compare: compare };
