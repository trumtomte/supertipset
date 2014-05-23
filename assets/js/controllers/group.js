angular.module( 'supertipset.controllers' ).controller( 'GroupCtrl', ['$scope', '$route', 'api', 'ngNotify', function( $scope, $route, api, notify ) {
    $scope.group = $route.current.locals.group.data.group;
    $scope.user = $route.current.locals.user.data.user;
    $scope.isEditing = false;

    $scope.edit = function() {
        $scope.isEditing = ! $scope.isEditing;
    };

    $scope.save = function() {
        var success = function( result ) {
            $scope.isEditing = false;
            notify( 'main' ).info( 'Gruppen är uppdaterad!' );
        };

        var params = {
            id: $scope.group.id,
            description: $scope.group.description
        };

        api.groups.update( params ).success( success );
    };

    $scope.password = function() {

    };
}]);

