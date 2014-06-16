angular.module( 'supertipset' ).factory( 'calculator', function() {
    // Return and calculate points given game results and user bets
    function calculator( results, bets ) {
        // Game results (goals) and user bets (goals)
        var t1Result = results.teams[0].result,
            t2Result = results.teams[1].result,
            t1Bet = bets.teams[0].bet,
            t2Bet = bets.teams[1].bet;

        // Invalid input
        if ( ! angular.isNumber( t1Result ) ||
             ! angular.isNumber( t2Result ) ||
             ! angular.isNumber( t1Bet ) ||
             ! angular.isNumber( t2Bet ) ) {
                 return 0;
         }

        if ( t1Result == t1Bet &&
             t2Result == t2Bet ) {
            // Perfect bet gives 10 pts
            return 10;
        }

        var points = 0;

        // Calculate difference in goals
        var resultDiff = t1Result - t2Result,
            betDiff = t1Bet - t2Bet;
        
        // Correctly placed the bet on team 1 as the winner
        if ( resultDiff > 0 && betDiff > 0 ) {
            points += 4;
        // Correctly placed the bet on team 2 as the winner
        } else if ( resultDiff < 0 && betDiff < 0 ) {
            points += 4;
        // Correctly placed the bet on a game draw
        } else if ( resultDiff == 0 && betDiff == 0 ) {
            points += 4;
        }

        // If a user placed a bet equal to goals from one of the teams = 1 pts
        if ( t1Result == t1Bet || t2Result == t2Bet ) {
            points += 1;
        }

        return points;
    }

    return calculator;
});
