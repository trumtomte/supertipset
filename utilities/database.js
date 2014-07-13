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
function ConnectToDatabase() {
    conn = mysql.createConnection( config );

    conn.connect( function( err ) {
        if ( err ) {
            console.log( '[SERVER]: Unable to establish a database connection', err ); 
            // Try to reconnect
            setTimeout( ConnectToDatabase, 2000 );
        }
        console.log( '[SERVER]: Database connection established' );
    });

    conn.on( 'error', function( err ) {
        console.log( '[DATABASE ERROR]', err );
        if ( err.code === 'PROTOCOL_CONNECTION_LOST' ) {
            // Try to reconnect
            ConnectToDatabase();
        } else {
            throw err;
        }
    });
}

ConnectToDatabase();

// Export the database connection
exports.conn = conn;

// Export SQL queries
exports.queries = {
    BETS_BY_USER_ID:        'SELECT r.name AS round, r.id AS round_id, g.id AS game_id, g.start_date AS game_start, g.stop_date AS game_stop, b.id AS bet_id, g.team_1_id AS team_1_id, g.team_2_id AS team_2_id, b.team_1_bet AS team_1_bet, b.team_2_bet AS team_2_bet, (SELECT l.name FROM Teams AS l WHERE l.id = g.team_1_id) AS team_1_name, (SELECT l.name FROM Teams AS l WHERE l.id = g.team_2_id) AS team_2_name FROM Users AS u INNER JOIN Bets AS b ON u.id = b.user_id INNER JOIN Games AS g ON b.game_id = g.id INNER JOIN Rounds AS r ON g.round_id = r.id WHERE u.id = ? GROUP BY r.name, g.id',
    UPDATE_BETS:            'UPDATE Bets SET team_1_bet = ?, team_2_bet = ? WHERE id = ?',
    CREATE_BETS:            'INSERT INTO Bets SET ?',
    GROUP_BY_ID:            'SELECT u.username AS username, u.id AS id, u.firstname AS firstname, u.lastname AS lastname, (COALESCE(SUM(p.points), 0) + COALESCE((SELECT bsr.player + bsr.goals + bsr.team FROM BetsSpecialResults AS bsr WHERE bsr.user_id = u.id), 0)) AS points, t.name AS team, t.id AS team_id, g.name AS group_name, g.id AS group_id, g.description AS group_description, g.user_id AS group_admin FROM Users AS u INNER JOIN UsersGroups AS ug ON u.id = ug.user_id INNER JOIN Groups AS g ON ug.group_id = g.id LEFT JOIN Points AS p ON u.id = p.user_id INNER JOIN BetsSpecial AS bs ON u.id = bs.user_id INNER JOIN Teams AS t ON bs.team_id = t.id WHERE g.id = ? AND bs.tournament_id = ? GROUP BY u.username ORDER BY points DESC',
    GROUPSUMMARY_BY_NAME:   'SELECT g.id, g.name, g.user_id, g.password, g.description FROM Groups AS g WHERE g.name = ?',
    DELETE_GROUP:           'DELETE FROM Groups WHERE id = ?',
    CREATE_GROUP:           'INSERT INTO Groups SET ?',
    UPDATE_GROUP:           'UPDATE Groups SET ',
    CREATE_USERGROUP:       'INSERT INTO UsersGroups SET ?',
    ROUNDS_BY_ID:           'SELECT r.name AS round, r.id AS round_id, g.id AS game_id, g.group_name AS group_name, r.start_date AS round_start, r.stop_date AS round_stop, g.start_date AS game_start, g.stop_date AS game_stop, g.team_1_id, g.team_2_id, res.team_1_goals AS team_1_result, res.team_2_goals AS team_2_result, (SELECT l.name FROM Teams AS l WHERE l.id = g.team_1_id) AS team_1_name, (SELECT l.name FROM Teams AS l WHERE l.id = g.team_2_id) AS team_2_name FROM Tournaments AS t INNER JOIN Rounds AS r ON t.id = r.tournament_id INNER JOIN Games AS g ON r.id = g.round_id LEFT JOIN Results as res ON g.id = res.game_id WHERE t.id = ? GROUP BY r.name, g.id ORDER BY g.id',
    UPDATE_SPECIALBETS:     'UPDATE BetsSpecial SET player_id = ?, player_goals = ?, team_id = ? WHERE user_id = ?',
    CREATE_SPECIALBETS:     'INSERT INTO BetsSpecial SET ?',
    ALL_TEAMS:              'SELECT t.id AS id, t.name AS team, p.id AS player_id, p.firstname AS player_firstname, p.lastname AS player_lastname FROM Teams AS t INNER JOIN Players AS p ON t.id = p.team_id ORDER BY t.name',
    TEAM_BY_ID:             'SELECT t.id AS id, t.name AS team, p.id AS player_id, p.firstname AS player_firstname, p.lastname AS player_lastname FROM Teams AS t INNER JOIN Players AS p ON t.id = p.team_id WHERE t.id = ? ORDER BY t.name',
    TOP_USERS:              'SELECT u.id, u.username, (COALESCE(SUM(p.points), 0) + COALESCE((SELECT bsr.player + bsr.goals + bsr.team FROM BetsSpecialResults AS bsr WHERE bsr.user_id = u.id), 0)) AS points FROM Users AS u LEFT JOIN Points AS p ON u.id = p.user_id GROUP BY u.username ORDER BY points DESC, u.username LIMIT 10',
    TOP_BET_TEAMS:          'SELECT bs.team_id, COUNT(bs.team_id) AS total, (SELECT t.name FROM Teams AS t WHERE t.id = bs.team_id) AS team_name FROM BetsSpecial AS bs GROUP BY bs.team_id ORDER BY total DESC LIMIT 10',
    TOP_BET_PLAYERS:        'SELECT bs.player_id, COUNT(bs.player_id) AS total, (SELECT p.firstname FROM Players AS p WHERE p.id = bs.player_id) AS player_firstname, (SELECT p.lastname FROM Players AS p WHERE p.id = bs.player_id) AS player_lastname FROM BetsSpecial AS bs GROUP BY bs.player_id ORDER BY total DESC LIMIT 10',
    TOP_GROUPS_USERS:       'SELECT g.id, g.name, COUNT(DISTINCT u.id) AS total_users FROM Groups AS g INNER JOIN UsersGroups AS ug ON ug.group_id = g.id INNER JOIN Users AS u ON ug.user_id = u.id GROUP BY g.name ORDER BY total_users DESC LIMIT 10',
    TOP_GROUPS_POINTS:      'SELECT g.id, g.name, (COALESCE(SUM(p.points), 0) + COALESCE((SELECT bsr.player + bsr.goals + bsr.team FROM BetsSpecialResults AS bsr WHERE bsr.user_id = u.id), 0)) AS points FROM Groups AS g INNER JOIN UsersGroups AS ug ON ug.group_id = g.id INNER JOIN Users AS u ON ug.user_id = u.id LEFT JOIN Points AS p ON p.user_id = u.id GROUP BY g.name ORDER BY points DESC LIMIT 10',
    TOP_GROUPS_AVERAGE:     'SELECT g.id, g.name, FLOOR((COALESCE(SUM(p.points), 0) + COALESCE((SELECT bsr.player + bsr.goals + bsr.team FROM BetsSpecialResults AS bsr WHERE bsr.user_id = u.id), 0)) / COUNT(DISTINCT u.id)) AS average FROM Groups AS g INNER JOIN UsersGroups AS ug ON ug.group_id = g.id INNER JOIN Users AS u ON ug.user_id = u.id LEFT JOIN Points AS p ON p.user_id = u.id GROUP BY g.name ORDER BY average DESC LIMIT 10',
    USER_BY_ID:             'SELECT u.id, u.username, u.firstname, u.lastname, u.password, (COALESCE(SUM(pts.points), 0) + COALESCE((SELECT bsr.player + bsr.goals + bsr.team FROM BetsSpecialResults AS bsr WHERE bsr.user_id = u.id), 0)) AS points, t.name AS team, t.id AS team_id, p.id AS player_id, p.firstname AS player_firstname, p.lastname AS player_lastname, p.team_id AS player_team, bs.player_goals AS player_goals FROM Users AS u LEFT JOIN Points AS pts ON u.id = pts.user_id INNER JOIN BetsSpecial AS bs ON u.id = bs.user_id INNER JOIN Teams AS t ON bs.team_id = t.id INNER JOIN Players AS p ON bs.player_id = p.id WHERE u.id = ?',
    USER_BY_NAME:           'SELECT id, username, password FROM Users WHERE username = ?',
    CREATE_USER:            'INSERT INTO Users SET ?',
    UPDATE_USER_PASS:       'UPDATE Users SET password = ? WHERE id = ?',
    USERGROUPS_BY_ID:       'SELECT g.id AS group_id, g.name AS group_name, g.user_id AS group_admin, (SELECT ug.id FROM UsersGroups AS ug WHERE ug.user_id = u.id AND ug.group_id = g.id LIMIT 1) AS relation, u.id AS id, u.username AS username, u.firstname AS firstname, u.lastname AS lastname, (COALESCE(SUM(p.points), 0) + COALESCE((SELECT bsr.player + bsr.goals + bsr.team FROM BetsSpecialResults AS bsr WHERE bsr.user_id = u.id), 0)) AS points, t.name AS team, t.id AS team_id FROM Groups AS g INNER JOIN UsersGroups AS ug ON g.id = ug.group_id INNER JOIN Users AS u ON ug.user_id = u.id LEFT JOIN Points AS p ON u.id = p.user_id INNER JOIN BetsSpecial AS bs ON u.id = bs.user_id INNER JOIN Teams AS t ON bs.team_id = t.id WHERE g.id IN ( SELECT g.id FROM Groups AS g INNER JOIN UsersGroups AS ug ON g.id = ug.group_id INNER JOIN Users AS u ON ug.user_id = u.id WHERE u.id = ? ) GROUP BY g.name, u.username ORDER BY g.name, points DESC',
    CREATE_USERGROUP:       'INSERT INTO UsersGroups SET ?',
    DELETE_USERGROUP:       'DELETE FROM UsersGroups WHERE id = ?',
    RESULTS_BY_GAME_ID:     'SELECT id, team_1_goals, team_2_goals, game_id FROM Results WHERE game_id = ?',
    USERBETS_BY_GAME_ID:    'SELECT id, user_id, team_1_bet, team_2_bet, game_id FROM Bets WHERE game_id = ?',
    INSERT_USERPOINTS:      'INSERT IGNORE INTO Points (points, game_id, user_id) VALUES ?'
};
