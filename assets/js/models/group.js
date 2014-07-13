function GroupService( $http, $cacheFactory, ErrorService ) {
    // Default HTTP cache object
    var cache = $cacheFactory.get( '$http' ),
        e = ErrorService;

    return {
        findOne: function( id ) {
            return $http.get( '/api/groups/' + id, { cache: true } ).error( e( 'Unable to find group by id', id ) );
        },
        remove: function( id ) {
            cache.remove( '/api/groups/' + id );
            return $http.delete( '/api/groups/' + id ).error( e( 'Unable to delete group by id', id ) );
        },
        update: function( params ) {
            cache.remove( '/api/groups/' + params.id );
            return $http.put( '/api/groups/' + params.id, params ).error( e( 'Unable to update group by id', params ) );;
        },
        create: function( params ) {
            cache.remove( '/api/groups/' + params.user_id );
            cache.remove( '/api/usergroups/' + params.user_id );
            return $http.post( '/api/groups', params );
        }
    };
}

GroupService.$inject = ['$http', '$cacheFactory', 'ErrorService'];

module.exports = GroupService;
