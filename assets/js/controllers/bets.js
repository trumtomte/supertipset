angular.module( 'supertipset.controllers' ).controller( 'BetsCtrl', ['$scope', '$route', 'api', 'ngNotify', function( $scope, $route, api, notify ) {
    $scope.user = $route.current.locals.user.data.user;
    $scope.rounds = $route.current.locals.rounds.data.rounds;
    $scope.bets = $route.current.locals.bets.data.bets;
    $scope.teams = $route.current.locals.teams.data.teams;
    $scope.isEditing = false;
    // Bool to determine if the tournament has started or not
    $scope.hasStarted = false;
    
    // Flatten array of teams for use in ng-select
    function flatten( ts ) {
        var a = [];

        ts.forEach( function( t ) {
            t.players.forEach( function( p ) {
                a.push({
                    team: t.id,
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

    // Determine if the tournament hasnt started by checking the start date of the first round
    if ( $scope.rounds && $scope.rounds.length ) {
        var todayDate = new Date(),
            rStartDate = new Date( Date.parse( $scope.rounds[0].start ) );
            
        if ( todayDate > rStartDate ) {
           $scope.hasStarted = true; 
        }
    }

    $scope.edit = function() {
        $scope.isEditing = ! $scope.isEditing;
    };

    $scope.teamsFlat = flatten( $scope.teams );
    // Select choices
    $scope.selectedTeam = $scope.user.team.id ? _.find( $scope.teams, { id: $scope.user.team.id } ) : $scope.teams[0];
    $scope.selectedPlayer = $scope.user.player.id ? _.find( $scope.teamsFlat, { id: $scope.user.player.id } ) : $scope.teamsFlat[0];
    $scope.selectedGoals = $scope.user.player.goals || 0;

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
            // Form - choices
            $scope.selectedTeam = team;
            $scope.selectedPlayer = player;
            $scope.selectedGoals = goals;

            // Update user object
            $scope.user.player.id = player.id;
            $scope.user.player.firstname = player.firstname;
            $scope.user.player.lastname = player.lastname;
            $scope.user.player.team = player.team;
            $scope.user.player.goals = goals;
            $scope.user.team.id = team.id;
            $scope.user.team.name = team.name;

            $scope.isEditing = false;
            notify( 'main' ).info( 'Specialtips uppdaterat!' );
        };

        if ( ! $scope.user.player.id ) {
            bets.tournament_id = 1;
        }

        api.specialbets.create( bets ).success( success );
    };
}]);

