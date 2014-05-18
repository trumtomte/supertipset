var db = require( '../utilities/database' );

// Get all bets based on user id
exports.find = function( req, res, next ) {
    db.getBets( req.params.id, function( err, rows ) {
        if ( err ) return next( err );

        if ( ! rows.length ) {
            return res.json( 204, {} );
        }

        var groupedBets = {},
            bets = [];

        rows.forEach( function( row ) {
            if ( ! ( row.round in groupedBets ) ) {
                groupedBets[row.round] = [];
            }

            groupedBets[row.round].push( row );
        });

        for ( var key in groupedBets ) {
            var bet = {
                round: key,
                round_id: groupedBets[key][0].round_id
            };

            // Restructure each bet object
            groupedBets[key].forEach( function( b, i ) {
                groupedBets[key][i] = {
                    id: b.bet_id,
                    game: b.game_id,
                    teams: [
                        { id: b.team_1_id, name: b.team_1_name, bet: b.team_1_bet },
                        { id: b.team_2_id, name: b.team_2_name, bet: b.team_2_bet }
                    ]
                };
            });

            bet.bets = groupedBets[key];
            bets.push( bet );
        }

        return res.json({ bets: bets });
    });
};

// Update user bets
exports.update = function( req, res, next ) {
    var params = [
        req.body.team_1_bet,
        req.body.team_2_bet,
        req.body.id
    ];

    db.updateBets( params, function( err, result ) {
        if ( err ) return next( err );

        return res.json( result );
    });
};

// Place new bets
exports.create = function( req, res, next ) {
    db.createBets( req.body, function( err, result ) {
        if ( err ) return next( err );

        return res.json( result );
    });
};
