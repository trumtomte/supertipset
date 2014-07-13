function RoundDirective() {
    function Linker( $scope, $element, $attr ) {
        var now = new Date(),
            roundStart = new Date( Date.parse( $scope.round.start ) ),
            roundStop = new Date( Date.parse( $scope.round.stop ) );

        // If the round is within the date of today it is considered "current/active"
        $scope.isCurrentRound = roundStart < now && roundStop > now ? true : false;
    }

    var directive = {
        require: '^ngModel',
        transclude: true,
        templateUrl: 'round.html',
        link: Linker
    };

    return directive;
}

module.exports = RoundDirective;
