angular.module( 'supertipset.controllers' ).controller( 'BetsCtrl', ['$scope', '$route', function( $scope, $route ) {
    $scope.user = $route.current.locals.user.data.user;
    $scope.rounds = $route.current.locals.rounds.data.rounds;
    $scope.bets = $route.current.locals.bets.data.bets;

    console.log( 'BETS', $scope.user, $scope.rounds, $scope.bets );
}]);

