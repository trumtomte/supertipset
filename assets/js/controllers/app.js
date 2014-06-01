angular.module( 'supertipset.controllers' ).controller( 'AppCtrl', ['$scope', '$location', function( $scope, $location ) {
    $scope.$back = function() {
        window.history.back();
    };
    $scope.isActive = function( path ) {
        var re = new RegExp( '^' + path );
        return re.test( $location.path() );
        // return path == $location.path();
    };
}]);
