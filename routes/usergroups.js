var usergroup = require( '../models/usergroup' ),
    UserGroup = usergroup.UserGroup,
    UserGroupCollection = usergroup.UserGroupCollection;

// Get all groups (and members) based on user id
exports.find = function( req, res, next ) {
    var limit = req.query.limit || 0;
        userGroupCollection = new UserGroupCollection( req.params.id );

    userGroupCollection.fetch( limit, function( err, data ) {
        if ( err ) next( err );
        if ( ! data ) return res.send( 204 );
        res.json({ groups: data });
    });
};

// Remove user <-> group relation
exports.remove = function( req, res, next ) {
    var userGroup = new UserGroup( req.params.id );

    userGroup.remove( function( err ) {
        if ( err ) next( err );
        res.send( 204 );
    });
};

// Create a user <-> group relation
exports.create = function( req, res, next ) {
    var userGroup = new UserGroup();

    userGroup.save( req.body, function( err, data ) {
        if ( err ) next( err );
        if ( ! data ) return res.send( 400 );
        res.json( data );
    });
};
