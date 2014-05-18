--                                            --
-- Sample of SQL queries for testing purposes --
--                                            --

--
-- Lista alla omgångar
--
SELECT
    r.name AS round, g.id AS game,
    r.start_date AS round_start, r.stop_date AS round_stop,
    g.start_date AS match_start, g.stop_date AS match_stop,
    g.team_1_id, g.team_2_id,
    res.team_1_goals AS team_1_result, res.team_2_goals AS team_2_result,
    (SELECT l.name FROM Teams AS l WHERE l.id = g.team_1_id) AS team_1_name,
    (SELECT l.name FROM Teams AS l WHERE l.id = g.team_2_id) AS team_2_name
	
FROM Tournaments AS t
    INNER JOIN Rounds AS r ON t.id = r.tournament_id
    INNER JOIN Games AS g ON r.id = g.round_id
    LEFT JOIN Results as res ON g.id = res.game_id
	
WHERE t.id = 1
GROUP BY round, game

--
-- Top 10 lista över användare + poäng + vinnarlag
--
SELECT u.username, SUM(p.points) AS points, t.name AS team

FROM Users AS u
	INNER JOIN Points AS p ON u.id = p.user_id
	INNER JOIN BetsSpecial AS bs ON u.id = bs.user_id
	INNER JOIN Teams AS t ON bs.team_id = t.id

GROUP BY u.username
ORDER BY points DESC, u.username
LIMIT 10

--
-- Top 10 lista över användare + poäng + vinnarlag, baserat på en liga (grupp)
--
SELECT u.username, SUM(p.points) AS points, t.name AS team

FROM Users AS u
	INNER JOIN Points AS p ON u.id = p.user_id
	INNER JOIN BetsSpecial AS bs ON u.id = bs.user_id
	INNER JOIN Teams AS t ON bs.team_id = t.id
	INNER JOIN UsersGroups AS ug ON u.id = ug.user_id
	INNER JOIN Groups AS g ON ug.group_id = g.id
	
WHERE g.id = 1
GROUP BY u.username
ORDER BY points DESC, u.username
LIMIT 10

--
-- Lista alla Bets från en användare
--
SELECT
	r.name AS round, g.id AS game,
	b.team_1_goals, b.team_2_goals,
	(SELECT l.name FROM Teams AS l WHERE l.id = g.team_1_id) AS team_1_name,
	(SELECT l.name FROM Teams AS l WHERE l.id = g.team_2_id) AS team_2_name
	
FROM Users AS u
	INNER JOIN Bets AS b ON u.id = b.user_id
	INNER JOIN Games AS g ON b.game_id = g.id
	INNER JOIN Rounds AS r ON g.round_id = r.id
	
WHERE u.id = 1
GROUP BY round, game

--
-- Lista alla Bets från en användare baserat på en omgång
--
SELECT
	b.team_1_goals, b.team_2_goals,
	(SELECT l.name FROM Teams AS l WHERE l.id = g.team_1_id) AS team_1_name,
	(SELECT l.name FROM Teams AS l WHERE l.id = g.team_2_id) AS team_2_name
	
FROM Users AS u
	INNER JOIN Bets AS b ON u.id = b.user_id
	INNER JOIN Games AS g ON b.game_id = g.id
	INNER JOIN Rounds AS r ON g.round_id = r.id
	
WHERE r.id = 1 AND u.id = 1

--
-- Lista alla matchresultat från en omgång
--      kommentera bort WHERE-satsen för att lista alla matchresultat
--
SELECT
	r.name AS round, g.id AS game,
	res.team_1_goals, res.team_2_goals,
	(SELECT l.name FROM Teams AS l WHERE l.id = g.team_1_id) AS team_1_name,
	(SELECT l.name FROM Teams AS l WHERE l.id = g.team_2_id) AS team_2_name
	
FROM Results AS res
	INNER JOIN Games AS g ON res.game_id = g.id
	INNER JOIN Rounds AS r ON g.round_id = r.id
	
WHERE r.id = 1
GROUP BY round, game

--
-- Lista alla bets och resultat från en användare + match (för uträkning av poäng för den matchen)
--
SELECT u.username,
        b.team_1_goals AS team_1_bet, b.team_2_goals AS team_2_bet,
        r.team_1_goals AS team_1_res, r.team_2_goals AS team_2_res

FROM Users AS u
	INNER JOIN Bets AS b ON u.id = b.user_id
	INNER JOIN Games AS g ON b.game_id = g.id
	INNER JOIN Results AS r ON b.game_id = r.id
	
WHERE g.id = 1 AND u.id = 6

