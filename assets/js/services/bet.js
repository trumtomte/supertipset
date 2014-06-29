angular.module( 'supertipset.services' ).factory( 'BetService',
    ['$http', '$cacheFactory', 'ErrorService', function( $http, $cacheFactory, ErrorService ) {

    // Default HTTP cache object
    var cache = $cacheFactory.get( '$http' ),
        e = ErrorService;

    return {
        find: function( id ) {
            return $http.get( '/api/bets/' + id, { cache: true } ).error( e( 'Unable to find bets by id', id ) );
        },
        create: function( bets ) {
            cache.remove( '/api/users/' + bets.user_id );
            cache.remove( '/api/bets/' + bets.user_id );
            return $http.post( '/api/bets/' + bets.user_id, bets ).error( e( 'Unable to create a new bet', bets ) );
        },
        update: function( bets ) {
            cache.remove( '/api/users/' + bets.user_id );
            cache.remove( '/api/bets/' + bets.user_id );
            return $http.put( '/api/bets/' + bets.user_id, bets ).error( e( 'Unable to update bets by id', bets ) );
        }
    };
}]);
