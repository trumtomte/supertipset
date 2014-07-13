var db = require( '../utilities/database' ),
    auth = require( '../utilities/auth' ),
    _ = require( 'lodash' );

var Group = require( '../models/group' ).Group;

function UserGroupCollection( id ) {
    this.id = id || 0;
}

UserGroupCollection.prototype.fetch = function( limit, callback ) {
    var id = this.id;

    db.conn.query( db.queries.USERGROUPS_BY_ID, [id], function( err, rows ) {
        if ( err || ! rows.length ) return callback( err, null );

        var data = _.map( _.groupBy( rows, 'group_name' ), function( value, key ) {

            var group = {
                id: value[0].group_id,
                name: value[0].group_name,
                admin: value[0].group_admin
            };

            var users = _.map( value, function( user ) {
                if ( user.id == id ) {
                    group.relation = user.relation;
                }

                return {
                    id: user.id,
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    points: user.points,
                    team: { id: user.team_id, name: user.team }
                };
            });
            
            group.users = limit > 0 ? users.splice( 0, limit ) : users;

            return group;
        });

        callback( err, data );
    });

    return this;
};

exports.UserGroupCollection = UserGroupCollection;

function UserGroup( id ) {
    this.id = id || 0;
}

UserGroup.prototype.remove = function( callback ) {
    db.conn.query( db.queries.DELETE_USERGROUP, [this.id], function( err, result ) {
        if ( err ) return callback( err, null );
        callback( err, result );
    });

    return this;
};

UserGroup.prototype.save = function( params, callback ) {
    var group = new Group();

    group.findByName( params.name, function( err, rows ) {
        if ( err || ! rows.length ) return callback( err, null );

        var g = rows[0];

        auth.compare( params.password, g.password, function( err ) {
            if ( err ) return callback( err, null );

            var data = { user_id: params.id, group_id: g.id };

            db.conn.query( db.queries.CREATE_USERGROUP, data, function( err ) {
                if ( err ) return callback( err, null );
                callback( err, data );
            });
        });
    });

    return this;
};

exports.UserGroup = UserGroup;
