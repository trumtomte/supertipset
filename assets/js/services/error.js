angular.module( 'supertipset.services' ).factory( 'ErrorService', function() {
    // TODO better solution for API error handling..
    return function e( message, obj ) {
        return function( response ) {
            console.log( '[API ERROR]', message, obj, '[RESPONSE]', response );
        }
    };
});
