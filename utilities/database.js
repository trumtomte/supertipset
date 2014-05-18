var mysql = require( 'mysql' );

// SQL Queries
var USERBETS_BY_ID =        'SELECT r.name AS round, r.id AS round_id, g.id AS game_id, b.id AS bet_id, g.team_1_id AS team_1_id, g.team_2_id AS team_2_id, b.team_1_bet AS team_1_bet, b.team_2_bet AS team_2_bet, (SELECT l.name FROM Teams AS l WHERE l.id = g.team_1_id) AS team_1_name, (SELECT l.name FROM Teams AS l WHERE l.id = g.team_2_id) AS team_2_name FROM Users AS u INNER JOIN Bets AS b ON u.id = b.user_id INNER JOIN Games AS g ON b.game_id = g.id INNER JOIN Rounds AS r ON g.round_id = r.id WHERE u.id = ? GROUP BY r.name, g.id',
    UPDATE_BETS =           'UPDATE Bets SET team_1_bet = ?, team_2_bet = ? WHERE id = ?',
    CREATE_BETS =           'INSERT INTO Bets SET ?',
    UPDATE_SPECIALBETS =    'UPDATE BetsSpecial SET player_id = ?, player_goals = ?, team_id = ? WHERE user_id = ?',
    CREATE_SPECIALBETS =    'INSERT INTO BetsSpecial SET ?',
    GROUP_BY_ID =           'SELECT u.username AS username, u.id AS id, u.firstname AS firstname, u.lastname AS lastname, SUM(p.points) AS points, t.name AS team, t.id AS team_id, g.name AS group_name, g.id AS group_id, g.description AS group_description, g.user_id AS group_admin FROM Users AS u INNER JOIN UsersGroups AS ug ON u.id = ug.user_id INNER JOIN Groups AS g ON ug.group_id = g.id INNER JOIN Points AS p ON u.id = p.user_id INNER JOIN BetsSpecial AS bs ON u.id = bs.user_id INNER JOIN Teams AS t ON bs.team_id = t.id WHERE g.id = ? AND bs.tournament_id = ? GROUP BY u.username ORDER BY points DESC',
    ROUNDS_BY_ID =          'SELECT r.name AS round, r.id AS round_id, g.id AS game_id, r.start_date AS round_start, r.stop_date AS round_stop, g.start_date AS game_start, g.stop_date AS game_stop, g.team_1_id, g.team_2_id, res.team_1_goals AS team_1_result, res.team_2_goals AS team_2_result, (SELECT l.name FROM Teams AS l WHERE l.id = g.team_1_id) AS team_1_name, (SELECT l.name FROM Teams AS l WHERE l.id = g.team_2_id) AS team_2_name FROM Tournaments AS t INNER JOIN Rounds AS r ON t.id = r.tournament_id INNER JOIN Games AS g ON r.id = g.round_id LEFT JOIN Results as res ON g.id = res.game_id WHERE t.id = ? GROUP BY r.name, g.id ORDER BY g.id',
    USERGROUPS_BY_ID =      'SELECT g.id AS group_id, g.name AS group_name, g.user_id AS group_admin, u.id AS id, u.username AS username, u.firstname AS firstname, u.lastname AS lastname, SUM(p.points) AS points, t.name AS team, t.id AS team_id FROM Groups AS g INNER JOIN UsersGroups AS ug ON g.id = ug.group_id INNER JOIN Users AS u ON ug.user_id = u.id INNER JOIN Points AS p ON u.id = p.user_id INNER JOIN BetsSpecial AS bs ON u.id = bs.user_id INNER JOIN Teams AS t ON bs.team_id = t.id WHERE g.id IN ( SELECT g.id FROM Groups AS g INNER JOIN UsersGroups AS ug ON g.id = ug.group_id INNER JOIN Users AS u ON ug.user_id = u.id WHERE u.id = ? ) GROUP BY g.name, u.username ORDER BY g.name, points DESC',
    USERSUMMARY_BY_ID =     'SELECT u.id, u.username, u.firstname, u.lastname, SUM(pts.points) AS points, t.name AS team, t.id AS team_id, p.id AS player_id, p.firstname AS player_firstname, p.lastname AS player_lastname, p.team_id AS player_team, bs.player_goals AS player_goals FROM Users AS u INNER JOIN Points AS pts ON u.id = pts.user_id INNER JOIN BetsSpecial AS bs ON u.id = bs.user_id INNER JOIN Teams AS t ON bs.team_id = t.id INNER JOIN Players AS p ON bs.player_id = p.id WHERE u.id = ?',
    USER_BY_ID =            'SELECT id, username, password FROM Users WHERE username = ?'
    ALL_TEAMS =             'SELECT t.id AS id, t.name AS team, p.id AS player_id, p.firstname AS player_firstname, p.lastname AS player_lastname FROM Teams AS t INNER JOIN Players AS p ON t.id = p.team_id ORDER BY t.name',
    TEAM_BY_ID =            'SELECT t.id AS id, t.name AS team, p.id AS player_id, p.firstname AS player_firstname, p.lastname AS player_lastname FROM Teams AS t INNER JOIN Players AS p ON t.id = p.team_id WHERE t.id = ? ORDER BY t.name';

// Create a MySQL connection
var conn = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS || '',
    database: process.env.MYSQL_DB || 'supertipset'
});

// Connect to the database
conn.connect( function( err ) {
    if ( err ) {
        console.log( '[SERVER]: Unable to establish a database connection' ); 
        throw err;
    }

    console.log( '[SERVER]: Database connection established' );
});

// Get a user by username
exports.getUser = function( username, fn ) {
    conn.query( USER_BY_ID, [username], function( err, rows ) {
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

// Get a group by id
exports.getGroup = function( id, fn ) {
    conn.query( GROUP_BY_ID, [id, 1], function( err, rows ) {
        fn( err, rows );
    });
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
