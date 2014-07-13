var db = require( '../utilities/database' );

var TopListCollection = require( '../models/toplist' ).TopListCollection;

// Get all top lists
exports.all = function( req, res, next ) {
    var topListCollection = new TopListCollection();

    topListCollection.fetch( function( err, data ) {
        if ( err ) next( err );
        res.json( data );
    });
};
