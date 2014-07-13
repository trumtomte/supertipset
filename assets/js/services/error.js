function ErrorService( ngNotify ) {
    // TODO better solution for API error handling..
    return function e( message, obj ) {
        return function( response ) {
            ngNotify( 'main' ).error( 'Ett fel uppstod, vänligen försök igen.' );
            console.log( '[API ERROR]', message, obj, '[RESPONSE]', response );
        }
    };
}

ErrorService.$inject = ['ngNotify'];

module.exports = ErrorService;
