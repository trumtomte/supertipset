var mysql = require( 'mysql' );

// Database object and configuration
var conn,
    config = {
        host: process.env.MYSQL_HOST || 'localhost',
        port: process.env.MYSQL_PORT || 3306,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS || '',
        database: process.env.MYSQL_DB || 'supertipset'
    };

// Database connection handler
function DBconnect() {
    conn = mysql.createConnection( config );

    conn.connect( function( err ) {
        if ( err ) {
            console.log( '[SERVER]: Unable to establish a database connection', err ); 
            // Try to reconnect
            setTimeout( DBconnect, 2000 );
        }
        console.log( '[SERVER]: Database connection established' );
    });

    conn.on( 'error', function( err ) {
        console.log( '[DATABASE ERROR]', err );
        if ( err.code === 'PROTOCOL_CONNECTION_LOST' ) {
            // Try to reconnect
            DBconnect();
        } else {
            throw err;
        }
    });
}

DBconnect();

// TODO cleanup deluxé

// SQL Queries
var USERBETS_BY_ID =        'SELECT r.name AS round, r.id AS round_id, g.id AS game_id, g.start_date AS game_start, g.stop_date AS game_stop, b.id AS bet_id, g.team_1_id AS team_1_id, g.team_2_id AS team_2_id, b.team_1_bet AS team_1_bet, b.team_2_bet AS team_2_bet, (SELECT l.name FROM Teams AS l WHERE l.id = g.team_1_id) AS team_1_name, (SELECT l.name FROM Teams AS l WHERE l.id = g.team_2_id) AS team_2_name FROM Users AS u INNER JOIN Bets AS b ON u.id = b.user_id INNER JOIN Games AS g ON b.game_id = g.id INNER JOIN Rounds AS r ON g.round_id = r.id WHERE u.id = ? GROUP BY r.name, g.id',
    UPDATE_BETS =           'UPDATE Bets SET team_1_bet = ?, team_2_bet = ? WHERE id = ?',
    CREATE_BETS =           'INSERT INTO Bets SET ?',
    UPDATE_SPECIALBETS =    'UPDATE BetsSpecial SET player_id = ?, player_goals = ?, team_id = ? WHERE user_id = ?',
    CREATE_SPECIALBETS =    'INSERT INTO BetsSpecial SET ?',
    GROUP_BY_ID =           'SELECT u.username AS username, u.id AS id, u.firstname AS firstname, u.lastname AS lastname, (COALESCE(SUM(p.points), 0) + COALESCE((SELECT bsr.player + bsr.goals + bsr.team FROM BetsSpecialResults AS bsr WHERE bsr.user_id = u.id), 0)) AS points, t.name AS team, t.id AS team_id, g.name AS group_name, g.id AS group_id, g.description AS group_description, g.user_id AS group_admin FROM Users AS u INNER JOIN UsersGroups AS ug ON u.id = ug.user_id INNER JOIN Groups AS g ON ug.group_id = g.id LEFT JOIN Points AS p ON u.id = p.user_id INNER JOIN BetsSpecial AS bs ON u.id = bs.user_id INNER JOIN Teams AS t ON bs.team_id = t.id WHERE g.id = ? AND bs.tournament_id = ? GROUP BY u.username ORDER BY points DESC',
    GROUPSUMMARY_BY_NAME =  'SELECT g.id, g.name, g.user_id, g.password, g.description FROM Groups AS g WHERE g.name = ?',
    DELETE_GROUP =          'DELETE FROM Groups WHERE id = ?',
    CREATE_GROUP =          'INSERT INTO Groups SET ?',
    UPDATE_GROUP_PASS =     'UPDATE Groups SET password = ? WHERE id = ?',
    UPDATE_GROUP_ADMIN =    'UPDATE Groups SET user_id = ? WHERE id = ?',
    UPDATE_GROUP_DESC =     'UPDATE Groups SET description = ? WHERE id = ?',
    ROUNDS_BY_ID =          'SELECT r.name AS round, r.id AS round_id, g.id AS game_id, g.group_name AS group_name, r.start_date AS round_start, r.stop_date AS round_stop, g.start_date AS game_start, g.stop_date AS game_stop, g.team_1_id, g.team_2_id, res.team_1_goals AS team_1_result, res.team_2_goals AS team_2_result, (SELECT l.name FROM Teams AS l WHERE l.id = g.team_1_id) AS team_1_name, (SELECT l.name FROM Teams AS l WHERE l.id = g.team_2_id) AS team_2_name FROM Tournaments AS t INNER JOIN Rounds AS r ON t.id = r.tournament_id INNER JOIN Games AS g ON r.id = g.round_id LEFT JOIN Results as res ON g.id = res.game_id WHERE t.id = ? GROUP BY r.name, g.id ORDER BY g.id',
    USERGROUPS_BY_ID =      'SELECT g.id AS group_id, g.name AS group_name, g.user_id AS group_admin, (SELECT ug.id FROM UsersGroups AS ug WHERE ug.user_id = u.id AND ug.group_id = g.id LIMIT 1) AS relation, u.id AS id, u.username AS username, u.firstname AS firstname, u.lastname AS lastname, (COALESCE(SUM(p.points), 0) + COALESCE((SELECT bsr.player + bsr.goals + bsr.team FROM BetsSpecialResults AS bsr WHERE bsr.user_id = u.id), 0)) AS points, t.name AS team, t.id AS team_id FROM Groups AS g INNER JOIN UsersGroups AS ug ON g.id = ug.group_id INNER JOIN Users AS u ON ug.user_id = u.id LEFT JOIN Points AS p ON u.id = p.user_id INNER JOIN BetsSpecial AS bs ON u.id = bs.user_id INNER JOIN Teams AS t ON bs.team_id = t.id WHERE g.id IN ( SELECT g.id FROM Groups AS g INNER JOIN UsersGroups AS ug ON g.id = ug.group_id INNER JOIN Users AS u ON ug.user_id = u.id WHERE u.id = ? ) GROUP BY g.name, u.username ORDER BY g.name, points DESC',
    CREATE_USERGROUP =      'INSERT INTO UsersGroups SET ?',
    DELETE_USERGROUP =      'DELETE FROM UsersGroups WHERE id = ?',
    USERSUMMARY_BY_ID =     'SELECT u.id, u.username, u.firstname, u.lastname, (COALESCE(SUM(pts.points), 0) + COALESCE((SELECT bsr.player + bsr.goals + bsr.team FROM BetsSpecialResults AS bsr WHERE bsr.user_id = u.id), 0)) AS points, t.name AS team, t.id AS team_id, p.id AS player_id, p.firstname AS player_firstname, p.lastname AS player_lastname, p.team_id AS player_team, bs.player_goals AS player_goals FROM Users AS u LEFT JOIN Points AS pts ON u.id = pts.user_id INNER JOIN BetsSpecial AS bs ON u.id = bs.user_id INNER JOIN Teams AS t ON bs.team_id = t.id INNER JOIN Players AS p ON bs.player_id = p.id WHERE u.id = ?',
    USER_BY_USERNAME =      'SELECT id, username, password FROM Users WHERE username = ?',
    ALL_TEAMS =             'SELECT t.id AS id, t.name AS team, p.id AS player_id, p.firstname AS player_firstname, p.lastname AS player_lastname FROM Teams AS t INNER JOIN Players AS p ON t.id = p.team_id ORDER BY t.name',
    TEAM_BY_ID =            'SELECT t.id AS id, t.name AS team, p.id AS player_id, p.firstname AS player_firstname, p.lastname AS player_lastname FROM Teams AS t INNER JOIN Players AS p ON t.id = p.team_id WHERE t.id = ? ORDER BY t.name',
    TOP_USERS =             'SELECT u.id, u.username, (COALESCE(SUM(p.points), 0) + COALESCE((SELECT bsr.player + bsr.goals + bsr.team FROM BetsSpecialResults AS bsr WHERE bsr.user_id = u.id), 0)) AS points FROM Users AS u LEFT JOIN Points AS p ON u.id = p.user_id GROUP BY u.username ORDER BY points DESC, u.username LIMIT 10',
    TOP_BET_TEAMS =         'SELECT bs.team_id, COUNT(bs.team_id) AS total, (SELECT t.name FROM Teams AS t WHERE t.id = bs.team_id) AS team_name FROM BetsSpecial AS bs GROUP BY bs.team_id ORDER BY total DESC LIMIT 10',
    TOP_BET_PLAYERS =       'SELECT bs.player_id, COUNT(bs.player_id) AS total, (SELECT p.firstname FROM Players AS p WHERE p.id = bs.player_id) AS player_firstname, (SELECT p.lastname FROM Players AS p WHERE p.id = bs.player_id) AS player_lastname FROM BetsSpecial AS bs GROUP BY bs.player_id ORDER BY total DESC LIMIT 10',
    TOP_GROUPS_USERS =      'SELECT g.id, g.name, COUNT(DISTINCT u.id) AS total_users FROM Groups AS g INNER JOIN UsersGroups AS ug ON ug.group_id = g.id INNER JOIN Users AS u ON ug.user_id = u.id GROUP BY g.name ORDER BY total_users DESC LIMIT 10',
    TOP_GROUPS_POINTS =     'SELECT g.id, g.name, (COALESCE(SUM(p.points), 0) + COALESCE((SELECT bsr.player + bsr.goals + bsr.team FROM BetsSpecialResults AS bsr WHERE bsr.user_id = u.id), 0)) AS points FROM Groups AS g INNER JOIN UsersGroups AS ug ON ug.group_id = g.id INNER JOIN Users AS u ON ug.user_id = u.id LEFT JOIN Points AS p ON p.user_id = u.id GROUP BY g.name ORDER BY points DESC LIMIT 10',
    TOP_GROUPS_AVERAGE =    'SELECT g.id, g.name, FLOOR((COALESCE(SUM(p.points), 0) + COALESCE((SELECT bsr.player + bsr.goals + bsr.team FROM BetsSpecialResults AS bsr WHERE bsr.user_id = u.id), 0)) / COUNT(DISTINCT u.id)) AS average FROM Groups AS g INNER JOIN UsersGroups AS ug ON ug.group_id = g.id INNER JOIN Users AS u ON ug.user_id = u.id LEFT JOIN Points AS p ON p.user_id = u.id GROUP BY g.name ORDER BY average DESC LIMIT 10',
    GAME_RESULTS =          'SELECT id, team_1_goals, team_2_goals, game_id FROM Results WHERE game_id = ?',
    USER_BETS_BY_GAME =     'SELECT id, user_id, team_1_bet, team_2_bet, game_id FROM Bets WHERE game_id = ?',
    INSERT_USER_POINTS =    'INSERT IGNORE INTO Points (points, game_id, user_id) VALUES ?',
    UPDATE_USER_PASS =      'UPDATE Users SET password = ? WHERE id = ?',
    CREATE_USER =           'INSERT INTO Users SET ?';

