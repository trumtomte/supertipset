var db = require( '../utilities/database' );

// Update special bets for a user
exports.update = function( req, res, next ) {
    var params = [
        req.body.player_id,
        req.body.player_goals,
        req.body.team_id,
        req.body.user_id
    ];
    
    db.updateSpecialBets( params, function( err, result ) {
        if ( err ) return next( err );
        res.send( 200 );
    });
};

// Create new special bets for a user
exports.create = function( req, res, next ) {
    db.createSpecialBets( req.body, function( err, result ) {
        if ( err ) return next( err );
        res.send( 200 );
    });
};
