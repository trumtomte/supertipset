angular.module( 'supertipset.controllers' ).controller( 'GroupsCtrl', ['$scope', '$route', 'ngDialog', function( $scope, $route, dialog ) {
    $scope.groups = $route.current.locals.groups.data.groups;
    $scope.user = $route.current.locals.user.data.user;

    // Leave group dialog
    $scope.leaveDialog = function( group ) {
        $scope.group = group;
        dialog.open({
            template: '/assets/templates/leave-group.html',
            controller: 'GroupManagerCtrl',
            scope: $scope
        });
    };

    // Create a new group dialog
    $scope.createDialog = function() {
        dialog.open({
            template: '/assets/templates/create-group.html',
            controller: 'GroupManagerCtrl',
            scope: $scope
        });
    };

    // Join a group dialog
    $scope.joinDialog = function() {
        dialog.open({
            template: '/assets/templates/join-group.html',
            controller: 'GroupManagerCtrl',
            scope: $scope
        });
    };
}]);

