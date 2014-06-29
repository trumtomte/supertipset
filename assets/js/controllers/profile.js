angular.module( 'supertipset.controllers' ).controller( 'ProfileCtrl',
    ['$scope', '$route', 'UserService', 'ngDialog', 'ngNotify', 'calculator', 'userID', 'user', 'groups', 'rounds', 'bets',
    function( $scope, $route, UserService, ngDialog, ngNotify, calculator, userID, user, groups, rounds, bets ) {

    $scope.user = user.data.user;
    $scope.groups = groups.data.groups;
    $scope.rounds = rounds.data.rounds;
    $scope.bets = bets.data.bets;
    $scope.user.current = ( ! $route.current.params.id || $route.current.params.id == userID ) ? true : false;

    var now = new Date();

    // Compose list of bets when visiting user profiles
    if ( ! $scope.user.current ) {
        $scope.flatBets = (function( bets ) {
            return _.flatten( _.map( bets, function( bet ) {
                var round = _.find( $scope.rounds, { id: bet.round_id } );

                return _.map( bet.bets, function( game ) {
                    var gameStart = new Date( Date.parse( game.game_start ) ),
                        results = _.find( round.games || [], { id: game.game } );

                    return {
                        isDone: now > gameStart ? true : false,
                        teams: _.merge( game.teams, results.teams ),
                        points: _.isNull( results.teams[0].result ) ? '-' : calculator( results, game )
                    };
                });
            }));
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
            template: '/assets/templates/leave-group.html',
            controller: 'GroupManagerCtrl',
            scope: $scope
        });
    };

    // Change password dialog
    $scope.passwordDialog = function() {
        ngDialog.open({
            template: '/assets/templates/change-password.html',
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
}]);

