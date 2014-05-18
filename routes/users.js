var db = require( '../utilities/database' );

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

exports.create = function( req, res ) {
    // TODO
};
