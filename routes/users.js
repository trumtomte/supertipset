var User = require( '../models/user' ).User;

// Get summary of user information based on user id
exports.findOne = function( req, res, next ) {
    var user = new User( req.params.id );

    user.fetch( function( err, data ) {
        if ( err ) next( err );
        if ( ! data ) return res.send( 204 );
        res.json({ user: data });
    });
};

// Create a new user
exports.create = function( req, res, next ) {
    // Empty field
    if ( req.body.email == '' ||
         req.body.username == '' ||
         req.body.firstname == '' ||
         req.body.lastname == '' ||
         req.body.firstPassword == '' ||
         req.body.secondPassword == '' ) {
        return res.redirect( '/register?error=1' );
    }

    // Passwords doesnt match
    if ( req.body.firstPassword !== req.body.secondPassword ) {
        return res.redirect( '/register?error=1' );
    }

    req.body.password = req.body.firstPassword;

    // Object cleanup
    delete req.body.firstPassword;
    delete req.body.secondPassword;
    delete req.body._csrf;

    var user = new User();

    user.save( req.body, function( err, data ) {
        if ( err ) {
            console.log( err );
            return res.redirect( '/register?error=3' );
        }
        req.session.userId = data.insertId;
        res.redirect( '/app' );
    });
};

exports.update = function( req, res, next ) {
    var user = new User( req.params.id );

    user.update( req.body.password, function( err ) {
        if ( err ) next( err );
        res.send( 204 );
    });
};
