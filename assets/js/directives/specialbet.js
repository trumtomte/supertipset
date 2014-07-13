var _ = require( 'lodash' );

function SpecialBetDirective( ngNotify, SpecialBetService, userID ) {

    function Linker( $scope, $element, $attr ) {
        $scope.editing = false;
        $scope.teamsFlat = flattenTeams( $scope.teams );

        // Select choices
        $scope.selectedTeam = $scope.user.team.id ? _.find( $scope.teams, { id: $scope.user.team.id } ) : $scope.teams[0];
        $scope.selectedPlayer = $scope.user.player.id ? _.find( $scope.teamsFlat, { id: $scope.user.player.id } ) : $scope.teamsFlat[0];
        $scope.selectedGoals = $scope.user.player.goals || 0;

        // TODO should be able to be done in the template
        $scope.edit = function( state ) {
            $scope.editing = state;
        };

        $scope.submitBet = function() {
            // Tournament has already started
            if ( $scope.active ) {
                return;
            }

            var success = function() {
                // Update user choice of player
                $scope.user.player = {
                    id: $scope.selectedPlayer.id,
                    firstname: $scope.selectedPlayer.firstname,
                    lastname: $scope.selectedPlayer.lastname,
                    team: $scope.selectedPlayer.team,
                    goals: $scope.selectedGoals
                };
                // Update user choice of winning team
                $scope.user.team = {
                    id: $scope.selectedTeam.id,
                    name: $scope.selectedTeam.name
                };

                ngNotify( 'main' ).info( 'Specialtips uppdaterat!' );
            };

            // Params
            var bets = {
                user_id: $scope.user.id,
                player_id: $scope.selectedPlayer.id,
                player_goals: $scope.selectedGoals || 0,
                team_id: $scope.selectedTeam.id
            };

            // Dirty check to see if special bets exists
            if ( $scope.user.player.id ) {
                SpecialBetService.update( bets ).success( success );
            } else {
                SpecialBetService.create( bets ).success( success );
            }
        };
    }

    // Flatten array of teams for use in ng-select
    function flattenTeams( teams ) {
        var t = _.map( teams, function( team ) {
            return _.map( team.players, function( player ) {
                return {
                    id: player.id,
                    firstname: player.firstname,
                    lastname: player.lastname,
                    name: player.firstname + ' ' + player.lastname,
                    team: team.id,
                    group: team.name
                };
            });
        });

        return _.flatten( t );
    }

    var directive = {
        transclude: true,
        templateUrl: 'specialbet.html',
        scope: {
            user: '=',
            teams: '=',
            active: '='
        },
        link: Linker
    };

    return directive;
}

SpecialBetDirective.$inject = ['ngNotify', 'SpecialBetService', 'userID'];

module.exports = SpecialBetDirective;
