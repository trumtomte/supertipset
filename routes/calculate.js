var db = require( '../utilities/database' ),
    auth = require( '../utilities/auth' ),
    User = require( '../models/user' ).User,
    Game = require( '../models/game' ).Game;

// Calculate points for each user based on game results and user bets
// This requires the password of one specific user
exports.game = function( req, res, next ) {
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
