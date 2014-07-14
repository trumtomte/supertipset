var db = require( '../utilities/database' ),
    auth = require( '../utilities/auth' ),
    User = require( '../models/user' ).User,
    Game = require( '../models/game' ).Game;
    SpecialBetCollection = require( '../models/specialbet' ).SpecialBetCollection;

// Calculate points for each user based on game results and user bets
// This requires the password of one specific user
exports.game = function( req, res ) {
    var user = new User();

    user.findByUsername( 'superuser', function( err, data ) {
        if ( err || ! data ) return res.redirect( '/admin-calculate?error=1' );

        auth.compare( req.body.password, data.password, function( err ) {
            if ( err ) return res.redirect( '/admin-calculate?error=1' );

            // TODO change to req.params.id?
            var game = new Game( req.body.id );

            game.results( function( err, data ) {
                if ( err || ! data ) return res.redirect( '/admin-calculate?error=1' );

                var results = [data.team_1_goals, data.team_2_goals];

                game.bets( function( err, data ) {
                    if ( err || ! data ) return res.redirect( '/admin-calculate?error=1' );


                    var points = _.map( data, function( bet ) {
                        return [
                            game.calculate( results, bet.bets ),
                            game.id,
                            bet.id
                        ];
                    });

                    db.conn.query( db.queries.INSERT_USERPOINTS, [points], function( err ) {
                        if ( err ) return res.redirect( '/admin-calculate?error=1' );
                        res.redirect( '/admin-calculate?success=1' );
                    });
                });
            });
        });
    });
};

exports.special = function( req, res ) {
    // TODO make dynamic
    var tournamentID = 1,
        teamID = 40,
        playerID = 204,
        goals = 6;

    var user = new User(),
        specialBetCollection = new SpecialBetCollection( tournamentID );

    var results = [];

    user.findByUsername( 'superuser', function( err, data ) {
        if ( err || ! data ) return res.redirect( '/admin-calculate?error=2' );
        console.log( 'found user' );

        auth.compare( req.body.password, data.password, function( err ) {
            if ( err ) return res.redirect( '/admin-calculate?error=2' );
            console.log( 'auth' );

            specialBetCollection.fetch( function( err, bets ) {
                if ( err || ! bets ) return res.redirect( '/admin-calculate?error=2' );
                console.log( 'found bets', bets );

                bets.forEach( function( bet ) {
                    var result = [bet.user_id, 0, 0, 0, tournamentID];

                    // Points from correct goals can only be set
                    // if the correct player was chosen
                    if ( bet.player_id == playerID ) {
                        result[1] = 25;

                        if ( bet.player_goals == goals ) {
                            result[2] = 25;
                        }
                    }

                    if ( bet.team_id == teamID ) {
                        result[3] = 50;
                    }

                    results.push( result );
                });

                console.log( results );

                specialBetCollection.saveResults( [results], function( err ) {
                    console.log( 'wanted to save results' );
                    if ( err ) return res.redirect( '/admin-calculate?error=2' );
                    res.redirect( '/admin-calculate?success=2' );
                });
            });
        });
    });
};
