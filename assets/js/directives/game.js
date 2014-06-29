angular.module( 'supertipset' ).directive( 'game',
    ['BetService', 'ngNotify', 'ngDialog', 'userID', 'calculator',
    function( BetService, ngNotify, ngDialog, userID, calculator ) {

    var directive = {
        require: '^ngModel',
        transclude: true,
        templateUrl: '/assets/templates/game.html',
        link: function( $scope, $element, $attr ) {
            // Dates to determine if the game is done
            var now = new Date(),
                gameStart = new Date( Date.parse( $scope.game.start ) ),
                bets = _.find( $scope.bets, { round_id: $scope.round.id } );

            $scope.isDone = now > gameStart ? true : false;
            $scope.isActive = ( $scope.isDone && _.isNull( $scope.game.teams[0].result )  ) ? true : false;

            // If bets are found (for the current game), find a specific bet
            if ( bets ) {
                $scope.bet = _.find( bets.bets, { game: $scope.game.id } );
            }

            // Allowed values for bets and bet choices
            $scope.bettingRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            $scope.betOne = $scope.bettingRange[$scope.bet ? $scope.bet.teams[0].bet : 0];
            $scope.betTwo = $scope.bettingRange[$scope.bet ? $scope.bet.teams[1].bet : 0];

            // If bets were placed and the game is done - calculate points
            $scope.points = $scope.bet ? calculator( $scope.game, $scope.bet ) : 0;

            // Update bet dialog
            $scope.updateBet = function() {
                ngDialog.open({
                    template: '/assets/templates/edit-bet.html',
                    scope: $scope
                });
            };

            // Create bet dialog
            $scope.createBet = function() {
                ngDialog.open({
                    template: '/assets/templates/place-bet.html',
                    scope: $scope
                });
            };

            // Update current user bets
            $scope.update = function( betOne, betTwo ) {
                // If the user submits the same bet - do nothing
                if ( $scope.bet.teams[0].bet == betOne && $scope.bet.teams[1].bet == betTwo ) {
                    ngDialog.close();
                    return;
                }

                var bets = {
                    id: $scope.bet.id,
                    user_id: userID,
                    team_1_bet: betOne,
                    team_2_bet: betTwo
                };

                var success = function( res ) {
                    $scope.bet.teams[0].bet = betOne;
                    $scope.bet.teams[1].bet = betTwo;
                    $scope.betOne = $scope.bettingRange[betOne];
                    $scope.betTwo = $scope.bettingRange[betTwo];

                    ngNotify( 'main' ).info( 'Tips redigerat!' );
                    ngDialog.close();
                };

                BetService.update( bets ).success( success );
            };

            // Create new user bets
            $scope.create = function( betOne, betTwo ) {
                var bets = {
                    user_id: userID,
                    game_id: $scope.game.id,
                    team_1_bet: betOne,
                    team_2_bet: betTwo
                };

                var success = function( result ) {
                    $scope.bet = {
                        id: result.insertId,
                        user_id: userID,
                        game_id: $scope.game.id,
                        teams: [
                            { bet: betOne },
                            { bet: betTwo }
                        ]
                    };
                    $scope.betOne = $scope.bettingRange[betOne];
                    $scope.betTwo = $scope.bettingRange[betTwo];

                    ngNotify( 'main' ).info( 'Tips sparat!' );
                    ngDilaog.close();
                };

                BetService.create( bets ).success( success );
            };
        }
    };

    return directive;
}]);
