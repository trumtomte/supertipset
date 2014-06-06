var crypto = require( 'crypto' );

// Check if a user is already logged in
exports.check = function( req, res, next ) {
    if ( req.session.userId ) return next();
    res.redirect( '/login?error=1' );
};

// Used to validate API requests (only allowed for active users
exports.validate = function( req, res, next ) {
    if ( req.session.userId ) return next();
    res.json( 401, { statusCode: 401, error: 'Unauthorized request to API' } );
};

// Compare database hash with submitted hash
exports.compare = function( input, password, fn ) {
    // Get password parts (salt, hash, iterations)
    var parts = password.split( '::' ),
        salt = parts[0],
        databaseHash = parts[1],
        iterations = +parts[2]
        len = 64;

    // Generate hash based on parts from the database and compare it to the submitted hash
    crypto.pbkdf2( input, salt, iterations, len, function( err, hash ) {
        if ( err ) throw err;

        if ( databaseHash != hash.toString( 'base64' ) ) {
            return fn( new Error( 'Database hash does not match input hash' ) );
        }

        fn();
    });
};

// Generates a hash based on input password
exports.generate = function( password, fn ) {
    var salt = crypto.randomBytes( 64 ).toString( 'base64' ),
        iter = Math.floor( Math.random() * ( 1200 - 1000 + 1 ) ) + 1000,
        len = 64;

    crypto.pbkdf2( password, salt, iter, len, function( err, hash ) {
        fn( err, [salt, hash.toString( 'base64' ), iter].join( '::' ));
    });
};
