angular.module( 'supertipset' ).filter( 'except', function() {
    // Removes an object from an array with the given id
    return function( array, id ) {
        return _.reject( array, function( i ) { return i.id == id; } );
    };
});
