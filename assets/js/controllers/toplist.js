angular.module( 'supertipset.controllers' ).controller( 'TopListCtrl',
    ['$scope', 'toplists', function( $scope, toplists ) {
    // All different types of top 10 lists
    $scope.toplists = toplists.data;
}]);
