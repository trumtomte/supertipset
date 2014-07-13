var _ = require( 'lodash' );

// Controller
function ProfileCtrl( $scope, $route, UserService, ngDialog, ngNotify, calculator, userID, user, groups, rounds, bets, teams ) {
    $scope.user = user.data.user;
    $scope.groups = groups.data.groups;
    $scope.rounds = rounds.data.rounds;
    $scope.bets = bets.data.bets;
    $scope.teams = teams.data.teams;
    $scope.user.current = ( ! $route.current.params.id || $route.current.params.id == userID ) ? true : false;

    var now = new Date();

    // Compose list of bets when visiting user profiles
    if ( ! $scope.user.current ) {
        $scope.flatBets = (function( bets ) {
            var flatBets = _.map( bets, function( bet ) {
                var round = _.find( $scope.rounds, { id: bet.round_id } );

                return _.map( bet.bets, function( game ) {
                    var gameStart = new Date( Date.parse( game.game_start ) ),
                        results = _.find( round.games || [], { id: game.game } );

                    return {
                        start: gameStart,
                        isDone: now > gameStart ? true : false,
                        teams: _.merge( game.teams, results.teams ),
                        points: _.isNull( results.teams[0].result ) ? '-' : calculator( results, game )
                    };
                });
            });

            flatBets = _.flatten( flatBets );
            flatBets.sort( function( a, b ) {
                if ( a.start > b.start ) {
                    return 1;
                }

                if ( a.start < b.start ) {
                    return -1;
                }

                return 0;
            });

            return flatBets;
        })( $scope.bets );
    }
    
    // Check if the tournament has started
    if ( $scope.rounds ) {
        var roundStart = new Date( Date.parse( $scope.rounds[0].start ) );
        $scope.hasStarted = now > roundStart ? true : false;
    }

    // Get admin username for each group
    if ( $scope.groups ) {
        _.each( $scope.groups, function( group ) {
            group.admin_name = _.find( group.users, { id: group.admin } ).username;
        });
    }

    // Leave a group dialog
    $scope.leaveDialog = function( group ) {
        $scope.group = group;
        ngDialog.open({
            template: 'leave-group.html',
            controller: 'GroupManagerCtrl',
            scope: $scope
        });
    };

    // Change password dialog
    $scope.passwordDialog = function() {
        ngDialog.open({
            template: 'change-password.html',
            scope: $scope
        });
    };

    // API request for password change
    $scope.password = function( password, passwordRepeat ) {
        if ( password != passwordRepeat ) {
            $scope.message = 'Lösenorden matchar inte.';
            return;
        }

        var success = function() {
            ngDialog.close();
            ngNotify( 'main' ).info( 'Lösenord uppdaterat!' );
        };

        var params = {
            id: userID,
            password: password
        };

        UserService.update( params ).success( success );
    };
}

// Dependencies
ProfileCtrl.$inject = [
    '$scope',
    '$route',
    'UserService',
    'ngDialog',
    'ngNotify',
    'calculator',
    'userID',
    'user',
    'groups',
    'rounds',
    'bets',
    'teams'
];

// Export the controller
module.exports = ProfileCtrl;
