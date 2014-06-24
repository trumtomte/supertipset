"use strict";

// Application module
angular.module( 'supertipset', [
    'ngRoute',
    'ngAnimate',
    'ngNotify',
    'ngDialog',
    'ngProgressbar',
    'supertipset.controllers',
    'supertipset.services'
])

// Routes
.config( ['$routeProvider', 'userID', 'tournamentID', function( $routeProvider, userID, tournamentID ) {
    // Bet route
    var bets = {
        controller: 'BetsCtrl',
        templateUrl: '/assets/templates/bets.html',
        resolve: {
            user: ['UserService', function( UserService ) {
                return UserService.findOne( userID );
            }],
            rounds: ['RoundService', function( RoundService ) {
                return RoundService.find( tournamentID );
            }],
            bets: ['BetService', function( BetService ) {
                return BetService.find( userID );
            }],
            teams: ['TeamService', function( TeamService ) {
                return TeamService.all();
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
            user: ['UserService', function( UserService ) {
                return UserService.findOne( userID );
            }],
            groups: ['UserGroupService', function( UserGroupService ) {
                return UserGroupService.find( userID );
            }]
        }
    });

    // Specific group
    $routeProvider.when( '/groups/:id', {
        controller: 'GroupCtrl',
        templateUrl: '/assets/templates/group.html',
        resolve: {
            user: ['UserService', function( UserService ) {
                return UserService.findOne( userID );
            }],
            group: ['GroupService', '$route', function( GroupService, $route ) {
                return GroupService.findOne( $route.current.params.id );
            }]
        }
    });

    // Profile (current user)
    $routeProvider.when( '/profile', {
        controller: 'ProfileCtrl',
        templateUrl: '/assets/templates/profile.html',
        resolve: {
            user: ['UserService', function( UserService ) {
                return UserService.findOne( userID );
            }],
            groups: ['UserGroupService', function( UserGroupService ) {
                return UserGroupService.find( userID );
            }],
            bets: ['BetService', function( BetService ) {
                return BetService.find( userID );
            }],
            rounds: ['RoundService', function( RoundService ) {
                return RoundService.find( tournamentID );
            }]
        }
    });
    
    // Profile (other user)
    $routeProvider.when( '/profile/:id', {
        controller: 'ProfileCtrl',
        templateUrl: '/assets/templates/profile.html',
        resolve: {
            user: ['UserService', '$route', function( UserService, $route ) {
                return UserService.findOne( $route.current.params.id );
            }],
            groups: ['UserGroupService', '$route', function( UserGroupService, $route ) {
                return UserGroupService.find( $route.current.params.id );
            }],
            bets: ['BetService', '$route', function( BetService, $route ) {
                return BetService.find( $route.current.params.id );
            }],
            rounds: ['RoundService', function( RoundService ) {
                return RoundService.find( tournamentID );
            }]
        }
    });
    
    // Top lists
    $routeProvider.when( '/toplist', {
        controller: 'TopListCtrl',
        templateUrl: '/assets/templates/toplist.html',
        resolve: {
            toplists: ['TopListService', function( TopListService ) {
                return TopListService.all();
            }]
        }
    });

    // Default
    $routeProvider.otherwise({ redirectTo: '/' });
}])

// Navigation controller
.controller( 'NavCtrl', ['$scope', '$location', '$rootScope', 'ngProgressbar', function( $scope, $location, $rootScope, ngProgressbar ) {

    $rootScope.$on( '$routeChangeStart', function() {
        ngProgressbar.start();
    });
    $rootScope.$on( '$routeChangeSuccess', function() {
        ngProgressbar.complete();
    });
    $rootScope.$on( '$routeChangeError', function() {
        ngProgressbar.reset();
    });

    // Compare given path with the current location path
    $scope.isActive = function( path ) {
        var re = new RegExp( '^' + path );
        return re.test( $location.path() );
    };
}]);

// Create a module for controllers and services
angular.module( 'supertipset.controllers', [] );
angular.module( 'supertipset.services', [] );
