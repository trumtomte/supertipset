// MySQL queries
var queries = require( '../utilities/queries' );

module.exports = function( conn ) {
    // Return one user (with specialbets and points) by id
    function findOne( req, res ) {
        var id = req.params.id;

        conn.query( queries.USER_BY_ID, [id], function( err, rows ) {
            if ( err ) {
                return res.json( 500, {
                    statusCode: 500,
                    error: 'Database error'
                });
            }

            if ( ! rows.length ) {
                return res.json( 204, {} );
            }

            return res.json({ user: rows[0] });
        });
    }

    return { findOne: findOne };
};
