var db = require( '../utilities/database' );

function TopListCollection( id ) {
    this.id = id || 0;
}

TopListCollection.prototype.fetch = function( callback ) {
    // Stairway to callback.. :P
    db.conn.query( db.queries.TOP_USERS, function( err, topUsers ) {
        if ( err ) return callback( err, null );

    db.conn.query( db.queries.TOP_BET_TEAMS, function( err, topBetTeams ) {
        if ( err ) return callback( err, null );
        
    db.conn.query( db.queries.TOP_BET_PLAYERS, function( err, topBetPlayers ) {
        if ( err ) return callback( err, null );
        
    db.conn.query( db.queries.TOP_GROUPS_POINTS, function( err, topGroupsPoints ) {
        if ( err ) return callback( err, null );
        
    db.conn.query( db.queries.TOP_GROUPS_USERS, function( err, topGroupsUsers ) {
        if ( err ) return callback( err, null );
        
    db.conn.query( db.queries.TOP_GROUPS_AVERAGE, function( err, topGroupsAverage ) {
        if ( err ) return callback( err, null );
        
        var data = {
            users: topUsers,
            teams: topBetTeams,
            players: topBetPlayers,
            groups: {
                points: topGroupsPoints,
                users: topGroupsUsers,
                average: topGroupsAverage
            }
        };

        callback( err, data );

    }); // TopGroupsByAverage
    }); // TopGroupsByUsers
    }); // TopGroupsByPoints
    }); // TopBetPlayers
    }); // TopBetTeams
    }); // TopUsers

    return this;
};

exports.TopListCollection = TopListCollection;
