var _ = require( 'lodash' );

// Controller
function BetsCtrl( $scope, SpecialBetService, ngNotify, user, rounds, bets, teams ) {
    $scope.user = user.data.user;
    $scope.rounds = rounds.data.rounds;
    $scope.bets = bets.data.bets;
    $scope.teams = teams.data.teams;
    $scope.hasStarted = false;

    // Check if the tournament has started
    if ( $scope.rounds ) {
        var now = new Date(),
            roundStart = new Date( Date.parse( $scope.rounds[0].start ) );
        $scope.hasStarted = now > roundStart ? true : false;
    }
}

// Dependencies
BetsCtrl.$inject = ['$scope', 'SpecialBetService', 'ngNotify', 'user', 'rounds', 'bets', 'teams'];

// Export the controller
module.exports = BetsCtrl;
