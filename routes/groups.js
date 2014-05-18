var db = require( '../utilities/database' );

// Get a group (and members) based on group id
exports.findOne = function( req, res, next ) {
    db.getGroup( req.params.id, function( err, rows ) {
        if ( err ) return next( err );

        if ( ! rows.length ) {
            return res.json( 204, {} );
        }

        var group = {
            id: rows[0].group_id,
            name: rows[0].group_name,
            admin: rows[0].group_admin,
            description: rows[0].group_description
        };

        // Restructure each user objects
        rows.forEach( function( row, i ) {
            rows[i] = {
                id: row.id,
                username: row.username,
                firstname: row.firstname,
                lastname: row.lastname,
                points: row.points,
                team: {
                    id: row.team_id,
                    name: row.team
                }
            };
        });

        group.users = rows;

        return res.json({ group: group });
    });
};
