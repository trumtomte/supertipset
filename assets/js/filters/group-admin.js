angular.module( 'supertipset' ).filter( 'admin', function() {
    // Returns the username of an group admin
    return function( users, id ) {
        var user = _.find( users, { id: id } );
        return user.username;
    };
});
