// MySQL queries
var queries = require( '../utilities/queries' );

exports = module.exports = function( conn ) {
    // Return all rounds and games from a tournament based on id
    function find( req, res ) {
        var id = req.params.id;

        conn.query( queries.ROUNDS_BY_ID, [id], function( err, rows ) {
            if ( err ) {
                return res.json( 500, {
                    statusCode: 500,
                    error: 'Database error'
                });
            }

            if ( ! rows.length ) {
                return res.json( 204, {} );
            }
            
            // Temporary object for sorting out rounds
            var tmp = {},
                rounds = [];

            rows.forEach( function( row ) {
                if ( ! ( row.round in tmp ) ) {
                    tmp[row.round] = [];
                }

                tmp[row.round].push( row );
            });

            for ( var name in tmp ) {
                rounds.push({
                    name: name,
                    id: tmp[name][0].round_id,
                    start: tmp[name][0].round_start,
                    stop: tmp[name][0].round_stop,
                    games: tmp[name]
                });
            }

            return res.json({ rounds: rounds });
        });
    }
    
    return { find: find };
};
