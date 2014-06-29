angular.module( 'supertipset.services' ).factory( 'UserGroupService',
    ['$http', '$cacheFactory', 'ErrorService', function( $http, $cacheFactory, ErrorService ) {

    // Default HTTP cache object
    var cache = $cacheFactory.get( '$http' ),
        e = ErrorService;

    return {
        find: function( id ) {
            return $http.get( '/api/usergroups/' + id, { cache: true } ).error( e( 'Unable to find user groups by id', id ) );
        },
        remove: function( params ) {
            cache.remove( '/api/usergroups/' + params.id );
            return $http.delete( '/api/usergroups/' + params.relation ).error( e( 'Unable to delete user group relation by id', params ) );
        },
        create: function( params ) {
            cache.remove( '/api/usergroups/' + params.id );
            return $http.post( '/api/usergroups', params );
        }
    };
}]);

