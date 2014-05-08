angular.module( 'supertipset.controllers' ).controller( 'GroupCtrl', ['$scope', '$route', function( $scope, $route ) {
    $scope.group = $route.current.locals.group.data.group;

    console.log( 'GROUP', $scope.group );
}]);