--
-- Lista alla grupper som en användare ingår i
--
SELECT g.id, g.name

FROM Groups AS g
	INNER JOIN UsersGroups AS ug ON g.id = ug.group_id
	INNER JOIN Users AS u ON ug.user_id = u.id
	
WHERE u.id = 6

--
-- Lista specialare från en användare
--      Kommentera bort WHERE-satsen för alla användare
--
SELECT
        u.username, u.id,
        p.id AS player_id,
        p.firstname AS player_firstname, p.lastname AS player_lastname,
        t.name AS team, t.id AS team_id,
        bs.player_goals AS goals

FROM Users AS u
	INNER JOIN BetsSpecial AS bs ON u.id = bs.user_id
	INNER JOIN Teams AS t ON bs.team_id = t.id
	INNER JOIN Players AS p ON bs.player_id = p.id
	
WHERE u.id = 6 AND bs.tournament_id = 1

--
-- Lista specialare från en grupp av användare
--
SELECT
        u.username,
        p.firstname AS player_firstname, p.lastname AS player_lastname,
        t.name AS team,
        bs.player_goals AS goals

FROM Users AS u
	INNER JOIN BetsSpecial AS bs ON u.id = bs.user_id
	INNER JOIN Teams AS t ON bs.team_id = t.id
	INNER JOIN Players AS p ON bs.player_id = p.id
	INNER JOIN UsersGroups AS ug ON u.id = ug.user_id
	INNER JOIN Groups AS g ON ug.group_id = g.id
	
WHERE g.id = 1 AND bs.tournament_id = 1

--
-- Gruppers totala poäng (från användarnas poäng)
--
SELECT g.name, SUM(p.points) AS points

FROM Users AS u
	INNER JOIN Points AS p ON u.id = p.user_id
	INNER JOIN UsersGroups AS ug ON u.id = ug.user_id
	INNER JOIN Groups AS g ON ug.group_id = g.id

GROUP BY g.name
ORDER BY points DESC

--
-- En användares totala poäng
--
SELECT u.username, SUM(p.points) AS points

FROM Users AS u
	INNER JOIN Points AS p ON u.id = p.user_id
	
WHERE u.id = 1

--
-- Lista alla medlemmar från grupper där en användare ingår
--  Sorteras efter gruppnamn samt medlemmarnas poäng
--
SELECT
	g.id AS group_id, g.name AS group_name,
	u.id AS user_id, u.username AS username,
	SUM(p.points) AS points

FROM Groups AS g
	INNER JOIN UsersGroups AS ug ON g.id = ug.group_id
	INNER JOIN Users AS u ON ug.user_id = u.id
	INNER JOIN Points AS p ON u.id = p.user_id
	
WHERE g.id IN
(
	SELECT g.id
	FROM Groups AS g 
		INNER JOIN UsersGroups AS ug ON g.id = ug.group_id 
		INNER JOIN Users AS u ON ug.user_id = u.id 
	WHERE u.id = 1	
)

GROUP BY g.name, u.username
ORDER BY g.name, points DESC

--
-- Lista All information från en användare
--
SELECT 
	u.id, u.username, u.firstname, u.lastname,
	SUM(pts.points) AS points,
	t.name AS team, t.id AS team_id,
	p.id AS player_id, p.firstname AS player_firstname, p.lastname AS player_lastname,
	bs.player_goals AS player_goals
	
FROM Users AS u
	INNER JOIN Points AS pts ON u.id = pts.user_id
	INNER JOIN BetsSpecial AS bs ON u.id = bs.user_id
	INNER JOIN Teams AS t ON bs.team_id = t.id
	INNER JOIN Players AS p ON bs.player_id = p.id
	
WHERE u.id = 1

--
-- Lista alla medlemmar (namn, id, poäng, lag) från en grupp (liga)
--
SELECT
	u.username,
	u.id AS user_id,
	SUM(p.points) AS points,
	t.name AS team, t.id AS team_id,
	g.name AS group_name, g.id AS group_id, g.description AS group_description, g.user_id AS group_admin
	
FROM Users AS u
	INNER JOIN UsersGroups AS ug ON u.id = ug.user_id
	INNER JOIN Groups AS g ON ug.group_id = g.id
	INNER JOIN Points AS p ON u.id = p.user_id
	INNER JOIN BetsSpecial AS bs ON u.id = bs.user_id
	INNER JOIN Teams AS t ON bs.team_id = t.id
	
WHERE g.id = 1 AND bs.tournament_id = 1

GROUP BY u.username
ORDER BY points DESC

