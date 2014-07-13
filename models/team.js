var db = require( '../utilities/database' ),
    _ = require( 'lodash' );

function TeamsCollection( id ) {
    this.id = id || 0;
}

TeamsCollection.prototype.fetch = function( callback ) {
    db.conn.query( db.queries.ALL_TEAMS, function( err, rows ) {
        if ( err || ! rows.length ) return callback( err, null );

        var data = _.map( _.groupBy( rows, 'team' ), function( value, key ) {

            var players = _.map( value, function( player ) {
                return {
                    id: player.player_id,
                    firstname: player.player_firstname,
                    lastname: player.player_lastname
                };
            });

            return {
                name: key,
                id: value[0].id,
                players: players
            };
        });

        callback( err, data );
    });

    return this;
};

exports.TeamsCollection = TeamsCollection;

function Team( id ) {
    this.id = id || 0;
}

Team.prototype.fetch = function( callback ) {
    db.conn.query( db.queries.TEAM_BY_ID, [this.id], function( err, rows ) {
        if ( err || ! rows.length ) return callback( err, null );

        var team = {
            id: rows[0].id,
            name: rows[0].team
        };

        team.players = _.map( rows, function( player ) {
            return {
                id: player.player_id,
                firstname: player.player_firstname,
                lastname: player.player_lastname
            };
        });

        callback( err, team );
    });

    return this;
};

exports.Team = Team;
