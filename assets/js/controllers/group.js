// Controller
function GroupCtrl( $scope, GroupService, ngNotify, ngDialog, group, user ) {
    $scope.group = group.data.group;
    $scope.user = user.data.user;
    $scope.editing = false;
    
    $scope.back = function() {
        window.history.back();
    };

    $scope.save = function() {
        var success = function() {
            ngNotify( 'main' ).info( 'Gruppen är uppdaterad!' );
        };

        var params = {
            id: $scope.group.id,
            description: $scope.group.description
        };

        GroupService.update( params ).success( success );
    };

    $scope.password = function() {
        var success = function( result ) {
            ngDialog.open({
                template: 'password.html',
                data: result.password
            });
        };

        var params = {
            id: $scope.group.id,
            password: 'new'
        };

        GroupService.update( params ).success( success );
    };
}

// Dependencies
GroupCtrl.$inject = ['$scope', 'GroupService', 'ngNotify', 'ngDialog', 'group', 'user'];

// Export the controller
module.exports = GroupCtrl;
