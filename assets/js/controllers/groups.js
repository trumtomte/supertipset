angular.module( 'supertipset.controllers' ).controller( 'GroupsCtrl', ['$scope', '$route', function( $scope, $route ) {
    $scope.groups = $route.current.locals.groups.data.groups;

    console.log( 'GROUPS', $scope.groups );
}]);

