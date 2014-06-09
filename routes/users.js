var db = require( '../utilities/database' ),
    auth = require( '../utilities/auth' );

// Get summary of user information based on user id
exports.findOne = function( req, res, next ) {
    db.getUserSummary( req.params.id, function( err, rows ) {
        if ( err ) return next( err );

        if ( ! rows.length ) {
            return res.json( 204, {} );
        }

        // Restructure user object
        var user = {
            id: rows[0].id,
            username: rows[0].username,
            firstname: rows[0].firstname,
            lastname: rows[0].lastname,
            points: rows[0].points,
            player: {
                id: rows[0].player_id,
                firstname: rows[0].player_firstname,
                lastname: rows[0].player_lastname,
                goals: rows[0].player_goals,
                team: rows[0].player_team
            },
            team: {
                id: rows[0].team_id,
                name: rows[0].team
            }
        };

        return res.json({ user: user });
    });
};

// Create a new user
exports.create = function( req, res, next ) {
    if ( req.body.email == '' ||
         req.body.username == '' ||
         req.body.firstname == '' ||
         req.body.lastname == '' ||
         req.body.firstPassword == '' ||
         req.body.secondPassword == '' ) {
        return res.redirect( '/register?error=1' );
     }

    if ( req.body.firstPassword !== req.body.secondPassword ) {
        return res.redirect( '/register?error=1' );
    }

    var password = req.body.firstPassword;

    db.getUser( req.body.username, function( err, rows ) {
        if ( err ) return res.redirect( '/register?error=3' );

        if ( rows.length ) {
            return res.redirect( '/register?error=2' );
        }

        auth.generate( password, function( err, hash ) {
            if ( err ) return res.redirect( '/register?error=3' );

            var user = {
                email: req.body.email,
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: hash
            };

            db.createUser( user, function( err, result ) {
                if ( err ) return res.redirect( '/register?error=3' );

                req.session.userId = result.insertId;
                res.redirect( '/app' );
            });
        });
    });
};

exports.update = function( req, res, next ) {
    var id = req.params.id,
        password = req.body.password;

    auth.generate( password, function( err, hash ) {
        if ( err ) return next( err );

        db.updateUserPass( [hash, id], function( err, result ) {
            if ( err ) return next( err );
            res.json( 200 );
        });
    });
};
