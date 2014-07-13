// Controller
function GroupsCtrl( $scope, ngDialog, groups, user ) {
    $scope.groups = groups.data.groups;
    $scope.user = user.data.user;

    // Leave group dialog
    $scope.leaveDialog = function( group ) {
        $scope.group = group;
        ngDialog.open({
            template: 'leave-group.html',
            controller: 'GroupManagerCtrl',
            scope: $scope
        });
    };

    // Create a new group dialog
    $scope.createDialog = function() {
        ngDialog.open({
            template: 'create-group.html',
            controller: 'GroupManagerCtrl',
            scope: $scope
        });
    };

    // Join a group dialog
    $scope.joinDialog = function() {
        ngDialog.open({
            template: 'join-group.html',
            controller: 'GroupManagerCtrl',
            scope: $scope
        });
    };
}

// Dependencies
GroupsCtrl.$inject = ['$scope', 'ngDialog', 'groups', 'user'];

// Export the controller
module.exports = GroupsCtrl;
