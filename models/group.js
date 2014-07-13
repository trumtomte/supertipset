var db = require( '../utilities/database' ),
    auth = require( '../utilities/auth' ),
    crypto = require( 'crypto' ),
    _ = require( 'lodash' );

function Group( id ) {
    this.id = id || 0;
}

Group.prototype.fetch = function( callback ) {
    db.conn.query( db.queries.GROUP_BY_ID, [this.id, 1], function( err, rows ) {
        if ( err || ! rows.length ) return callback( err, null );

        var r = rows[0];

        var group = {
            id: r.group_id,
            name: r.group_name,
            admin: r.group_admin,
            description: r.group_description,
            users: _.map( rows, function( user ) {
                return {
                    id: user.id,
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    points: user.points,
                    team: { id: user.team_id, name: user.team }
                };
            })
        };

        callback( err, group );
    });

    return this;
};

Group.prototype.findByName = function( name, callback ) {
    db.conn.query( db.queries.GROUPSUMMARY_BY_NAME, [name], function( err, rows ) {
        if ( err || ! rows.length ) return callback( err, null );
        callback( err, rows );
    });

    return this;
};

Group.prototype.save = function( params, callback ) {
    db.conn.query( db.queries.GROUPSUMMARY_BY_NAME, [params.name], function( err, rows ) {
        if ( err || rows.length ) return callback( err, null );

        var password = crypto.randomBytes( 4 ).toString( 'hex' );

        auth.generate( password, function( err, hash ) {
            if ( err ) return callback( err, null );

            var group = {
                name: params.name,
                user_id: params.user_id,
                password: hash,
                description: ''
            };

            db.conn.query( db.queries.CREATE_GROUP, group, function( err, result ) {
                if ( err ) return callback( err, null );

                var g = {
                    user_id: params.user_id,
                    group_id: result.insertId
                };

                db.conn.query( db.queries.CREATE_USERGROUP, g, function( err, result ) {
                    if ( err ) return callback( err, null );
                    callback( err, { id: g.group_id, password: password });
                });
            });
        });
    });

    return this;
};

Group.prototype.update = function( params, callback ) {
    var query = '';

    if ( params.user_id ) {
        query = db.queries.UPDATE_GROUP + 'user_id = ? WHERE id = ?';
    } else if ( params.description ) {
        query = db.queries.UPDATE_GROUP + 'description = ? WHERE id = ?';
    } else if ( params.password ) {
        query = db.queries.UPDATE_GROUP + 'password = ? WHERE id = ?';
    }

    if ( params.password ) {
        var id = this.id,
            password = crypto.randomBytes( 4 ).toString( 'hex' );

        auth.generate( password, function( err, hash ) {
            if ( err ) return callback( err, null );
            db.conn.query( query, [hash, id], function( err, result ) {
                if ( err ) return callback( err, null );
                callback( err, password );
            });
        });
        
    } else {
        db.conn.query( query, [params.user_id || params.description, this.id], function( err, result ) {
            if ( err ) return callback( err, null );
            callback( err, result );
        });
    }

    return this;
};

Group.prototype.remove = function( callback ) {
    db.conn.query( db.queries.DELETE_GROUP, [this.id], function( err, result ) {
        if ( err ) return callback( err, null );
        callback( err, result );
    });

    return this;
};

exports.Group = Group;
