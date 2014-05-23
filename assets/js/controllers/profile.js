angular.module( 'supertipset.controllers' ).controller( 'ProfileCtrl', ['$scope', '$route', 'ngDialog', function( $scope, $route, dialog ) {
    $scope.user = $route.current.locals.user.data.user;
    $scope.groups = $route.current.locals.groups.data.groups;
    $scope.user.current = $route.current.params.id ? false : true;

    $scope.leaveDialog = function( group ) {
        $scope.group = group;

        dialog.open({
            template: '/assets/templates/leave-group.html',
            controller: 'GroupManagerCtrl',
            scope: $scope
        });
    };
}]);

