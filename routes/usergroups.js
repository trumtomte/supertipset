var db = require( '../utilities/database' ),
    auth = require( '../utilities/auth' );

// Get all groups (and members) based on user id
exports.find = function( req, res, next ) {
    var id = req.params.id,
        limit = req.query.limit || 0;

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

            groupedGroups[row.group_name].push( row );
        });

        for ( var key in groupedGroups ) {
            var group = {
                id: groupedGroups[key][0].group_id,
                name: groupedGroups[key][0].group_name,
                admin: groupedGroups[key][0].group_admin
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

                // Get the user - group relation id and assign it to the group
                if ( user.id == id ) {
                    group.relation = user.relation;
                }
            });

            group.users = limit > 0 ? groupedGroups[key].splice( 0, limit ) : groupedGroups[key];
            groups.push( group );
        }

        return res.json({ groups: groups });
    });
};

// Remove user <-> group relation
exports.remove = function( req, res, next ) {
    db.removeUserGroup( req.params.id, function( err, result ) {
        if ( err ) return next( err );
        res.json( 200 );
    });
};

// Create a user <-> group relation
exports.create = function( req, res, next ) {
    db.getGroupSummary( req.body.name, function( err, rows ) {
        if ( err ) return next( err );

        if ( ! rows.length ) {
            return res.json( 400, { statusCode: 400, error: 'Group by [name] could not be found' } );
        }

        var group = rows[0];

        auth.compare( req.body.password, group.password, function( err ) {
            if ( err ) {
                return res.json( 400, { statusCode: 400, error: 'Invalid password for [group]' } );
            }

            var params = {
                user_id: req.body.id,
                group_id: group.id
            };

            // TODO fix / better solution
            // Send data as an array
            // INSERT IGNORE in query
            // UNIQUE KEY ... (user_id, group_id) in database
            // Instead of "LIMIT 1" in subquery

            db.createUserGroup( params, function( err, result ) {
                if ( err ) return next( err );
                res.json( group );                
            });
        });
    });
};
