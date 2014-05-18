angular.module( 'supertipset.controllers' ).controller( 'GroupsCtrl', ['$scope', '$route', 'ngNotify', 'api', function( $scope, $route, notify, api ) {
    $scope.groups = $route.current.locals.groups.data.groups;
    $scope.user = $route.current.locals.user.data.user;

    $scope.leave = function( group ) {
        if ( group.admin == $scope.user.id ) {
            console.log( 'admin!' );
        }

        var index = $scope.groups.indexOf( group );

        if ( index < 0 ) {
            return;
        }

        var answer = confirm( 'Är du säker?' );

        if ( ! answer ) {
            return;
        }

        var success = function( result ) {
            $scope.groups.splice( index, 1 );
            notify( 'main' ).info( 'Du har lämnat gruppen!' );
        };

        api.usergroups.remove( group.relation ).success( success );
    };

    $scope.create = function() {
        console.log( 'skapa grupp' );
    };

    $scope.join = function() {
        console.log( 'gå med i grupp' );
    };

    console.log( 'GROUPS', $scope.groups );
}]);

