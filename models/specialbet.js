var db = require( '../utilities/database' );

function SpecialBetCollection( id ) {
    this.tournamentID = id || 0;
};

SpecialBetCollection.prototype.fetch = function( callback ) {
    db.conn.query( db.queries.SPECIALBETS_BY_ID, [this.tournamentID], function( err, rows ) {
        if ( err ) return callback( err, null );
        callback( err, rows );
    });

    return this;
};

SpecialBetCollection.prototype.saveResults = function( params, callback ) {
    db.conn.query( db.queries.CREATE_SPECIALBET_RESULTS, params, function( err, result ) {
        if ( err ) return callback( err, null );
        callback( err, result );
    });

    return this;
};

exports.SpecialBetCollection = SpecialBetCollection;

function SpecialBet( id ) {
    this.id = id || 0;
}

SpecialBet.prototype.update = function( params, callback ) {
    db.conn.query( db.queries.UPDATE_SPECIALBET, params, function( err, result ) {
        if ( err ) return callback( err, null );
        callback( err, result );
    });

    return this;
};

SpecialBet.prototype.save = function( params, callback ) {
    db.conn.query( db.queries.CREATE_SPECIALBET, params, function( err, result ) {
        if ( err ) return callback( err, null );
        callback( err, result );
    });

    return this;
};

exports.SpecialBet = SpecialBet;
