var db = require( '../utilities/database' );

// Get all groups (and members) based on user id
exports.find = function( req, res, next ) {
    var id = req.params.id,
        limit = req.query.limit || 5;

    db.getUserGroups( id, function( err, rows ) {
        if ( err ) return next( err );

        if ( ! rows.length ) {
            return res.json( 204, {} );
        }

        var groupedGroups = {},
            groups = [];

        // Extract games by round
        rows.forEach( function( row ) {
            if ( ! ( row.group_name in groupedGroups ) ) {
                groupedGroups[row.group_name] = [];
            }

            // Only show amount of users based on "limit"
            if ( groupedGroups[row.group_name].length < limit ) {
                groupedGroups[row.group_name].push( row );
            }
        });

        for ( var key in groupedGroups ) {
            var group = {
                id: groupedGroups[key][0].group_id,
                name: groupedGroups[key][0].group_name,
                admin: groupedGroups[key][0].group_admin,
                relation: groupedGroups[key][0].relation
            };

            // Restructure each user object
            groupedGroups[key].forEach( function( user, i ) {
                groupedGroups[key][i] = {
                    id: user.id,
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    points: user.points,
                    team: {
                        id: user.team_id,
                        name: user.team
                    }
                };
            });

            group.users = groupedGroups[key];
            groups.push( group );
        }

        return res.json({ groups: groups });
    });
};

exports.remove = function( req, res, next ) {
    db.removeUserGroup( req.params.id, function( err, result ) {
        if ( err ) return next( err );

        return res.json( result );
    });
};
