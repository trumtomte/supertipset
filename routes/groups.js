var db = require( '../utilities/database' ),
    auth = require( '../utilities/auth' ),
    crypto = require( 'crypto' );

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

// Remove a group by id
exports.remove = function( req, res, next ) {
    db.removeGroup( req.params.id, function( err, result ) {
        if ( err ) return next( err );

        return res.json( result );
    });
};

// Create a new group and add the user <-> group relation
exports.create = function( req, res, next ) {
    // Fetch group by name to see if it exists
    db.getGroupSummary( req.body.name, function( err, rows ) {
        if ( err ) return next( err );

        if ( rows.length ) {
            return res.json( 400, { statusCode: 400, error: 'Group by [name] already exists' } );
        }

        // Generate random password
        var password = crypto.randomBytes(4).toString( 'hex' );

        // Generate password hash (salt+hash+iterations)
        auth.generate( password, function( err, hash ) {
            if ( err ) return next( err );

            var params = {
                name: req.body.name,
                user_id: req.body.user_id,
                description: '',
                password: hash
            };

            // Create the group
            db.createGroup( params, function( err, result ) {
                if ( err ) return next( err );

                var params = {
                    user_id: req.body.user_id,
                    group_id: result.insertId
                };

                // Create the user <-> group relation
                db.createUserGroup( params, function( err, result ) {
                    if ( err ) return next( err );

                    // Return group id and password
                    res.json({ id: params.group_id, password: password });
                });
            });
        });
    });
};

// Update a group by id
exports.update = function( req, res, next ) {
    var cb = function( err, result ) {
        if ( err ) return next( err );
        res.json( result );
    };

    if ( req.body.user_id ) {
        db.updateGroup( 'admin', [req.body.user_id, req.body.id], cb );
    } else if ( req.body.description ) {
        db.updateGroup( 'description', [req.body.description, req.body.id], cb );
    } else if ( req.body.password ) {
        // TODO fix
    }
};
