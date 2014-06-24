angular.module( 'supertipset.services' ).factory( 'calculator', function() {
    return function( results, bets ) {
        var isN = angular.isNumber;

        // Team results and User bets
        var r1 = results.teams[0].result,
            r2 = results.teams[1].result,
            b1 = bets.teams[0].bet,
            b2 = bets.teams[1].bet;

        // Invalid input
        if ( ! isN( r1 ) || ! isN( r2 ) || ! isN( b1 ) || ! isN( b2 ) ) {
            return 0;
        }

        // Perfect bet gives 10 pts
        if ( r1 == b1 && r2 == b2 ) {
            return 10;
        }

        var points = 0,
            rDiff = r1 - r2,
            bDiff = b1 - b2;

        // Team 1 won
        if ( rDiff > 0 && bDiff > 0 ) {
            points += 4;
        // Team 2 won
        } else if ( rDiff < 0 && bDiff < 0 ) {
            points += 4;
        // Draw
        } else if ( rDiff == 0 && bDiff == 0 ) {
            points += 4;
        }

        // One bet equals goals for one team 
        if ( r1 == b1 || r2 == b2 ) {
            points += 1;
        }

        return points;
    };
});