// Get a user by username
exports.getUser = function( username, fn ) {
    conn.query( USER_BY_USERNAME, [username], function( err, rows ) {
        fn( err, rows );
    });
};

// Get a user summary including points etc.
exports.getUserSummary = function( id, fn ) {
    conn.query( USERSUMMARY_BY_ID, [id], function( err, rows ) {
        fn( err, rows );
    });
};

// Get groups by user id
exports.getUserGroups = function( id, fn ) {
    conn.query( USERGROUPS_BY_ID, [id], function( err, rows ) {
        fn( err, rows );
    });
};

// Remove user from a group
exports.removeUserGroup = function( id, fn ) {
    conn.query( DELETE_USERGROUP, [id], function( err, res ) {
        fn( err, res ); 
    });
};

exports.createUserGroup = function( params, fn ) {
    conn.query( CREATE_USERGROUP, params, function( err, res ) {
        fn( err, res );
    });
};

// Get a group by id (and users)
exports.getGroup = function( id, fn ) {
    conn.query( GROUP_BY_ID, [id, 1], function( err, rows ) {
        fn( err, rows );
    });
};

// Get group summary by name
exports.getGroupSummary = function( name, fn ) {
    conn.query( GROUPSUMMARY_BY_NAME, [name], function( err, rows ) {
        fn( err, rows );
    });
};

