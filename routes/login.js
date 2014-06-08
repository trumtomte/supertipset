var auth = require( '../utilities/auth' ),
    db = require( '../utilities/database' );

// Login form
exports.form = function( req, res ) {
    res.render( 'login', { error: req.query.error, token: req.csrfToken() } );
};

// Logout a user and redirect them to the login route
exports.logout = function( req, res ) {
    delete req.session.userId;
    res.redirect( '/login' );
};

// Login
exports.login = function( req, res ) {
    var username = req.body.username,
        password = req.body.password;

    db.getUser( username, function( err, rows ) {
        if ( err ) {
            console.log( 'Database error while trying to get user' );
            return res.redirect( '/login?error=1' );
        }

        if ( ! rows.length ) {
            console.log( 'User not found in database' );
            return res.redirect( '/login?error=1' );
        }

        var user = rows[0];

        auth.compare( password, user.password, function( err ) {
            if ( err ) {
                return res.redirect( '/login?error=1' );
            }

            // If login was successful, redirect to /app
            req.session.userId = user.id;
            res.redirect( '/app' );
        });
    });
};
