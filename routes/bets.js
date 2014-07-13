var bet = require( '../models/bet' ),
    Bet = bet.Bet,
    BetsCollection = bet.BetsCollection;

// Get all bets based on user id
exports.find = function( req, res, next ) {
    var betsCollection = new BetsCollection( req.params.id );

    betsCollection.fetch( function( err, data ) {
        if ( err ) next( err );
        if ( ! data ) return res.json( 204, {} );
        res.json({ bets: data });
    });
};

// Update user bets
exports.update = function( req, res, next ) {
    var params = [
        req.body.team_1_bet,
        req.body.team_2_bet,
        req.body.id
    ];

    var bet = new Bet( req.body.id );

    bet.update( params, function( err ) {
        if ( err ) return next( err );
        res.json( 200 );
    });
};

// Place new bets
exports.create = function( req, res, next ) {
    var bet = new Bet();

    bet.save( req.body, function( err, data ) {
        if ( err ) return next( err );
        res.json({ id: data.insertId });
    });
};
