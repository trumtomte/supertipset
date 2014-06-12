"use strict";

// Application module
angular.module( 'supertipset', ['ngRoute', 'ngAnimate', 'ngNotify', 'ngDialog', 'ngProgressbar', 'supertipset.controllers'] )

// Routes
.config( ['$routeProvider', 'consts.userID', function( $routeProvider, userID ) {
    // Bet route
    var bets = {
        controller: 'BetsCtrl',
        templateUrl: '/assets/templates/bets.html',
        resolve: {
            user: ['api', function( api ) {
                return api.users.findOne( userID );
            }],
            rounds: ['api', function( api ) {
                return api.rounds.find( 1 );
            }],
            bets: ['api', function( api ) {
                return api.bets.find( userID );
            }],
            teams: ['api', function( api ) {
                return api.teams.all();
            }]
        }
    };

    // Bet routes
    $routeProvider.when( '/', bets );
    $routeProvider.when( '/bets', bets );

    // User specific groups
    $routeProvider.when( '/groups', {
        controller: 'GroupsCtrl',
        templateUrl: '/assets/templates/groups.html',
        resolve: {
            user: ['api', function( api ) {
                return api.users.findOne( userID );
            }],
            groups: ['api', function( api ) {
                return api.usergroups.find( userID );
            }]
        }
    });

    // Specific group
    $routeProvider.when( '/groups/:id', {
        controller: 'GroupCtrl',
        templateUrl: '/assets/templates/group.html',
        resolve: {
            user: ['api', function( api ) {
                return api.users.findOne( userID );
            }],
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
            user: ['api', function( api ) {
                return api.users.findOne( userID );
            }],
            groups: ['api', function( api ) {
                return api.usergroups.find( userID );
            }],
            rounds: ['api', function( api ) {
                return api.rounds.find( 1 );
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
            }],
            rounds: ['api', function( api ) {
                return api.rounds.find( 1 );
            }]
        }
    });
    
    // Top lists
    $routeProvider.when( '/toplist', {
        controller: 'TopListCtrl',
        templateUrl: '/assets/templates/toplist.html',
        resolve: {
            toplists: ['api', function( api ) {
                return api.toplists.all();
            }]
        }
    });

    // Default
    $routeProvider.otherwise( bets );
}])

// Navigation controller
.controller( 'NavCtrl', ['$scope', '$location', '$rootScope', 'ngProgressbar', function( $scope, $location, $rootScope, progress ) {

    $rootScope.$on( '$routeChangeStart', function( a, b) {
        progress.start();
    });
    $rootScope.$on( '$routeChangeSuccess', function() {
        progress.complete();
    });
    $rootScope.$on( '$routeChangeError', function() {
        progress.reset();
    });

    // Compare given path with the current location path
    $scope.isActive = function( path ) {
        var re = new RegExp( '^' + path );
        return re.test( $location.path() );
    };
}]);

// Create module for controllers
angular.module( 'supertipset.controllers', [] );
