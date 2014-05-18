angular.module( 'supertipset.controllers' ).controller( 'GroupCtrl', ['$scope', '$route', function( $scope, $route ) {
    $scope.group = $route.current.locals.group.data.group;
    $scope.user = $route.current.locals.user.data.user;

    console.log( 'GROUP', $scope.group );
}]);

