var auth = require( '../utilities/auth' );

// Login/Logout routes
module.exports = function( conn ) {
    // Renders the login form
    function form( req, res ) {
        res.render( 'login', { error: req.query.error, token: req.csrfToken() } );
    }
    // Removes the current user from the session and redirects to the login form
    function logout( req, res ) {
        delete req.session.userId;
        res.redirect( '/login' );
    }
    // Get user credentials and validate them, login if matched to the database
    function login( req, res ) {
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
            
            auth.compare( password, user.password, function( err ) {
                if ( err ) {
                    return res.redirect( '/login?error=1' );
                }

                req.session.userId = user.id;
                res.redirect( '/app' );
            });
        });
    }

    return {
        form: form,
        login: login,
        logout: logout
    };
};
