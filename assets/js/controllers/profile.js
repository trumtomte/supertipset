angular.module( 'supertipset.controllers' ).controller( 'ProfileCtrl', ['$scope', '$route', function( $scope, $route ) {
    $scope.user = $route.current.locals.user.data.user;
    $scope.groups = $route.current.locals.groups.data.groups;

    if ( $route.current.params.id ) {
        console.log( 'other user' );
        $scope.user.current = false;
    } else {
        console.log( 'current user' );
        $scope.user.current = true;
    }

    $scope.leave = function( group ) {
        console.log( 'leave group', group );
    };

    console.log( 'PROFILE', $scope.groups, $scope.user );
}]);

