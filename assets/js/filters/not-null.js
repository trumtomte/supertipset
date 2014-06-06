angular.module( 'supertipset' ).filter( 'notnull', function() {
    return function( value, replacement ) {
        return value ? value : replacement;
    };
});
