angular.module( 'supertipset' ).directive( 'round', function() {
    var directive = {
        require: '^ngModel',
        transclude: true,
        templateUrl: '/assets/templates/round.html',
        link: function( $scope, $element, $attr ) {
            var now = new Date(),
                roundStart = new Date( Date.parse( $scope.round.start ) ),
                roundStop = new Date( Date.parse( $scope.round.stop ) );

            // If the round is within the date of today it is considered "current/active"
            $scope.isCurrentRound = roundStart < now && roundStop > now ? true : false;
        }
    };

    return directive;
});
