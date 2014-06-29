var db = require( '../utilities/database' ),
    auth = require( '../utilities/auth' );

function calculate( results, bets ) {
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
