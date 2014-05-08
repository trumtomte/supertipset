// MySQL queries
var queries = require( '../utilities/queries' );

exports = module.exports = function( conn ) {
    // Return all groups (users and points) based on user id
    function find( req, res ) {
        var id = req.params.id,
            limit = req.query.limit || 5;

        conn.query( queries.USERGROUPS_BY_ID, [id], function( err, rows ) {
            if ( err ) {
                return res.json( 500, {
                    statusCode: 500,
                    error: 'Database error'
                });
            }

            if ( ! rows.length ) {
                return res.json( 204, {} );
            }

            // Temporary object for sorting out groups
            var tmp = {},
                groups = [];

            rows.forEach( function( row ) {
                if ( ! ( row.group_name in tmp ) ) {
                   tmp[row.group_name] = []; 
                }

                if ( tmp[row.group_name].length < limit ) {
                    tmp[row.group_name].push( row );
                }
            });

            for ( var name in tmp ) {
                groups.push({
                    name: tmp[name][0].group_name,
                    id: tmp[name][0].group_id,
                    users: tmp[name]
                });
            }

            return res.json({ groups: groups });
        });
    }
    
    return { find: find };
};
