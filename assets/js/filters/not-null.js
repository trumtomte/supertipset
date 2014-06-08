angular.module( 'supertipset' ).filter( 'notnull', function() {
    // If the value is NULL - replace it with "replacement"
    return function( value, replacement ) {
        return value ? value : replacement;
    };
});
