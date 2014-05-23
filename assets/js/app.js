"use strict";

// Application module
angular.module( 'supertipset', ['ngRoute', 'ngAnimate', 'ngNotify', 'ngDialog', 'supertipset.controllers'] )

// Routes
.config( ['$routeProvider', 'consts.user_id', function( $routeProvider, userID ) {
    // Bets
    var bets = {
        controller: 'BetsCtrl',
        templateUrl: '/assets/templates/bets.html',
        resolve: {
            user: ['api', function( api ) {
                return api.users.findOne( userID );
            }],
            rounds: ['api', function( api ) {
                return api.rounds.find( userID );
            }],
            bets: ['api', function( api ) {
                return api.bets.find( userID );
            }],
            teams: ['api', function( api ) {
                return api.teams.all();
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
            user: ['api', function( api ) {
                return api.users.findOne( userID );
            }],
            groups: ['api', function( api ) {
                return api.usergroups.find( userID );
            }]
        }
    });

    // Group
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