// Remove group by id
exports.removeGroup = function( id, fn ) {
    conn.query( DELETE_GROUP, [id], function( err, result ) {
        fn( err, result );
    });
};

// Create new group
exports.createGroup = function( params, fn ) {
    conn.query( CREATE_GROUP, params, function( err, result ) {
        fn( err, result );
    });
};

// Update group data by type
exports.updateGroup = function( type, data, fn ) {
    var cb = function( err, result ) {
        fn( err, result );
    };

    switch( type ) {
        case 'admin':
            conn.query( UPDATE_GROUP_ADMIN, data, cb );
            break;
        case 'description':
            conn.query( UPDATE_GROUP_DESC, data, cb );
            break;
        case 'password':
            conn.query( UPDATE_GROUP_PASS, data, cb );
            break;
        default:
            throw new Error( 'No type provided' );
    }
};

// Get tournament rounds by tournament id
exports.getTournamentRounds = function( id, fn ) {
    conn.query( ROUNDS_BY_ID, [id], function( err, rows ) {
        fn( err, rows );
    });
};

// Get user bets by user id
exports.getBets = function( id, fn ) {
    conn.query( USERBETS_BY_ID, [id], function( err, rows ) {
        fn( err, rows );
    });
};

// Update user bets
exports.updateBets = function( params, fn ) {
    conn.query( UPDATE_BETS, params, function( err, res ) {
        fn( err, res );
    });
};

