var db = require( '../utilities/database' );

exports.update = function( req, res, next ) {
    var params = [
        req.body.player_id,
        req.body.player_goals,
        req.body.team_id,
        req.body.user_id
    ];
    
    db.updateSpecialBets( params, function( err, result ) {
        if ( err ) {
            return next( err );
        }

        return res.json( result );
    });
};

exports.create = function( req, res ) {

};
