var db = require( '../utilities/database' );

// Get all teams (and players)
exports.all = function( req, res, next ) {
    db.getTeams( function( err, rows ) {
        if ( err ) return next( err );

        if ( ! rows.length ) {
            return res.json( 204, {} );
        }

        var groupedTeams = {},
            teams = [];

        rows.forEach( function( row ) {
            if ( ! ( row.team in groupedTeams ) ) {
                groupedTeams[row.team] = [];
            }

            groupedTeams[row.team].push( row );
        });

        for ( var key in groupedTeams ) {
            var team = {
                name: key,
                id: groupedTeams[key][0].id
            };

            // Restructure each player object
            groupedTeams[key].forEach( function( t, i ) {
                groupedTeams[key][i] = {
                    id: t.player_id,
                    firstname: t.player_firstname,
                    lastname: t.player_lastname
                };
            });

            team.players = groupedTeams[key];
            teams.push( team );
        }

        return res.json({ teams: teams });
    });
};

// Get a team (and players) based on team id
exports.findOne = function( req, res, next ) {
    db.getTeam( req.params.id, function( err, rows ) {
        if ( err ) return next( err );

        if ( ! rows.length ) {
            return res.json( 204, {} );
        }

        var team = {
            id: rows[0].id,
            name: rows[0].team
        };

        rows.forEach( function( t, i ) {
            rows[i] = {
                id: t.player_id,
                firstname: t.player_firstname,
                lastname: t.player_lastname
            };
        });

        team.players = rows;

        return res.json({ team: team });
    });
};
