angular.module( 'supertipset.services' ).factory( 'TopListService',
    ['$http', '$cacheFactory', 'ErrorService', function( $http, $cacheFactory, ErrorService ) {

    var e = ErrorService;

    return {
        all: function() {
            return $http.get( '/api/toplists', { cache: true } ).error( e( 'Unable to fetch all top lists' ) );
        }
    };
}]);

