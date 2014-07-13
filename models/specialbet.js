var db = require( '../utilities/database' );

function SpecialBet( id ) {
    this.id = id || 0;
}

SpecialBet.prototype.update = function( params, callback ) {
    db.conn.query( db.queries.UPDATE_SPECIALBETS, params, function( err, result ) {
        if ( err ) return callback( err, null );
        callback( err, result );
    });

    return this;
};

SpecialBet.prototype.save = function( params, callback ) {
    db.conn.query( db.queries.CREATE_SPECIALBETS, params, function( err, result ) {
        if ( err ) return callback( err, null );
        callback( err, result );
    });

    return this;
};

exports.SpecialBet = SpecialBet;
