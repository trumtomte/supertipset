angular.module( 'supertipset.controllers' ).controller( 'ProfileCtrl', ['$scope', '$route', 'api', 'ngDialog', 'ngNotify', 'consts.userID', function( $scope, $route, api, dialog, notify, userID ) {
    $scope.user = $route.current.locals.user.data.user;
    $scope.groups = $route.current.locals.groups.data.groups;
    $scope.rounds = $route.current.locals.rounds.data.rounds;
    $scope.user.current = false;
    $scope.hasStarted = false;

    var todayDate = new Date();

    if ( ! $route.current.params.id || $route.current.params.id == userID ) {
        $scope.user.current = true;
    } else {
        $scope.bets = $route.current.locals.bets.data.bets;
        $scope.flatBets = _.flatten( $scope.bets, true, 'bets' );

        $scope.flatBets.forEach( function( game ) {
            var gStartDate = new Date( Date.parse( game.game_start ) );

            if ( todayDate > gStartDate ) {
                game.isDone = true;
            }
        });
    }
    
    // Determine if the tournament hasnt started by checking the start date of the first round
    if ( $scope.rounds && $scope.rounds.length ) {
        var rStartDate = new Date( Date.parse( $scope.rounds[0].start ) );
            
        if ( todayDate > rStartDate ) {
           $scope.hasStarted = true; 
        }
    }

    if ( $scope.groups ) {
        $scope.groups.forEach( function( group ) {
            var admin = _.find( group.users, { id: group.admin } );
            group.admin_name = admin.username;
        });
    }

    // Leave a group dialog
    $scope.leaveDialog = function( group ) {
        $scope.group = group;
        dialog.open({
            template: '/assets/templates/leave-group.html',
            controller: 'GroupManagerCtrl',
            scope: $scope
        });
    };

    // Change password dialog
    $scope.passwordDialog = function() {
        dialog.open({
            template: '/assets/templates/change-password.html',
            scope: $scope
        });
    };

    // API request for password change
    $scope.password = function( password, passwordRepeat ) {
        if ( password != passwordRepeat ) {
            $scope.message = 'Upprepningen av lösenord stämmer inte';
            return;
        }

        var success = function() {
            dialog.close();
            notify( 'main' ).info( 'Lösenord uppdaterat!' );
        };

        var params = {
            id: userID,
            password: password
        };

        api.users.update( params ).success( success );
    };
}]);

