angular.module( 'supertipset' ).directive( 'game', ['api', 'consts.user_id', function( api, id ) {
    var directive = {
        require: '^ngModel',
        transclude: true,
        replace: true,
        templateUrl: '/assets/templates/game.html',
        link: function( $scope, $element, $attr ) {
            // Dates to determine if the game is done (been played)
            var today = new Date();
                gameStart = new Date( Date.parse( $scope.game.game_start ) );

            // Check if the user has bets on this game
            var bets = _.find( $scope.bets, { round_id: $scope.round.id } );
            $scope.bet = _.find( bets.bets, { game_id: $scope.game.game_id } );

            // Allowed values for bets
            $scope.bettingRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

            // Setup bets
            if ( $scope.bet ) {
                $scope.betOne = $scope.bettingRange[$scope.bet.team_1_bet];
                $scope.betTwo = $scope.bettingRange[$scope.bet.team_2_bet];
            } else {
                $scope.betOne = $scope.bettingRange[0];
                $scope.betTwo = $scope.bettingRange[0];
            }

            $scope.updateBet = function( betOne, betTwo ) {
                // If the user submits the same bet - do nothing
                if ( $scope.bet.team_1_bet == betOne &&
                     $scope.bet.team_2_bet == betTwo ) {
                    return true;
                }

                var bets = {
                    id: $scope.bet.bet_id,
                    user_id: id,
                    team_1_bet: betOne,
                    team_2_bet: betTwo
                };

                var success = function( res ) {
                    console.log( 'success', res );
                    $scope.bet.team_1_bet = betOne;
                    $scope.bet.team_2_bet = betTwo;
                };

                api.bets.update( bets ).success( success );
            };

            $scope.newBet = function( betOne, betTwo ) {
                var bets = {
                    user_id: id,
                    game_id: $scope.game.game_id,
                    team_1_bet: betOne,
                    team_2_bet: betTwo
                };

                var success = function( res ) {
                    console.log( 'success', res );

                    $scope.bet = {
                        user_id: id,
                        game_id: $scope.game.game_id,
                        team_1_bet: betOne,
                        team_2_bet: betTwo,
                        bet_id: res.insertId
                    };

                    $scope.betOne = $scope.bettingRange[betOne];
                    $scope.betTwo = $scope.bettingRange[betTwo];
                };

                api.bets.create( bets ).success( success );
            };

            // Dont allow betting if the game is done (been played)
            if ( today > gameStart ) {
                console.log( 'game has been played' );
                $scope.isDone = true;

            } else {
                console.log( 'game hasnt been played' );
                $scope.isDone = false;
            }
        }
    };

    return directive;
}]);
