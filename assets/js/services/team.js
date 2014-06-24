angular.module( 'supertipset.services' ).factory( 'TeamService',
    ['$http', '$cacheFactory', 'ErrorService', function( $http, $cacheFactory, ErrorService ) {

    var e = ErrorService;

    return {
        all: function() {
            return $http.get( '/api/teams', { cache: true } ).error( e( 'Unable to fetch all teams' ) );
        },
        findOne: function( id ) {
            return $http.get( '/api/teams/' + id, { cache: true } ).error( e( 'Unable to fetch team by id', id ) );
        }
    };
}]);

