angular.module( 'supertipset.controllers' ).controller( 'GroupsCtrl',
    ['$scope', 'ngDialog', 'groups', 'user', function( $scope, ngDialog, groups, user ) {

    $scope.groups = groups.data.groups;
    $scope.user = user.data.user;

    // Leave group dialog
    $scope.leaveDialog = function( group ) {
        $scope.group = group;
        ngDialog.open({
            template: '/assets/templates/leave-group.html',
            controller: 'GroupManagerCtrl',
            scope: $scope
        });
    };

    // Create a new group dialog
    $scope.createDialog = function() {
        ngDialog.open({
            template: '/assets/templates/create-group.html',
            controller: 'GroupManagerCtrl',
            scope: $scope
        });
    };

    // Join a group dialog
    $scope.joinDialog = function() {
        ngDialog.open({
            template: '/assets/templates/join-group.html',
            controller: 'GroupManagerCtrl',
            scope: $scope
        });
    };
}]);

