angular.module( 'supertipset.services' ).factory( 'UserService',
    ['$http', '$cacheFactory', 'ErrorService', function( $http, $cacheFactory, ErrorService ) {

    var e = ErrorService;

    return {
        findOne: function( id ) {
            return $http.get( '/api/users/' + id, { cache: true } ).error( e( 'Unable to find user by id', id ) );
        },
        update: function( params ) {
            return $http.put( '/api/users/' + params.id, params ).error( e( 'Unable to update user by id', params ) );
        }
    };
}]);

