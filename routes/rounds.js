var db = require( '../utilities/database' );

// Get all rounds based on tournament id
exports.find = function( req, res, next ) {
    db.getTournamentRounds( req.params.id, function( err, rows ) {
        if ( err ) return next( err );

        if ( ! rows.length ) {
            return res.json( 204, {} );
        }

        var groupedRounds = {},
            rounds = [];

        // Extract games by round
        rows.forEach( function( row ) {
            if ( ! ( row.round in groupedRounds ) ) {
                groupedRounds[row.round] = [];
            }

            groupedRounds[row.round].push( row );
        });

        for ( var key in groupedRounds ) {
            var round = {
                name: key,
                id: groupedRounds[key][0].round_id,
                start: groupedRounds[key][0].round_start,
                stop: groupedRounds[key][0].round_stop
            };

            // Restructure each game object
            groupedRounds[key].forEach( function( game, i ) {
                groupedRounds[key][i] = {
                    id: game.game_id,
                    start: game.game_start,
                    stop: game.game_stop,
                    teams: [
                        { id: game.team_1_id, result: game.team_1_result, name: game.team_1_name },
                        { id: game.team_2_id, result: game.team_2_result, name: game.team_2_name }
                    ]
                };
            });

            round.games = groupedRounds[key];
            rounds.push( round );
        }

        return res.json({ rounds: rounds });
    });
};
