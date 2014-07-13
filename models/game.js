var db = require( '../utilities/database' ),
    _ = require( 'lodash' );

function Game( id ) {
    this.id = +id || 0;
}

Game.prototype.results = function( callback ) {
    db.conn.query( db.queries.RESULTS_BY_GAME_ID, [this.id], function( err, rows ) {
        if ( err || ! rows.length ) return callback( err, null );
        callback( err, rows[0] );
    });

    return this;
};

Game.prototype.bets = function( callback ) {
    db.conn.query( db.queries.USERBETS_BY_GAME_ID, [this.id], function( err, rows ) {
        if ( err || ! rows.length ) return callback( err, null );

        var bets = _.map( rows, function( bet ) {
            return {
                id: bet.user_id,
                bets: [
                    bet.team_1_bet,
                    bet.team_2_bet
                ]
            };
        });

        callback( err, bets );
    });

    return this;
};

Game.prototype.calculate = function( results, bets ) {
    // Team results and User bets
    var r1 = results[0],
        r2 = results[1],
        b1 = bets[0],
        b2 = bets[1];

    // Perfect bet gives 10 pts
    if ( r1 == b1 && r2 == b2 ) {
        return 10;
    }

    var points = 0,
        rDiff = r1 - r2,
        bDiff = b1 - b2;

    // Team 1 won
    if ( rDiff > 0 && bDiff > 0 ) {
        points += 4;
    // Team 2 won
    } else if ( rDiff < 0 && bDiff < 0 ) {
        points += 4;
    // Draw
    } else if ( rDiff == 0 && bDiff == 0 ) {
        points += 4;
    }

    // One bet equals goals for one team 
    if ( r1 == b1 || r2 == b2 ) {
        points += 1;
    }

    return points;
};

exports.Game = Game;
