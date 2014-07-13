var _ = require( 'lodash' );

function ExceptFilter() {
    // Returns an array (temporary) without an item with the given id
    return function( array, id ) {
        return _.reject( array, function( i ) { return i.id == id; } );
    };
}

module.exports = ExceptFilter;
