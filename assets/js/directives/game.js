angular.module( 'supertipset' ).directive( 'game', ['api', 'ngNotify', 'ngDialog', 'consts.userID', 'calculator', function( api, notify, dialog, userID, calculator ) {
    var directive = {
        require: '^ngModel',
        transclude: true,
        replace: true,
        templateUrl: '/assets/templates/game.html',
        link: function( $scope, $element, $attr ) {
            // Dates to determine if the game is done (been played)
            var todayDate = new Date(),
                gStartDate = new Date( Date.parse( $scope.game.start ) );

            // Check if the user has bets on this game
            var bets = _.find( $scope.bets, { round_id: $scope.round.id } );

            // If bets are found, find a specific bet
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
            if ( todayDate > gStartDate ) {
                $scope.isDone = true;

                // If game is done and there were bets placed, calculate the score
                if ( $scope.bet ) {
                     $scope.points = calculator( $scope.game, $scope.bet );
                }
            } else {
                $scope.isDone = false;
            }

            // Update bet dialog
            $scope.updateBet = function() {
                dialog.open({
                    template: '/assets/templates/edit-bet.html',
                    scope: $scope
                });
            };

            // Create bet dialog
            $scope.createBet = function() {
                dialog.open({
                    template: '/assets/templates/place-bet.html',
                    scope: $scope
                });
            };

            // Update current user bets
            $scope.update = function( betOne, betTwo ) {
                // If the user submits the same bet - do nothing
                if ( $scope.bet.teams[0].bet == betOne && $scope.bet.teams[1].bet == betTwo ) {
                    return dialog.close();
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

                    notify( 'main' ).info( 'Tips redigerat!' );
                    dialog.close();
                };

                api.bets.update( bets ).success( success );
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

                    notify( 'main' ).info( 'Tips sparat!' );
                    dialog.close();
                };

                api.bets.create( bets ).success( success );
            };
        }
    };

    return directive;
}]);
