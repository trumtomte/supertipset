var auth = require( '../utilities/auth' ),
    User = require( '../models/user' ).User;

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
    var user = new User();

    user.findByUsername( req.body.username, function( err, data ) {
        if ( err || ! data ) return res.redirect( '/login?error=1' );

        auth.compare( req.body.password, data.password, function( err ) {
            if ( err ) return res.redirect( '/login?error=1' );
            req.session.userId = data.id;
            res.redirect( '/app' );
        });
    });
};