// Create user bets
exports.createBets = function( params, fn ) {
    conn.query( CREATE_BETS, params, function( err, res ) {
        fn( err, res );
    });
};

// Update user specialbets
exports.updateSpecialBets = function( params, fn ) {
    conn.query( UPDATE_SPECIALBETS, params, function( err, res ) {
        fn( err, res );
    });
};

// Create user specialbets
exports.createSpecialBets = function( params, fn ) {
    conn.query( CREATE_SPECIALBETS, params, function( err, res ) {
        fn( err, res );
    });
};

// Get all teams (with players)
exports.getTeams = function( fn ) {
    conn.query( ALL_TEAMS, function( err, res ) {
        fn( err, res );
    });
};

// Get a team by id (with players)
exports.getTeam = function( id, fn ) {
    conn.query( TEAM_BY_ID, [id], function( err, res ) {
        fn( err, res );
    });
};

// Get top list of users by points
exports.getTopUsers = function( fn ) {
    conn.query( TOP_USERS, function( err, res ) {
        fn( err, res );
    });
};

// Get top bet for teams
exports.getTopBetTeams = function( fn ) {
    conn.query( TOP_BET_TEAMS, function( err, res ) {
        fn( err, res );
    });
};

// Get top bet for players
exports.getTopBetPlayers = function( fn ) {
    conn.query( TOP_BET_PLAYERS, function( err, res ) {
        fn( err, res );
    });
};

// Get top list of groups by sum of member points
exports.getTopGroupsByPoints = function( fn ) {
    conn.query( TOP_GROUPS_POINTS, function( err, res ) {
        fn( err, res );
    });
};

// Get top list of groups by amount of members
exports.getTopGroupsByUsers = function( fn ) {
    conn.query( TOP_GROUPS_USERS, function( err, res ) {
        fn( err, res );
    });
};

// Get top list of groups by member average points
exports.getTopGroupsByAverage = function( fn ) {
    conn.query( TOP_GROUPS_AVERAGE, function( err, res ) {
        fn( err, res );
    });
};

// Get game results by id
exports.getGameResults = function( id, fn ) {
    conn.query( GAME_RESULTS, [id], function( err, res ) {
        fn( err, res );
    });
};

// Get user bets by game id
exports.getUserBetsByGame = function( id, fn ) {
    conn.query( USER_BETS_BY_GAME, [id], function( err, res ) {
        fn( err, res );
    });
};

// Insert points for users based on game results and user bets
exports.insertUserPoints = function( params, fn ) {
    conn.query( INSERT_USER_POINTS, [params], function( err, res ) {
        fn( err, res );
    });
};

// Update user password
exports.updateUserPass = function( params, fn ) {
    conn.query( UPDATE_USER_PASS, params, function( err, res ) {
        fn( err, res );
    });
};

// Create a new user
exports.createUser = function( params, fn ) {
    conn.query( CREATE_USER, params, function( err, res ) {
        fn( err, res );
    });
};
