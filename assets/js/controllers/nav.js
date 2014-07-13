// Controller
function NavCtrl( $scope, $location, $rootScope, ngProgressbar ) {
    $rootScope.$on( '$routeChangeStart', function() {
        ngProgressbar.start();
    });
    $rootScope.$on( '$routeChangeSuccess', function() {
        ngProgressbar.complete();
    });
    $rootScope.$on( '$routeChangeError', function() {
        ngProgressbar.reset();
    });

    // Compare given path with the current location path
    $scope.isActive = function( path ) {
        var re = new RegExp( '^' + path );
        return re.test( $location.path() );
    };
}

// Dependencies
NavCtrl.$inject = ['$scope', '$location', '$rootScope', 'ngProgressbar'];

// Export the controller
module.exports = NavCtrl;
