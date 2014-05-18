angular.module( 'supertipset.controllers' ).controller( 'GroupsCtrl', ['$scope', '$route', function( $scope, $route ) {
    $scope.groups = $route.current.locals.groups.data.groups;
    $scope.user = $route.current.locals.user.data.user;

    $scope.leave = function( group ) {
        console.log( 'leave group', group );
    };

    $scope.create = function() {
        console.log( 'skapa grupp' );
    };

    $scope.join = function() {
        console.log( 'gå med i grupp' );
    };

    console.log( 'GROUPS', $scope.groups );
}]);

