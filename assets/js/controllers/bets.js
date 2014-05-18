angular.module( 'supertipset.controllers' ).controller( 'BetsCtrl', ['$scope', '$route', 'ngNotify', 'api', function( $scope, $route, notify, api ) {
    $scope.user = $route.current.locals.user.data.user;
    $scope.rounds = $route.current.locals.rounds.data.rounds;
    $scope.bets = $route.current.locals.bets.data.bets;
    $scope.teams = $route.current.locals.teams.data.teams;
    // Determine if the tournament has started or not
    $scope.hasStarted = true;
    
    // Flatten array of teams for use in ng-select
    function flatten( ts ) {
        var a = [];

        ts.forEach( function( t ) {
            t.players.forEach( function( p ) {
                a.push({
                    group: t.name,
                    id: p.id,
                    firstname: p.firstname,
                    lastname: p.lastname,
                    name: p.firstname + ' ' + p.lastname
                });
            });
        });

        return a;
    }

    $scope.flattenTeams = flatten( $scope.teams );

    $scope.selectedTeam = _.find( $scope.teams, { id: $scope.user.team.id } );
    $scope.selectedPlayer = _.find( $scope.flattenTeams, { id: $scope.user.player.id } );
    $scope.selectedGoals = $scope.user.player.goals;

    console.log( $scope.selectedTeam, $scope.selectedPlayer );

    // Determine if the tournament hasnt started by checking the start date of the first round
    if ( $scope.rounds.length ) {
        var today = new Date(),
            firstRoundStart = new Date( Date.parse( $scope.rounds[0].start ) );
            
        if ( firstRoundStart > today ) {
           $scope.hasStarted = false; 
        }
    }

    $scope.specialBet = function( team, player, goals ) {
        // If user submits the same as before do nothing
        if ( team == $scope.selectedTeam &&
             player == $scope.selectedPlayer &&
             goals == $scope.selectedGoals ) {
            return;
        }

        var bets = {
            user_id: $scope.user.id,
            player_id: player.id,
            player_goals: goals || 0,
            team_id: team.id
        };

        var success = function( res ) {
            console.log( 'success', res );

            $scope.selectedTeam = team;
            $scope.selectedPlayer = player;
            $scope.selectedGoals = goals;

            notify( 'main' ).info( 'Specialtips uppdaterat!' );
        };

        api.specialbets.update( bets ).success( success );
    };

    // console.log( 'BETS', $scope.user, $scope.rounds, $scope.bets, $scope.teams );
}]);

