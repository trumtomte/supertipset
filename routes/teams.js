
var team = require( '../models/team' ),
    Team = team.Team,
    TeamsCollection = team.TeamsCollection;

// Get all teams (and players)
exports.all = function( req, res, next ) {
    var teamsCollection = new TeamsCollection();

    teamsCollection.fetch( function( err, data ) {
        if ( err ) next( err );
        if ( ! data ) return res.send( 204 );
        res.json({ teams: data });
    });
};

// Get a team (and players) based on team id
exports.findOne = function( req, res, next ) {
    var team = new Team( req.params.id );

    team.fetch( function( err, data ) {
        if ( err ) next( err );
        if ( ! data ) return res.send( 204 );
        res.json({ team: data });
    });
};
