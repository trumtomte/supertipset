var RoundsCollection = require( '../models/round' ).RoundsCollection;

// Get all rounds based on tournament id
exports.find = function( req, res, next ) {
    var roundsCollection = new RoundsCollection( req.params.id );

    roundsCollection.fetch( function( err, data ) {
        if ( err ) next( err );
        if ( ! data ) return res.send( 204 );
        res.json({ rounds: data });
    });
};
