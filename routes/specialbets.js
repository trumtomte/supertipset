var db = require( '../utilities/database' );

var SpecialBet = require( '../models/specialbet' ).SpecialBet;
// Update special bets for a user
exports.update = function( req, res, next ) {
    var params = [
        req.body.player_id,
        req.body.player_goals,
        req.body.team_id,
        req.body.user_id
    ];
    
    var specialBet = new SpecialBet( req.params.id );

    specialBet.update( params, function( err ) {
        if ( err ) next( err );
        res.send( 204 );
    });
};

// Create new special bets for a user
exports.create = function( req, res, next ) {
    var specialBet = new SpecialBet();

    specialBet.create( req.body, function( err ) {
        if ( err ) next( err );
        res.send( 201 );
    });
};
