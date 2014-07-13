var Group = require( '../models/group' ).Group,
    _ = require( 'lodash' );

// Get a group (and members) based on group id
exports.findOne = function( req, res, next ) {
    var group = new Group( req.params.id );

    group.fetch( function( err, data ) {
        if ( err ) next( err );
        if ( ! data ) return res.send( 204 );
        res.json({ group: data });
    });
};

// Remove a group by id
exports.remove = function( req, res, next ) {
    var group = new Group( req.params.id );

    group.remove( function( err ) {
        if ( err ) next( err );
        res.send( 204 );
    });
};

// Create a new group and add the user <-> group relation
exports.create = function( req, res, next ) {
    var group = new Group();

    group.save( req.body, function( err, data ) {
        if ( err ) next( err );
        if ( ! data ) return res.send( 400 );
        res.json( data );
    });
};

// Update a group by id
exports.update = function( req, res, next ) {
    var group = new Group( req.params.id );

    group.update( req.body, function( err, data ) {
        if ( err ) next( err );

        if ( _.isString( data ) ) {
            return res.json({ password: data });
        }

        res.send( 200 );
    });
};
