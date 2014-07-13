// Controller
function TopListCtrl( $scope, toplists ) {
    // All different types of top 10 lists
    $scope.toplists = toplists.data;
}

// Dependencies
TopListCtrl.$inject = ['$scope', 'toplists'];

// Export the controller
module.exports = TopListCtrl;
