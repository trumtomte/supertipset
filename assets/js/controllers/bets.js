angular.module( 'supertipset.controllers' ).controller( 'BetsCtrl',
    ['$scope', 'SpecialBetService', 'ngNotify', 'user', 'rounds', 'bets', 'teams',
    function( $scope, SpecialBetService, ngNotify, user, rounds, bets, teams ) {

    $scope.user = user.data.user;
    $scope.rounds = rounds.data.rounds;
    $scope.bets = bets.data.bets;
    $scope.teams = teams.data.teams;
    $scope.editing = false;
    
    // Flatten array of teams for use in ng-select
    $scope.teamsFlat = (function( teams ) {
        return _.flatten( _.map( teams, function( team ) {
            return _.map( team.players, function( player ) {
                return {
                    team: team.id,
                    group: team.name,
                    id: player.id,
                    firstname: player.firstname,
                    lastname: player.lastname,
                    name: player.firstname + ' ' + player.lastname
                }
            });
        }));
    })( $scope.teams );

    // Check if the tournament has started
    if ( $scope.rounds ) {
        var now = new Date(),
            roundStart = new Date( Date.parse( $scope.rounds[0].start ) );
        $scope.hasStarted = now > roundStart ? true : false;
    }

    // If the tournament hasnt started allow special betting
    if ( ! $scope.hasStarted ) {
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

            var success = function() {
                // Form - choices
                $scope.selectedTeam = team;
                $scope.selectedPlayer = player;
                $scope.selectedGoals = goals;

                // Update user object
                $scope.user = {
                    player: {
                        id: player.id,
                        firstname: player.firstname,
                        lastname: player.lastname,
                        team: player.team,
                        goals: goals
                    },
                    team: {
                        id: team.id,
                        name: team.name
                    }
                };

                ngNotify( 'main' ).info( 'Specialtips uppdaterat!' );
            };

            // If special bets exists update them otherwise create new ones
            if ( $scope.user.player.id ) {
                SpecialBetService.update( bets ).success( success );
            } else {
                SpecialBetService.create( bets ).success( success );
            }
        };
    }
}]);

