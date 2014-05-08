// MySQL queries
var queries = require( '../utilities/queries' );

exports = module.exports = function( conn ) {
    // Return all bets by id
    function find( req, res ) {
        var id = req.params.id;

        conn.query( queries.USERBETS_BY_ID, [id], function( err, rows ) {
            if ( err ) {
                return res.json( 500, {
                    statusCode: 500,
                    error: 'Database error'
                });
            }

            if ( ! rows.length ) {
                return res.json( 204, {} );
            }

            // Temporary object for sorting out bets (grouped by round)
            var tmp = {},
                bets = [];

            rows.forEach( function( row ) {
                if ( ! ( row.round in tmp ) ) {
                    tmp[row.round] = [];
                }

                tmp[row.round].push( row );
            });

            for ( var name in tmp ) {
                bets.push({
                    round: name,
                    round_id: tmp[name][0].round_id,
                    bets: tmp[name]
                });
            }

            return res.json({ bets: bets });
        });
    }

    function update( req, res ) {
        var params = [
            req.body.team_1_goals,
            req.body.team_2_goals,
            req.body.id
        ];

        conn.query( queries.UPDATE_BETS, params, function( err, result ) {
            if ( err ) {
                return res.json( 500, {
                    statusCode: 500,
                    error: 'Database error'
                });
            }

            return res.json( result );
        });
    }

    function create( req, res ) {
        conn.query( queries.CREATE_BET, req.body, function( err, result ) {
            if ( err ) {
                return res.json( 500, {
                    statusCode: 500,
                    error: 'Database error'
                });
            }

            return res.json( result );
        });
    }

    return {
        find: find,
        update: update,
        create: create
    };
};
