angular.module( 'supertipset.controllers' ).controller( 'TopListCtrl', ['$scope', '$route', function( $scope, $route ) {
    $scope.toplists = $route.current.locals.toplists.data;

    // Antal: Top 10?
    // 1. Topplista över användare med mest poäng
    // 2. Topplista över grupper (ligor) med högst medelvärde av poäng
    // 3. Topplista över grupper (ligor) med högst totala poäng
    // 4. Topplista över grupper (ligor) med mest användare
    // 5. Topplista över det mest tippade vinnarlaget
    // 6. Topplista över den mest tippade fotbollsspelaren
}]);
