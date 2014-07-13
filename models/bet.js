var db = require( '../utilities/database' ),
    _ = require( 'lodash' );

function BetsCollection( id ) {
    this.id = id || 0;
}

BetsCollection.prototype.fetch = function( callback ) {
    db.conn.query( db.queries.BETS_BY_USER_ID, [this.id], function( err, rows ) {
        if ( err || ! rows.length ) return callback( err, null );

        var data = _.map( _.groupBy( rows, 'round' ), function( value, key ) {
            var bets = _.map( value, function( bet ) {
                return {
                    id: bet.bet_id,
                    game: bet.game_id,
                    game_start: bet.game_start,
                    game_stop: bet.game_stop,
                    teams: [
                        { id: bet.team_1_id, name: bet.team_1_name, bet: bet.team_1_bet },
                        { id: bet.team_2_id, name: bet.team_2_name, bet: bet.team_2_bet }
                    ]
                };
            });

            return {
                round: key,
                round_id: value[0].round_id,
                bets: bets
            };
        });

        callback( err, data );
    });

    return this;
};

exports.BetsCollection = BetsCollection;

function Bet( id ) {
    this.id = id || 0;
}

Bet.prototype.update = function( params, callback ) {
    db.conn.query( db.queries.UPDATE_BETS, params, function( err, result ) {
        if ( err ) return callback( err, null );
        callback( err, result );
    });

    return this;
};

Bet.prototype.save = function( params, callback ) {
    db.conn.query( db.queries.CREATE_BETS, params, function( err, result ) {
        if ( err ) return callback( err, null );
        callback( err, result );
    });

    return this;
};

exports.Bet = Bet;
