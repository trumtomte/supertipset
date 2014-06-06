angular.module( 'supertipset.controllers' ).controller( 'ProfileCtrl', ['$scope', '$route', 'consts.user_id', 'ngDialog', 'ngNotify', 'api', function( $scope, $route, id, dialog, notify, api ) {
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

    $scope.passwordDialog = function() {
        dialog.open({
            template: '/assets/templates/change-password.html',
            scope: $scope
        });
    };

    $scope.password = function( password, passwordRepeat ) {
        if ( password != passwordRepeat ) {
            $scope.message = 'Upprepningen av lösenord stämmer inte';
            return;
        }

        var success = function( result ) {
            dialog.close();
            notify( 'main' ).info( 'Lösenord uppdaterat!' );
        };

        var params = {
            id: id,
            password: password
        };

        api.users.update( params ).success( success );
    };
}]);

