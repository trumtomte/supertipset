angular.module( 'supertipset' ).directive( 'game', ['api', 'consts.user_id', 'ngNotify', 'pointsCalculator', function( api, id, notify, pointsCalculator ) {
    var directive = {
        require: '^ngModel',
        transclude: true,
        replace: true,
        templateUrl: '/assets/templates/game.html',
        link: function( $scope, $element, $attr ) {
            // Dates to determine if the game is done (been played)
            var today = new Date(),
                gameStart = new Date( Date.parse( $scope.game.start ) );

            // Check if the user has bets on this game
            var bets = _.find( $scope.bets, { round_id: $scope.round.id } );

            if ( bets ) {
                $scope.bet = _.find( bets.bets, { game: $scope.game.id } );
            }

            // Allowed values for bets
            $scope.bettingRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

            // Setup bets
            if ( $scope.bet ) {
                $scope.betOne = $scope.bettingRange[$scope.bet.teams[0].bet];
                $scope.betTwo = $scope.bettingRange[$scope.bet.teams[1].bet];
            } else {
                $scope.betOne = $scope.bettingRange[0];
                $scope.betTwo = $scope.bettingRange[0];
            }

            // Dont allow betting if the game is done (been played)
            if ( today > gameStart ) {
                console.log( 'game has been played' );
                $scope.isDone = true;

                // If game is done and there were bets placed, calculate the score
                if ( $scope.bet ) {
                     $scope.points = pointsCalculator( $scope.game, $scope.bet );
                }
            } else {
                console.log( 'game hasnt been played' );
                $scope.isDone = false;
            }

            // Update current user bets
            $scope.update = function( betOne, betTwo ) {
                // If the user submits the same bet - do nothing
                if ( $scope.bet.teams[0].bet == betOne &&
                     $scope.bet.teams[1].bet == betTwo ) {
                    return;
                }

                var bets = {
                    id: $scope.bet.id,
                    user_id: id,
                    team_1_bet: betOne,
                    team_2_bet: betTwo
                };

                var success = function( res ) {
                    console.log( 'success', res );

                    $scope.bet.teams[0].bet = betOne;
                    $scope.bet.teams[1].bet = betTwo;

                    notify( 'main' ).info( 'Tips redigerat!' );
                };

                api.bets.update( bets ).success( success );
            };

            // Create new user bets
            $scope.create = function( betOne, betTwo ) {
                var bets = {
                    user_id: id,
                    game_id: $scope.game.id,
                    team_1_bet: betOne,
                    team_2_bet: betTwo
                };

                var success = function( res ) {
                    console.log( 'success', res );

                    $scope.bet = {
                        id: res.insertId,
                        user_id: id,
                        game_id: $scope.game.id,
                        teams: [
                            { bet: betOne },
                            { bet: betTwo }
                        ]
                    };

                    $scope.betOne = $scope.bettingRange[betOne];
                    $scope.betTwo = $scope.bettingRange[betTwo];

                    notify( 'main' ).info( 'Tips sparat!' );
                };

                api.bets.create( bets ).success( success );
            };
        }
    };

    return directive;
}]);
