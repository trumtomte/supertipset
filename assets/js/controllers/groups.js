angular.module( 'supertipset.controllers' ).controller( 'GroupsCtrl', ['$scope', '$route', 'ngDialog', function( $scope, $route, dialog ) {
    $scope.groups = $route.current.locals.groups.data.groups;
    $scope.user = $route.current.locals.user.data.user;

    $scope.leaveDialog = function( group ) {
        $scope.group = group;

        dialog.open({
            template: '/assets/templates/leave-group.html',
            controller: 'GroupManagerCtrl',
            scope: $scope
        });
    };

    $scope.createDialog = function() {
        dialog.open({
            template: '/assets/templates/create-group.html',
            controller: 'GroupManagerCtrl',
            scope: $scope
        });
    };

    $scope.joinDialog = function() {
        dialog.open({
            template: '/assets/templates/join-group.html',
            controller: 'GroupManagerCtrl',
            scope: $scope
        });
    };
}]);

