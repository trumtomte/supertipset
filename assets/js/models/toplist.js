function TopListService( $http, $cacheFactory, ErrorService ) {
    var e = ErrorService;

    return {
        all: function() {
            return $http.get( '/api/toplists', { cache: true } ).error( e( 'Unable to fetch all top lists' ) );
        }
    };
}

TopListService.$inject = ['$http', '$cacheFactory', 'ErrorService'];

module.exports = TopListService;
