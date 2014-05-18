angular.module( 'supertipset' ).factory( 'api', ['$http', '$cacheFactory', function( $http, $cacheFactory ) {
    // API error handler
    function e( message, obj ) {
        return function( response ) {
            console.log( '[API ERROR]', message, obj, '[RESPONSE]', response );
        }
    }

    var cache = $cacheFactory.get( '$http' );

    // API methods
    return {
        // Users
        users: {
            findOne: function( id ) {
                return $http.get( '/api/users/' + id, { cache: true } ).error( e( 'Unable to find user by id', id ) );
            }
        },
        // User groups
        usergroups: {
            find: function( id ) {
                return $http.get( '/api/usergroups/' + id, { cache: true } ).error( e( 'Unable to find user groups by id', id ) );
            },
            remove: function( id ) {
                // TODO clear cache
                return $http.delete( '/api/usergroups/' + id ).error( e( 'Unable to delete user group relation by id', id ) );
            }
        },
        // Groups
        groups: {
            findOne: function( id ) {
                return $http.get( '/api/groups/' + id, { cache: true } ).error( e( 'Unable to find group by id', id ) );
            }
        },
        // Rounds
        rounds: {
            find: function( id ) {
                return $http.get( '/api/rounds/' + id, { cache: true } ).error( e( 'Unable to find rounds by id', id ) );
            }
        },
        // Bets
        bets: {
            find: function( id ) {
                return $http.get( '/api/bets/' + id, { cache: true } ).error( e( 'Unable to find bets by id', id ) );
            },
            create: function( bets ) {
                cache.remove( '/api/bets/' + bets.user_id );
                return $http.post( '/api/bets/' + bets.user_id, bets ).error( e( 'Unable to create a new bet', bets ) );
            },
            update: function( bets ) {
                cache.remove( '/api/bets/' + bets.user_id );
                return $http.put( '/api/bets/' + bets.user_id, bets ).error( e( 'Unable to update bets by id', bets ) );
            }
        },
        // Special bets
        specialbets: {
            update: function( bets ) {
                return $http.put( '/api/specialbets/' + bets.user_id, bets ).error( e( 'Unable to update special bets by id', bets ) );
            }
        },
        // Teams
        teams: {
            all: function() {
                return $http.get( '/api/teams', { cache: true } ).error( e( 'Unable to fetch all teams' ) );
            },
            findOne: function( id ) {
                return $http.get( '/api/teams/' + id, { cache: true } ).error( e( 'Unable to fetch team by id', id ) );
            }
        }
    };
}]);
