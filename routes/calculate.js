var db = require( '../utilities/database' ),
    auth = require( '../utilities/auth' );

// Return and calculate points given game results and user bets
function calculate( results, bets ) {
    // Game results (goals) and user bets (goals)
    var t1Result = results[0],
        t2Result = results[1],
        t1Bet = bets[0],
        t2Bet = bets[1];

    if ( t1Result == t1Bet &&
         t2Result == t2Bet ) {
        // Perfect bet gives 10 pts
        return 10;
    }

    var points = 0;

    // Calculate difference in goals
    var resultDiff = t1Result - t2Result,
        betDiff = t1Bet - t2Bet;
    
    // Correctly placed the bet on team 1 as the winner
    if ( resultDiff > 0 && betDiff > 0 ) {
        points += 4;
    // Correctly placed the bet on team 2 as the winner
    } else if ( resultDiff < 0 && betDiff < 0 ) {
        points += 4;
    // Correctly placed the bet on a game draw
    } else if ( resultDiff == 0 && betDiff == 0 ) {
        points += 4;
    }

    // If a user placed a bet equal to goals from one of the teams = 1 pts
    if ( t1Result == t1Bet || t2Result == t2Bet ) {
        points += 1;
    }

    return points;
}

// TODO Add calculation for special bets (!)
    
// TODO better solution
// Calculate points for each user based on game results and user bets
// This requires the password of one specific user
exports.game = function( req, res, next ) {
    var id = +req.body.id,
        password = req.body.password;

    db.getUser( 'superuser', function( err, rows ) {
        if ( err || ! rows.length ) {
            return res.redirect( '/admin-calculate?error=1' );
        }

        var user = rows[0];

        auth.compare( password, user.password, function( err ) {
            if ( err ) {
                return res.redirect( '/admin-calculate?error=1' );
            }

            db.getGameResults( id, function( err, rows ) {
                if ( err || ! rows.length ) {
                    return res.redirect( '/admin-calculate?error=1' );
                }

                var results = [
                    rows[0].team_1_goals,
                    rows[0].team_2_goals
                ]

                db.getUserBetsByGame( id, function( err, rows ) {
                    if ( err || ! rows.length ) {
                        return res.redirect( '/admin-calculate?error=1' );
                    }

                    var userPoints = [];

                    rows.forEach( function( row ) {
                        var bets = [row.team_1_bet, row.team_2_bet],
                            points = calculate( results, bets );

                        userPoints.push([ points, id, row.user_id ]);
                    });

                    db.insertUserPoints( userPoints, function( err, results ) {
                        if ( err ) {
                            return res.redirect( '/admin-calculate?error=1' );
                        }

                        res.redirect( '/admin-calculate?success=1' );
                    });
                });
            });
        });
    });
};
