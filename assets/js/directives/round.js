angular.module( 'supertipset' ).directive( 'round', function() {
    var directive = {
        require: '^ngModel',
        transclude: true,
        replace: true,
        templateUrl: '/assets/templates/round.html',
        link: function( $scope, $element, $attr ) {
            var todayDate = new Date(),
                rStartDate = new Date( Date.parse( $scope.round.start ) ),
                rStopDate = new Date( Date.parse( $scope.round.stop ) );

            $scope.isCurrentRound = false;

            // If the round is within the date of today it is considered "current/active"
            if ( rStartDate < todayDate && rStopDate > todayDate ) {
                $scope.isCurrentRound = true;
            }
        }
    };

    return directive;
});
