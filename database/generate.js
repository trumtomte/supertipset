// TODO DB schema has changed this is most likely incorrect (db columns)

// Requires node module "faker"
var fs = require( 'fs' ),
    faker = require( 'Faker' );

// Check if value is INT
function isInt(n) {
   return typeof n === 'number' && n % 1 == 0;
}

// Convert object to insert column
function toInsertColumn( obj ) {
    var str = '(';

    for ( var attr in obj ) {
        if ( obj.hasOwnProperty( attr ) ) {
            var v = obj[attr];
            str += isInt( v ) ? v + ', ' : "'" + v + "', ";
        }
    }

    return str.substring( 0, str.length - 2 ) + '),\n';
};

// write to file
function write( f, s ) {
    fs.writeFile( f, s, function( e ) {
        if ( e ) {
            console.log( "Unable to write to file", e );
        } else {
            console.log( "File written!", f );
        }
    });
}

// Base variables
var numUsers = 20,
    numGroups = 4,
    numGames = 13,
    numTeams = 14,
    playersPerTeam = 20;

// USERS
var users = [],
    usersStr = '';

for ( var i = 0; i < numUsers; i++ ) {
    var firstname = faker.Name.firstName().replace("'", ''),
        lastname = faker.Name.lastName().replace("'", ''),
        username = firstname.toLowerCase();

    var user = {
        username: username,
        password: '123',
        firstname: firstname,
        lastname: lastname
    }

    users.push( user );
    usersStr += toInsertColumn( user );
}

// write( 'users.txt', usersStr );

// User <-> Group relation
var usersGroups = '';

for ( var i = 0; i < numUsers; i++ ) {
    var r = Math.round( Math.random() * 4 );

    for ( var j = 0; j < r; j++ ) {
        usersGroups += toInsertColumn({
            userId: ( i + 1 ),
            groupdId: ( j + 1 )
        });
    }
}

// write( 'usersGroups.txt', usersGroups );

// BETSSPECIAL
var betsSpecial = '';

for ( var i = 0; i < numUsers; i++ ) {
    var rT = Math.round( Math.random() * numTeams ),
        rP = Math.round( Math.random() * ( numTeams * playersPerTeam ) ),
        rG = Math.round( Math.random() * 25 );

    betsSpecial += '(' + [( i + 1 ), rP, rG, rT, 1].join( ', ' ) + '),\n';
}

// write( 'betsSpecial.txt', betsSpecial );

// PLAYERS
var players = '';

for ( var i = 0; i < numTeams; i++ ) {
    for ( var j = 0; j < playersPerTeam; j++ ) {
        players += toInsertColumn({
            firstname: faker.Name.firstName().replace("'", ''),
            lastname: faker.Name.lastName().replace("'", ''),
            teamId: ( i + 1 )
        });
    }
}

// write( 'players.txt', players );

// GOALS
var goals = '';

for ( var i = 0; i < ( numTeams * playersPerTeam ); i++ ) {
    goals += toInsertColumn({
        playerId: ( i + 1 ),
        gameId: Math.round( Math.random() * numGames ),
        goals: Math.round( Math.random() * 3 )
    });
}

// write( 'goals.txt', goals );

// BETS
var bets = [],
    betsStr = '';

for ( var i = 0; i < numUsers; i++ ) {
    for ( var j = 0; j < numGames; j++ ) {
        var t1Goals = Math.round( Math.random() * 4 ),
            t2Goals = Math.round( Math.random() * 4 );

        var bet = {
            userId: ( i + 1 ),
            t1Goals: t1Goals,
            t2Goals: t2Goals,
            gameId: ( j + 1 )
        }

        bets.push( bet );
        betsStr += toInsertColumn( bet );
    }
}

// write( 'bets.txt', betsStr );

// RESULTS
var results = [],
    resultsStr = '';

for ( var i = 0; i < numGames; i++ ) {
    var t1Goals = Math.round( Math.random() * 4 ),
        t2Goals = Math.round( Math.random() * 4 );
    
    var res = {
        t1Goals: t1Goals,
        t2Goals: t2Goals,
        gameId: ( i + 1 )
    };

    results.push( res );
    resultsStr += toInsertColumn( res );
}

// write( 'results.txt', resultsStr );

// POINTS
var points = '';

for ( var i = 0; i < numUsers; i++ ) {
    var index = i * numGames;

    for ( var j = 0; j < numGames; j++ ) {
        // User bets, game results, and user points
        var b = bets[index + j],
            g = results[j],
            p = 0;

        // Bettade rätt på båda lagens poäng
        if ( b.t1Goals == g.t1Goals &&
             b.t2Goals == g.t2Goals ) {
            p += 4;
        } else {
            var gR = g.t1Goals - g.t2Goals,
                uR = b.t1Goals - b.t2Goals;

            // Satsade på att lag 1 vann
            if ( gR > 0 && uR > 0 ) {
                p++;
            // Satsade på att lag 2 vann
            } else if ( gR < 0 == uR < 0 ) {
                p++;
            // Satsade på oavgjort
            } else if ( gR == 0 && uR == 0 ) {
                p++;
            }
        }

        points += '(' + [p, ( j + 1 ), ( i + 1 )].join( ', ' ) + '),\n';
    }
}

// write( 'points.txt', points );

// Write a complete insert.sql file
var out = '';

out += 'INSERT INTO Users (username, password, firstname, lastname) VALUES\n';
out += usersStr.substring( 0, usersStr.length - 2 ) + ';\n';

out += '\nINSERT INTO UsersGroups (user_id, group_id) VALUES\n';
out += usersGroups.substring( 0, usersGroups.length - 2 ) + ';\n';

out += '\nINSERT INTO BetsSpecial (user_id, player_id, player_goals, team_id, tournament_id) VALUES\n';
out += betsSpecial.substring( 0, betsSpecial.length - 2 ) + ';\n';

out += '\nINSERT INTO Players (firstname, lastname, team_id) VALUES\n';
out += players.substring( 0, players.length - 2 ) + ';\n';

out += '\nINSERT INTO Goals (player_id, game_id, goals) VALUES\n';
out += goals.substring( 0, goals.length - 2 ) + ';\n';

out += '\nINSERT INTO Bets (user_id, team_1_goals, team_2_goals, game_id) VALUES\n';
out += betsStr.substring( 0, betsStr.length - 2 ) + ';\n';

out += '\nINSERT INTO Results (team_1_goals, team_2_goals, game_id) VALUES\n';
out += resultsStr.substring( 0, resultsStr.length - 2 ) + ';\n';

out += '\nINSERT INTO Points (points, game_id, user_id) VALUES\n';
out += points.substring( 0, points.length - 2 ) + ';\n';

write( 'insert.sql', out );
