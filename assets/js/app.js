// Application module
angular.module( 'supertipset', ['ngRoute', 'ngAnimate', 'supertipset.controllers'] )
// Routes
.config( ['$routeProvider', function( $routeProvider ) {
    // Bets
    var bets = {
        controller: 'BetsCtrl',
        templateUrl: '/assets/templates/bets.html',
        resolve: {
            user: ['api', 'consts.user_id', function( api, id ) {
                return api.users.findOne( id );
            }],
            rounds: ['api', 'consts.user_id', function( api, id ) {
                return api.rounds.find( id );
            }],
            bets: ['api', 'consts.user_id', function( api, id ) {
                return api.bets.find( id );
            }]
        }
    };
    // Bets-routes
    $routeProvider.when( '/', bets );
    $routeProvider.when( '/bets', bets );

    // Groups
    $routeProvider.when( '/groups', {
        controller: 'GroupsCtrl',
        templateUrl: '/assets/templates/groups.html',
        resolve: {
            groups: ['api', 'consts.user_id', function( api, id ) {
                return api.usergroups.find( id );
            }]
        }
    });

    // Group
    $routeProvider.when( '/groups/:id', {
        controller: 'GroupCtrl',
        templateUrl: '/assets/templates/group.html',
        resolve: {
            group: ['api', '$route', function( api, $route ) {
                return api.groups.findOne( $route.current.params.id );
            }]
        }
    });

    // Profile (current user)
    $routeProvider.when( '/profile', {
        controller: 'ProfileCtrl',
        templateUrl: '/assets/templates/profile.html',
        resolve: {
            user: ['api', 'consts.user_id', function( api, id ) {
                return api.users.findOne( id );
            }],
            groups: ['api', 'consts.user_id', function( api, id ) {
                return api.usergroups.find( id );
            }]
        }
    });
    
    // Profile (other user)
    $routeProvider.when( '/profile/:id', {
        controller: 'ProfileCtrl',
        templateUrl: '/assets/templates/profile.html',
        resolve: {
            user: ['api', '$route', function( api, $route ) {
                return api.users.findOne( $route.current.params.id );
            }],
            groups: ['api', '$route', function( api, $route ) {
                return api.usergroups.find( $route.current.params.id );
            }]
        }
    });
    
    // Top list
    $routeProvider.when( '/toplist', {
        controller: 'TopListCtrl',
        templateUrl: '/assets/templates/toplist.html',
        resolve: {

        }
    });
}]);

angular.module( 'supertipset.controllers', [] );
