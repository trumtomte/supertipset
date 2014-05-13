var crypto = require( 'crypto' );

// Check if a user is already logged in
exports.check = function( req, res, next ) {
    if ( req.session.userId ) {
        return next();
    }

    return res.redirect( '/login?error=1' );
};

// Compare database hash with submitted hash
exports.compare = function( input, password, fn ) {
    // Get password parts (salt, hash, iterations)
    var parts = password.split( '::' ),
        salt = parts[0],
        databaseHash = parts[1],
        iterations = +parts[2];

    // Generate hash based on parts from the database and compare it to the submitted hash
    crypto.pbkdf2( input, salt, iterations, 64, function( err, hash ) {
        if ( err ) {
            console.log( err.toString() );
            return fn( err );
        }

        if ( databaseHash != hash.toString( 'base64' ) ) {
            return fn( new Error( 'Database hash does not match input hash' ) );
        }

        fn();
    });
};
