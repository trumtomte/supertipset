angular.module( 'supertipset' ).factory( 'pointsCalculator', function() {
    // Fetch this data from the database instead calculating it clientside?

    // Return and calculate points given game results and user bets
    function calculatePoints( results, bets ) {
        // Game results (goals) and user bets (goals)
        var t1Result = results.teams[0].result,
            t2Result = results.teams[1].result,
            t1Bet = bets.teams[0].bet,
            t2Bet = bets.teams[1].bet;

        var points = 0;

        if ( t1Result == t1Bet &&
             t2Result == t2Bet ) {
            // Perfect bet = 4 points
            points += 4;
            return points;
        }

        // Calculate difference in goals
        var resultDiff = t1Result - t2Result,
            betDiff = t1Bet - t2Bet;
        
        // Correctly placed the bet on team 1 as the winner
        if ( resultDiff > 0 && betDiff > 0 ) {
            points += 1;
        // Correctly placed the bet on team 2 as the winner
        } else if ( resultDiff < 0 == betDiff < 0 ) {
            points += 1;
        // Correctly placed the bet on a game draw
        } else if ( resultDiff == 0 && betDiff == 0 ) {
            points += 1;
        }

        return points;
    }

    return calculatePoints;
});
