// MySQL queries
var queries = require( '../utilities/queries' );

exports = module.exports = function( conn ) {
    // Return one user (with specialbets and points) by id
    function findOne( req, res ) {
        var id = req.params.id;

        // tournament_id = 1
        conn.query( queries.GROUP_BY_ID, [id, 1], function( err, rows ) {
            if ( err ) {
                return res.json( 500, {
                    statusCode: 500,
                    error: 'Database error'
                });
            }

            if ( ! rows.length ) {
                return res.json( 204, {} );
            }

            var group = {
                name: rows[0].group_name,
                id: rows[0].group_id,
                description: rows[0].group_description,
                admin: rows[0].group_admin,
                users: rows
            };

            return res.json({ group: group });
        });
    }

    return { findOne: findOne };
};

