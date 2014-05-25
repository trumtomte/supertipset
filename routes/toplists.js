var db = require( '../utilities/database' );

// n/c :D
exports.all = function( req, res, next ) {
    // Stairway to heaven
    db.getTopUsers( function( err, topUsers ) {
        if ( err ) return next( err );

        db.getTopBetTeams( function( err, topBetTeams ) {
            if ( err ) return next( err );

        db.getTopBetPlayers( function( err, topBetPlayers ) {
            if ( err ) return next( err );

        db.getTopGroupsByPoints( function( err, topGroupsPoints ) {
            if ( err ) return next( err );

        db.getTopGroupsByUsers( function( err, topGroupsUsers ) {
            if ( err ) return next( err );

        db.getTopGroupsByAverage( function( err, topGroupsAverage ) {
            if ( err ) return next( err );


            return res.json({
                users: topUsers,
                teams: topBetTeams,
                players: topBetPlayers,
                groups: {
                    points: topGroupsPoints,
                    users: topGroupsUsers,
                    average: topGroupsAverage
                }
            });
        });
        });
        });
        });
        });
    });
};
