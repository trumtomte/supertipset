var db = require( '../utilities/database' ),
    _ = require( 'lodash' );

function RoundsCollection( id ) {
    this.id = id || 0;
}

RoundsCollection.prototype.fetch = function( callback ) {
    db.conn.query( db.queries.ROUNDS_BY_ID, [this.id], function( err, rows ) {
        if ( err || ! rows.length ) return callback( err, null );


        var data = _.map( _.groupBy( rows, 'round' ), function( value, key ) {

            var games = _.map( value, function( game ) {
                return {
                    id: game.game_id,
                    start: game.game_start,
                    stop: game.game_stop,
                    group: game.group_name,
                    teams: [
                        { id: game.team_1_id, name: game.team_1_name, result: game.team_1_result },
                        { id: game.team_2_id, name: game.team_2_name, result: game.team_2_result }
                    ]
                };
            });
            
            return {
                name: key,
                id: value[0].round_id,
                start: value[0].round_start,
                stop: value[0].round_stop,
                games: games
            };
        });

        callback( err, data );
    });

    return this;
};

exports.RoundsCollection = RoundsCollection;
