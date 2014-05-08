angular.module( 'supertipset' ).directive( 'round', function() {
    var directive = {
        require: '^ngModel',
        transclude: true,
        replace: true,
        templateUrl: '/assets/templates/round.html',
        link: function( $scope, $element, $attr ) {
            var today = new Date(),
                roundStart = new Date( Date.parse( $scope.round.start ) ),
                roundStop = new Date( Date.parse( $scope.round.stop ) );

            if ( roundStart < today && roundStop > today ) {
                $scope.isCurrentRound = true;
            } else {
                $scope.isCurrentRound = false;
            }
        }
    };

    return directive;
});
