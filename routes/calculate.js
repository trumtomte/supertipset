var db = require( '../utilities/database' );

// Return and calculate points given game results and user bets
function calculate( results, bets ) {
    // Game results (goals) and user bets (goals)
    var t1Result = results[0],
        t2Result = results[1],
        t1Bet = bets[0],
        t2Bet = bets[1];

    var points = 0;

    if ( t1Result == t1Bet &&
         t2Result == t2Bet ) {
        // Perfect bet = 4 points
        points += 4;
        return points;
    }

    // Calculate difference in goals
    var resultDiff = t1Result - t2Result,
        betDiff = t1Bet - t2Bet;
    
    // Correctly placed the bet on team 1 as the winner
    if ( resultDiff > 0 && betDiff > 0 ) {
        points += 1;
    // Correctly placed the bet on team 2 as the winner
    } else if ( resultDiff < 0 == betDiff < 0 ) {
        points += 1;
    // Correctly placed the bet on a game draw
    } else if ( resultDiff == 0 && betDiff == 0 ) {
        points += 1;
    }

    return points;
}
    
exports.game = function( req, res, next ) {
    var id = +req.body.id;

    db.getGameResults( id, function( err, rows ) {
        if ( err ) return next( err );

        if ( ! rows.length ) {
            return res.json({ message: 'Game not found' }); 
        }

        var results = [
            rows[0].team_1_goals,
            rows[0].team_2_goals
        ]

        db.getUserBetsByGame( id, function( err, rows ) {
            if ( err ) return next( err );

            if ( ! rows.length ) {
                return res.json({ message: 'No user bets found' });
            }

            var userPoints = [];

            rows.forEach( function( row ) {
                var bets = [row.team_1_bet, row.team_2_bet],
                    points = calculate( results, bets );

                userPoints.push([ points, id, row.user_id ]);
            });

            // console.log( userPoints );

            db.insertUserPoints( userPoints, function( err, results ) {
                if ( err ) return next( err );
                res.json( results );
            });
        });
    });
};

