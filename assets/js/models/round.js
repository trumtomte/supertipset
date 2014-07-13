function RoundService( $http, $cacheFactory, ErrorService ) {
    var e = ErrorService;

    return {
        find: function( id ) {
            return $http.get( '/api/rounds/' + id, { cache: true } ).error( e( 'Unable to find rounds by id', id ) );
        }
    };
}

RoundService.$inject = ['$http', '$cacheFactory', 'ErrorService'];

module.exports = RoundService;
