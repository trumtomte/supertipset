var db = require( '../utilities/database' ),
    auth = require( '../utilities/auth' );

function User( id ) {
    this.id = id || 0;
}

User.prototype.fetch = function( callback ) {
    db.conn.query( db.queries.USER_BY_ID, [this.id], function( err, rows ) {
        if ( err || ! rows.length ) return callback( err, null );

        var r = rows[0];

        var data = {
            id: r.id,
            username: r.username,
            firstname: r.firstname,
            lastname: r.lastname,
            points: r.points,
            player: {
                id: r.player_id,
                firstname: r.player_firstname,
                lastname: r.player_lastname,
                goals: r.player_goals,
                team: r.player_team
            },
            team: { id: r.team_id, name: r.team }
        };

        callback( err, data );
    });

    return this;
};

User.prototype.findByUsername = function( username, callback ) {
    db.conn.query( db.queries.USER_BY_NAME, [username], function( err, rows ) {
        if ( err || ! rows.length ) return callback( err, null );

        var r = rows[0];

        var data = {
            id: r.id,
            username: r.username,
            password: r.password
        };

        callback( err, data );
    });

    return this;
};

User.prototype.save = function( params, callback ) {
    db.conn.query( db.queries.USER_BY_NAME, [params.username], function( err, rows ) {
        if ( err || rows.length ) return callback( err, null );

        auth.generate( params.password, function( err, hash ) {
            if( err ) return callback( err, null );

            // Update password to the newly generated hash
            params.password = hash;

            db.conn.query( db.queries.CREATE_USER, params, function( err, result ) {
                if ( err ) return callback( err, null );
                callback( err, result );
            });
        });
    });

    return this;
};

User.prototype.update = function( password, callback ) {
    var id = this.id;

    auth.generate( password, function( err, hash ) {
        if ( err ) return callback( err, null );

        db.conn.query( db.queries.UPDATE_USER_PASS, [hash, id], function( err, result ) {
            if ( err ) return callback( err, null );
            callback( err, result );
        });
    });

    return this;
};

exports.User = User;
