angular.module( 'supertipset.controllers' ).controller( 'TopListCtrl', ['$scope', '$route', function( $scope, $route ) {
    $scope.toplists = $route.current.locals.toplists.data;
}]);
