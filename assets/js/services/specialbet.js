angular.module( 'supertipset.services' ).factory( 'SpecialBetService',
    ['$http', '$cacheFactory', 'ErrorService', 'tournamentID', function( $http, $cacheFactory, ErrorService, tournamentID ) {

    // Default HTTP cache object
    var cache = $cacheFactory.get( '$http' ),
        e = ErrorService;

    return {
        update: function( bets ) {
            cache.remove( '/api/users/' + bets.user_id );
            return $http.put( '/api/specialbets/' + bets.user_id, bets ).error( e( 'Unable to update special bets by id', bets ) );
        },
        create: function( bets ) {
            bets.tournament_id = tournamentID;
            cache.remove( '/api/users/' + bets.user_id );
            return $http.post( '/api/specialbets/' + bets.user_id, bets ).error( e( 'Unable to create special bets by id', bets ) );
        }
    };
}]);

