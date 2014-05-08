angular.module( 'supertipset' ).factory( 'api', ['$http', '$cacheFactory', function( $http, $cacheFactory ) {
    // API error handler
    function e( m, o ) {
        return function( d ) {
            console.log( '[API ERROR]', m, o, '[RESPONSE]', d );
        }
    }

    var cache = $cacheFactory.get( '$http' );

    // API methods
    return {
        // Users
        users: {
            findOne: function( id ) {
                return $http.get( '/api/users/' + id, { cache: true } ).error( e( 'Unable to find user by id' ) );
            }
        },
        // User groups
        usergroups: {
            find: function( id ) {
                return $http.get( '/api/usergroups/' + id, { cache: true } ).error( e( 'Unable to find user groups by id' ) );
            }
        },
        // Groups
        groups: {
            findOne: function( id ) {
                return $http.get( '/api/groups/' + id, { cache: true } ).error( e( 'Unable to find group by id' ) );
            }
        },
        // Rounds
        rounds: {
            find: function( id ) {
                return $http.get( '/api/rounds/' + id, { cache: true } ).error( e( 'Unable to find rounds by id' ) );
            }
        },
        // Bets
        bets: {
            find: function( id ) {
                return $http.get( '/api/bets/' + id, { cache: true } ).error( e( 'Unable to find bets by id' ) );
            },
            create: function( bets ) {
                cache.remove( '/api/bets/' + bets.user_id );
                return $http.post( '/api/bets/' + bets.user_id, bets ).error( e( 'Unable to create a new bet' ) );
            },
            update: function( bets ) {
                cache.remove( '/api/bets/' + bets.user_id );
                return $http.put( '/api/bets/' + bets.user_id, bets ).error( e( 'Unable to update bets by id' ) );
            }
        }
    };
}]);
