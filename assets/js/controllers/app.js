angular.module( 'supertipset.controllers' ).controller( 'AppCtrl', ['$scope', function( $scope ) {
    $scope.$back = function() {
        window.history.back();
    };
}]);
