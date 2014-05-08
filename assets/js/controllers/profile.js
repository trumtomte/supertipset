angular.module( 'supertipset.controllers' ).controller( 'ProfileCtrl', ['$scope', '$route', function( $scope, $route ) {
    $scope.user = $route.current.locals.user.data.user;
    $scope.groups = $route.current.locals.groups.data.groups;

    if ( $route.current.params.id ) {
        console.log( 'other user' );
    } else {
        console.log( 'current user' );
    }

    console.log( 'PROFILE', $scope.groups, $scope.user );
}]);

