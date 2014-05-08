--                             --
-- SUPERTIPSET DATABASE SCHEMA --
-- --------------------------- --

--
-- Users table
--
CREATE TABLE Users (
    id          INT UNSIGNED AUTO_INCREMENT NOT NULL,
    username    VARCHAR(255) NOT NULL,
    password    VARCHAR(200) DEFAULT '' NOT NULL,
    firstname   VARCHAR(50) DEFAULT '' NOT NULL,
    lastname    VARCHAR(50) DEFAULT '' NOT NULL,
    created     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=InnoDB;

--
-- User <-> Group relation
--
CREATE TABLE UsersGroups (
    id          INT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_id     INT UNSIGNED NOT NULL,
    group_id    INT UNSIGNED NOT NULL,
    PRIMARY KEY(id)
) ENGINE=InnoDB;


--
-- Groups table
--
CREATE TABLE Groups (
    id              INT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_id         INT UNSIGNED NOT NULL,
    name            VARCHAR(50) NOT NULL,
    password        VARCHAR(200) DEFAULT '' NOT NULL,
    description     TEXT NOT NULL,
    created         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=InnoDB;

--
-- Bets table
--
CREATE TABLE Bets (
    id              INT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_id         INT UNSIGNED NOT NULL,
    game_id         INT UNSIGNED NOT NULL,
    team_1_bet      TINYINT UNSIGNED NOT NULL,
    team_2_bet      TINYINT UNSIGNED NOT NULL,
    created         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=InnoDB;

--
-- Special Bets table
--
CREATE TABLE BetsSpecial (
    id              INT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_id         INT UNSIGNED NOT NULL,
    player_id       INT UNSIGNED NOT NULL,
    player_goals    TINYINT UNSIGNED NOT NULL,
    team_id         INT UNSIGNED NOT NULL,
    tournament_id   INT UNSIGNED NOT NULL,
    created         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=InnoDB;

--
-- Special Bets results table
--
CREATE TABLE BetsSpecialResults (
    id              INT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_id         INT UNSIGNED NOT NULL,
    player          TINYINT UNSIGNED NOT NULL,
    goals           TINYINT UNSIGNED NOT NULL,
    team            TINYINT UNSIGNED NOT NULL,
    tournament_id   INT UNSIGNED NOT NULL,
    created         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=InnoDB;

--
-- Points table
--
CREATE TABLE Points (
    id          INT UNSIGNED AUTO_INCREMENT NOT NULL,
    points      INT UNSIGNED NOT NULL,
    game_id     INT UNSIGNED NOT NULL,
    user_id     INT UNSIGNED NOT NULL,
    created     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=InnoDB;

--
-- Results table
--
CREATE TABLE Results (
    id              INT UNSIGNED AUTO_INCREMENT NOT NULL,
    team_1_goals    TINYINT UNSIGNED NOT NULL,
    team_2_goals    TINYINT UNSIGNED NOT NULL,
    game_id         INT UNSIGNED NOT NULL,
    created         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=InnoDB;

--
-- Tournaments table
--
CREATE TABLE Tournaments (
    id          INT UNSIGNED AUTO_INCREMENT NOT NULL,
    name        VARCHAR(50) NOT NULL,
    start_date  TIMESTAMP DEFAULT '0000-00-00 00:00:00',
    stop_date   TIMESTAMP DEFAULT '0000-00-00 00:00:00',
    created     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=InnoDB;

--
-- Rounds table
--
CREATE TABLE Rounds (
    id              INT UNSIGNED AUTO_INCREMENT NOT NULL,
    name            VARCHAR(50) NOT NULL,
    tournament_id   INT UNSIGNED NOT NULL,
    start_date      TIMESTAMP DEFAULT '0000-00-00 00:00:00',
    stop_date       TIMESTAMP DEFAULT '0000-00-00 00:00:00',
    created         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=InnoDB;

--
-- Games table
--
CREATE TABLE Games (
    id          INT UNSIGNED AUTO_INCREMENT NOT NULL,
    team_1_id   INT UNSIGNED NOT NULL,
    team_2_id   INT UNSIGNED NOT NULL,
    round_id    INT UNSIGNED NOT NULL,
    start_date  TIMESTAMP DEFAULT '0000-00-00 00:00:00',
    stop_date   TIMESTAMP DEFAULT '0000-00-00 00:00:00',
    created     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=InnoDB;

--
-- Teams table
--
CREATE TABLE Teams (
    id          INT UNSIGNED AUTO_INCREMENT NOT NULL,
    name        VARCHAR(50) NOT NULL,
    country     VARCHAR(50) DEFAULT '' NOT NULL,
    created     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=InnoDB;

--
-- Players table
--
CREATE TABLE Players (
    id          INT UNSIGNED AUTO_INCREMENT NOT NULL,
    firstname   VARCHAR(50) NOT NULL,
    lastname    VARCHAR(50) NOT NULL,
    team_id     INT UNSIGNED NOT NULL,
    created     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=InnoDB;

--
-- Goals table
--
CREATE TABLE Goals (
    id          INT UNSIGNED AUTO_INCREMENT NOT NULL,
    player_id   INT UNSIGNED NOT NULL,
    game_id     INT UNSIGNED NOT NULL,
    goals       SMALLINT UNSIGNED NOT NULL,
    created     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
) ENGINE=InnoDB;


--                   --
-- SELECT Statements --
--                   --

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

--              --
-- RANDOM DATA  --
--              --

-- GROUPS
INSERT INTO Groups (user_id, name, password, description) VALUES
    (1, 'Tuffa Ligan EU', 'qdjoasjid123d', 'heh'),
    (2, 'Dom som äger hårt som stock', '01j2e8jasjdo', 'heh'),
    (3, 'WeAreAwesome', 'j0e812jeasd', 'heh'),
    (4, 'Cool_Kids_On_The_Block', '09weoiajwe212e', 'heh');

-- TOURNAMENTS
INSERT INTO Tournaments (name) VALUES
    ('VM14');

-- ROUNDS
INSERT INTO Rounds (name, tournament_id) VALUES
    ('1:a Rundan', 1),
    ('2:a Rundan', 1),
    ('3:e Rundan', 1),
    ('Åttondelsfinaler', 1),
    ('Kvartsfinaler', 1),
    ('Semifinaler', 1),
    ('Final och tredjepris', 1);

-- GAMES
INSERT INTO Games (team_1_id, team_2_id, round_id) VALUES
    (1, 2, 1),
    (3, 4, 1),
    (5, 6, 1),
    (7, 8, 1),
    (9, 10, 1),
    (11, 12, 1),
    (13, 14, 1),
    (1, 4, 2),
    (2, 3, 2),
    (10, 11, 2),
    (7, 5, 2),
    (1, 11, 2),
    (4, 7, 3);

-- TEAMS
INSERT INTO Teams (name) VALUES
    ('Sverige'),
    ('Tyskland'),
    ('England'), 
    ('Spanien'),
    ('Ukraina'), 
    ('Ryssland'),
    ('Portugal'), 
    ('Italien'),
    ('Nigeria'),
    ('Kamerun'),
    ('Danmark'), 
    ('Polen'),
    ('Brasilien'), 
    ('Argentina');
    
-- PLAYERS

-- BETS

-- POINTS

-- RESULTS

-- GOALS

-- USERS

-- Users <-> Groups relation

-- BETS SPECIALS

--
-- RANDOM GENERATED DATA
--

INSERT INTO Users (username, password, firstname, lastname) VALUES
('carlos', '123', 'Carlos', 'Satterfield'),
('guiseppe', '123', 'Guiseppe', 'Koss'),
('stephania', '123', 'Stephania', 'Blanda'),
('pascale', '123', 'Pascale', 'Corkery'),
('mohammad', '123', 'Mohammad', 'Ledner'),
('ned', '123', 'Ned', 'Cruickshank'),
('kaela', '123', 'Kaela', 'Armstrong'),
('jarod', '123', 'Jarod', 'Lockman'),
('harrison', '123', 'Harrison', 'Steuber'),
('werner', '123', 'Werner', 'Zemlak'),
('delphine', '123', 'Delphine', 'Bernhard'),
('kip', '123', 'Kip', 'Bradtke'),
('isabell', '123', 'Isabell', 'Abshire'),
('rene', '123', 'Rene', 'Nitzsche'),
('darby', '123', 'Darby', 'Stanton'),
('rozella', '123', 'Rozella', 'Walker'),
('webster', '123', 'Webster', 'Metz'),
('jed', '123', 'Jed', 'Koepp'),
('torey', '123', 'Torey', 'Stokes'),
('freeman', '123', 'Freeman', 'Bednar');

INSERT INTO UsersGroups (user_id, group_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(3, 1),
(3, 2),
(3, 3),
(4, 1),
(4, 2),
(4, 3),
(4, 4),
(5, 1),
(5, 2),
(5, 3),
(6, 1),
(6, 2),
(6, 3),
(6, 4),
(7, 1),
(7, 2),
(7, 3),
(8, 1),
(9, 1),
(9, 2),
(10, 1),
(10, 2),
(10, 3),
(11, 1),
(11, 2),
(11, 3),
(11, 4),
(13, 1),
(14, 1),
(14, 2),
(15, 1),
(15, 2),
(16, 1),
(19, 1),
(19, 2),
(19, 3),
(19, 4),
(20, 1),
(20, 2),
(20, 3);

INSERT INTO BetsSpecial (user_id, player_id, player_goals, team_id) VALUES
(1, 157, 25, 12),
(2, 79, 22, 1),
(3, 243, 13, 8),
(4, 220, 9, 3),
(5, 20, 5, 3),
(6, 268, 6, 13),
(7, 149, 7, 0),
(8, 131, 23, 7),
(9, 133, 0, 2),
(10, 187, 10, 0),
(11, 13, 9, 13),
(12, 167, 5, 10),
(13, 215, 4, 1),
(14, 259, 10, 14),
(15, 157, 13, 1),
(16, 130, 6, 4),
(17, 174, 15, 11),
(18, 178, 2, 6),
(19, 195, 17, 10),
(20, 135, 0, 6);

INSERT INTO Players (firstname, lastname, team_id) VALUES
('Audreanne', 'Hermiston', 1),
('Patrick', 'Shields', 1),
('Marguerite', 'Walsh', 1),
('Sylvester', 'Ward', 1),
('Emery', 'Marks', 1),
('Felicity', 'Bruen', 1),
('Ofelia', 'Kuvalis', 1),
('Rubie', 'Gerhold', 1),
('Anastasia', 'Leuschke', 1),
('Shyann', 'Schowalter', 1),
('Valentin', 'Gerhold', 1),
('Toney', 'Bartell', 1),
('Dax', 'Langworth', 1),
('Kiley', 'Gleichner', 1),
('Estell', 'Stanton', 1),
('Stone', 'Gleichner', 1),
('Reuben', 'Hoeger', 1),
('Angeline', 'Fay', 1),
('Keira', 'Luettgen', 1),
('Emile', 'Parker', 1),
('Austen', 'Streich', 2),
('Stacey', 'Prohaska', 2),
('Isabella', 'Nicolas', 2),
('Santiago', 'Willms', 2),
('Piper', 'Effertz', 2),
('Rowan', 'Lang', 2),
('Osvaldo', 'Kuphal', 2),
('Elias', 'Nienow', 2),
('Keyon', 'Davis', 2),
('Haleigh', 'Hickle', 2),
('Assunta', 'Bartell', 2),
('Joyce', 'Kreiger', 2),
('Brendan', 'Koch', 2),
('Cortez', 'Hahn', 2),
('Merl', 'Schuster', 2),
('Bernie', 'Marks', 2),
('Calista', 'Ritchie', 2),
('Keyshawn', 'Bahringer', 2),
('Mariam', 'OKon', 2),
('Misty', 'Volkman', 2),
('Bailey', 'Kshlerin', 3),
('Kirstin', 'Nicolas', 3),
('Kamren', 'Stehr', 3),
('Kasandra', 'Batz', 3),
('Lenna', 'Ledner', 3),
('General', 'Kuhlman', 3),
('Joy', 'Yundt', 3),
('Ward', 'Runolfsson', 3),
('Angel', 'Flatley', 3),
('Desmond', 'Fay', 3),
('Jarrell', 'Dooley', 3),
('Alyce', 'Eichmann', 3),
('Eva', 'Fay', 3),
('Gwendolyn', 'Tromp', 3),
('Nina', 'Cole', 3),
('Julia', 'Fadel', 3),
('Karina', 'DAmore', 3),
('Bartholome', 'Johnston', 3),
('Carli', 'Witting', 3),
('Brenden', 'Shanahan', 3),
('Everette', 'Smitham', 4),
('Thaddeus', 'Hane', 4),
('Isaac', 'Ryan', 4),
('Lenny', 'Goodwin', 4),
('Celine', 'Fahey', 4),
('Cynthia', 'Hills', 4),
('Adeline', 'Rolfson', 4),
('Lizzie', 'Brakus', 4),
('Kayla', 'Schumm', 4),
('Devonte', 'Hegmann', 4),
('Nikki', 'Schmeler', 4),
('Rocio', 'Reichert', 4),
('Ayla', 'OKon', 4),
('Ludie', 'Bernier', 4),
('Elva', 'Turcotte', 4),
('Elna', 'Davis', 4),
('Antoinette', 'Toy', 4),
('Vernon', 'Cormier', 4),
('Ariel', 'Nicolas', 4),
('Jazlyn', 'Schimmel', 4),
('Nigel', 'Feest', 5),
('Arlene', 'Hessel', 5),
('Lulu', 'Wyman', 5),
('Jaron', 'Kiehn', 5),
('Melyssa', 'Farrell', 5),
('Emilia', 'Mann', 5),
('Vito', 'Dare', 5),
('Felton', 'Feest', 5),
('Lyda', 'Monahan', 5),
('Lewis', 'Klocko', 5),
('Grace', 'Crooks', 5),
('Kirk', 'Bernier', 5),
('Billie', 'Dicki', 5),
('Aiyana', 'Rolfson', 5),
('Noble', 'Green', 5),
('Mustafa', 'Blanda', 5),
('Roslyn', 'Koch', 5),
('General', 'Schimmel', 5),
('Meda', 'Schumm', 5),
('Osbaldo', 'Tromp', 5),
('Jevon', 'Runte', 6),
('Blanca', 'Harber', 6),
('Alanis', 'Welch', 6),
('Otha', 'Crooks', 6),
('Ansley', 'Bashirian', 6),
('Keven', 'Dietrich', 6),
('Jocelyn', 'OHara', 6),
('Kiara', 'Becker', 6),
('Bartholome', 'Grimes', 6),
('Hilton', 'Gleichner', 6),
('Dion', 'Hills', 6),
('Kasandra', 'Dibbert', 6),
('Karianne', 'Goyette', 6),
('Marquis', 'Hudson', 6),
('Enola', 'Beahan', 6),
('Ettie', 'Hodkiewicz', 6),
('Adrain', 'Towne', 6),
('Linwood', 'DuBuque', 6),
('Mckayla', 'OHara', 6),
('Pat', 'Thompson', 6),
('Elroy', 'Conn', 7),
('Ryley', 'Schmeler', 7),
('Maurice', 'Schaefer', 7),
('Hilton', 'Jakubowski', 7),
('Joyce', 'Watsica', 7),
('Wilson', 'Considine', 7),
('Lucy', 'Dickens', 7),
('Rose', 'Jones', 7),
('Lowell', 'Strosin', 7),
('Martin', 'Guªann', 7),
('Cleveland', 'Brekke', 7),
('Amya', 'Lang', 7),
('Telly', 'Schamberger', 7),
('Dortha', 'Botsford', 7),
('Akeem', 'Conn', 7),
('Preston', 'Boyer', 7),
('Leonardo', 'Johns', 7),
('Roman', 'Ruecker', 7),
('Nikko', 'Luettgen', 7),
('Arely', 'Trantow', 7),
('Darren', 'Sauer', 8),
('Leonora', 'Feest', 8),
('Verlie', 'McClure', 8),
('Nona', 'Bednar', 8),
('Glenna', 'Bruen', 8),
('Hoyt', 'Sauer', 8),
('Gunnar', 'Bailey', 8),
('Clementina', 'Lesch', 8),
('Albin', 'Schuppe', 8),
('Theron', 'Schmitt', 8),
('Marietta', 'Kihn', 8),
('Harold', 'Klocko', 8),
('Frederique', 'Gleason', 8),
('Dillan', 'Rutherford', 8),
('Nona', 'Franecki', 8),
('Virginie', 'Considine', 8),
('Desiree', 'Botsford', 8),
('Julie', 'Kassulke', 8),
('Madisen', 'Turcotte', 8),
('Jeremy', 'Collins', 8),
('Wendy', 'Toy', 9),
('Destinee', 'Ruecker', 9),
('Eugene', 'Kautzer', 9),
('Chanel', 'Hand', 9),
('Laurine', 'Blanda', 9),
('Jimmie', 'Okuneva', 9),
('Don', 'Mayert', 9),
('Aubrey', 'Abbott', 9),
('Dwight', 'Stracke', 9),
('Demond', 'Spinka', 9),
('Petra', 'Abbott', 9),
('Libby', 'Green', 9),
('Jettie', 'Bernhard', 9),
('Earlene', 'Spinka', 9),
('Floyd', 'Rodriguez', 9),
('Vernie', 'Gorczany', 9),
('Iliana', 'Herman', 9),
('Cassandre', 'Senger', 9),
('Arnaldo', 'Rolfson', 9),
('Dejuan', 'Friesen', 9),
('Ryley', 'Mueller', 10),
('Abigayle', 'Ullrich', 10),
('Geovanny', 'Kuvalis', 10),
('Ottilie', 'Bogisich', 10),
('Jordane', 'Gottlieb', 10),
('Carleton', 'Dooley', 10),
('Marco', 'Bechtelar', 10),
('Arianna', 'Dooley', 10),
('Mose', 'Kuvalis', 10),
('Winona', 'Gusikowski', 10),
('Rashawn', 'Hudson', 10),
('Marguerite', 'Schmitt', 10),
('Baron', 'Kling', 10),
('Anabelle', 'Trantow', 10),
('Hershel', 'Hahn', 10),
('Maybelle', 'Reichel', 10),
('Roxanne', 'Balistreri', 10),
('Hilbert', 'Rowe', 10),
('Sophie', 'Barton', 10),
('Meda', 'Cruickshank', 10),
('Elna', 'Huel', 11),
('Tania', 'Ledner', 11),
('Ellie', 'Block', 11),
('Marian', 'Hilll', 11),
('Judah', 'Ullrich', 11),
('Emery', 'Lind', 11),
('Percival', 'Kreiger', 11),
('Nathaniel', 'Sanford', 11),
('Kyler', 'Harber', 11),
('Hilbert', 'Jacobs', 11),
('Merle', 'Schuppe', 11),
('Marjorie', 'Ziemann', 11),
('Carter', 'Raynor', 11),
('Toni', 'Hessel', 11),
('Maya', 'Lemke', 11),
('Juliet', 'Hilpert', 11),
('Jordy', 'Swift', 11),
('Garett', 'Wuckert', 11),
('Rosanna', 'Zemlak', 11),
('Melvin', 'Hilpert', 11),
('Stanley', 'Dare', 12),
('Amparo', 'Maggio', 12),
('George', 'Crona', 12),
('Alberto', 'Gaylord', 12),
('Lolita', 'Hilll', 12),
('Darius', 'Morar', 12),
('Tyler', 'Nicolas', 12),
('Valerie', 'King', 12),
('Cierra', 'Moore', 12),
('Cloyd', 'Hoppe', 12),
('Berenice', 'Hane', 12),
('Joshuah', 'Ritchie', 12),
('Pauline', 'Moen', 12),
('Mozell', 'Runolfsdottir', 12),
('Janice', 'Little', 12),
('Ally', 'Hilpert', 12),
('Genoveva', 'Rempel', 12),
('Dewitt', 'Rodriguez', 12),
('Moses', 'Heidenreich', 12),
('Claire', 'Feest', 12),
('Susan', 'Lindgren', 13),
('Alyson', 'Donnelly', 13),
('Zola', 'Fadel', 13),
('Marlon', 'Greenfelder', 13),
('Royal', 'Yost', 13),
('Toby', 'Hackett', 13),
('Carol', 'Osinski', 13),
('Walter', 'Hammes', 13),
('Ross', 'Bashirian', 13),
('Chad', 'Hessel', 13),
('Joshua', 'Schmitt', 13),
('Samson', 'Halvorson', 13),
('Justina', 'Tromp', 13),
('Coleman', 'West', 13),
('Kaela', 'Jacobi', 13),
('Victor', 'Lowe', 13),
('Toy', 'Mann', 13),
('Jazlyn', 'Moore', 13),
('Santiago', 'Pagac', 13),
('Roma', 'Homenick', 13),
('Curt', 'Frami', 14),
('Corbin', 'McGlynn', 14),
('Jalyn', 'Hegmann', 14),
('Vivienne', 'Stamm', 14),
('Van', 'Jakubowski', 14),
('Jairo', 'Weber', 14),
('Mertie', 'Koelpin', 14),
('Floyd', 'Tremblay', 14),
('Aidan', 'Wilkinson', 14),
('Korey', 'Bechtelar', 14),
('Stefanie', 'White', 14),
('Lincoln', 'OConnell', 14),
('Erica', 'Schuppe', 14),
('Jeramy', 'Roob', 14),
('Cheyenne', 'Schumm', 14),
('Romaine', 'Hammes', 14),
('Stephon', 'Fisher', 14),
('Derrick', 'Robel', 14),
('Nigel', 'Olson', 14),
('Mazie', 'Mitchell', 14);

INSERT INTO Goals (player_id, game_id, goals) VALUES
(1, 10, 2),
(2, 6, 2),
(3, 8, 2),
(4, 4, 1),
(5, 3, 1),
(6, 5, 1),
(7, 12, 3),
(8, 3, 3),
(9, 1, 3),
(10, 1, 0),
(11, 0, 1),
(12, 0, 1),
(13, 12, 2),
(14, 5, 2),
(15, 8, 2),
(16, 6, 1),
(17, 4, 3),
(18, 6, 3),
(19, 6, 3),
(20, 9, 2),
(21, 7, 2),
(22, 8, 1),
(23, 11, 1),
(24, 3, 2),
(25, 11, 0),
(26, 2, 0),
(27, 2, 1),
(28, 2, 3),
(29, 7, 2),
(30, 12, 3),
(31, 13, 2),
(32, 12, 1),
(33, 3, 2),
(34, 10, 3),
(35, 10, 1),
(36, 1, 1),
(37, 5, 1),
(38, 12, 1),
(39, 7, 0),
(40, 13, 2),
(41, 7, 1),
(42, 7, 1),
(43, 11, 2),
(44, 13, 0),
(45, 4, 1),
(46, 2, 0),
(47, 6, 0),
(48, 1, 3),
(49, 1, 0),
(50, 8, 2),
(51, 13, 2),
(52, 7, 2),
(53, 7, 0),
(54, 8, 0),
(55, 2, 2),
(56, 6, 2),
(57, 9, 2),
(58, 3, 1),
(59, 1, 2),
(60, 8, 2),
(61, 12, 2),
(62, 7, 1),
(63, 13, 2),
(64, 7, 0),
(65, 13, 2),
(66, 9, 2),
(67, 2, 1),
(68, 4, 3),
(69, 4, 2),
(70, 4, 2),
(71, 3, 1),
(72, 6, 2),
(73, 1, 0),
(74, 5, 0),
(75, 12, 1),
(76, 12, 1),
(77, 3, 1),
(78, 12, 3),
(79, 10, 0),
(80, 2, 2),
(81, 10, 0),
(82, 7, 2),
(83, 11, 0),
(84, 4, 3),
(85, 10, 1),
(86, 6, 0),
(87, 7, 1),
(88, 7, 2),
(89, 7, 1),
(90, 6, 2),
(91, 4, 1),
(92, 11, 3),
(93, 5, 0),
(94, 4, 3),
(95, 6, 3),
(96, 11, 1),
(97, 1, 1),
(98, 3, 2),
(99, 2, 1),
(100, 1, 2),
(101, 12, 1),
(102, 9, 0),
(103, 11, 1),
(104, 3, 2),
(105, 12, 1),
(106, 0, 1),
(107, 10, 1),
(108, 8, 1),
(109, 7, 1),
(110, 1, 0),
(111, 7, 3),
(112, 10, 3),
(113, 9, 0),
(114, 11, 2),
(115, 4, 3),
(116, 8, 3),
(117, 0, 2),
(118, 12, 3),
(119, 10, 0),
(120, 3, 0),
(121, 1, 0),
(122, 11, 2),
(123, 12, 2),
(124, 5, 3),
(125, 6, 2),
(126, 9, 0),
(127, 11, 0),
(128, 11, 2),
(129, 1, 3),
(130, 13, 2),
(131, 11, 2),
(132, 5, 3),
(133, 9, 2),
(134, 9, 0),
(135, 3, 2),
(136, 9, 1),
(137, 5, 0),
(138, 3, 0),
(139, 11, 1),
(140, 5, 3),
(141, 8, 2),
(142, 0, 1),
(143, 10, 2),
(144, 5, 3),
(145, 11, 1),
(146, 1, 1),
(147, 4, 1),
(148, 3, 1),
(149, 1, 2),
(150, 10, 2),
(151, 9, 0),
(152, 10, 2),
(153, 8, 3),
(154, 6, 1),
(155, 7, 1),
(156, 11, 0),
(157, 3, 0),
(158, 11, 2),
(159, 9, 1),
(160, 7, 1),
(161, 4, 0),
(162, 2, 0),
(163, 10, 1),
(164, 4, 0),
(165, 4, 2),
(166, 11, 2),
(167, 3, 1),
(168, 12, 1),
(169, 0, 2),
(170, 4, 1),
(171, 10, 3),
(172, 10, 2),
(173, 7, 1),
(174, 2, 1),
(175, 9, 0),
(176, 2, 0),
(177, 6, 2),
(178, 6, 1),
(179, 6, 1),
(180, 11, 3),
(181, 9, 2),
(182, 2, 2),
(183, 12, 2),
(184, 9, 3),
(185, 1, 1),
(186, 11, 2),
(187, 1, 1),
(188, 12, 2),
(189, 5, 1),
(190, 12, 1),
(191, 11, 1),
(192, 4, 3),
(193, 12, 3),
(194, 13, 2),
(195, 9, 2),
(196, 11, 2),
(197, 4, 1),
(198, 9, 2),
(199, 9, 1),
(200, 3, 1),
(201, 1, 1),
(202, 10, 1),
(203, 12, 3),
(204, 2, 2),
(205, 1, 2),
(206, 8, 2),
(207, 9, 1),
(208, 8, 2),
(209, 5, 1),
(210, 8, 0),
(211, 5, 2),
(212, 2, 3),
(213, 5, 3),
(214, 5, 1),
(215, 1, 1),
(216, 7, 1),
(217, 7, 3),
(218, 10, 2),
(219, 1, 2),
(220, 12, 1),
(221, 11, 3),
(222, 9, 0),
(223, 10, 3),
(224, 2, 2),
(225, 1, 2),
(226, 6, 3),
(227, 8, 0),
(228, 8, 0),
(229, 9, 1),
(230, 10, 1),
(231, 4, 1),
(232, 8, 1),
(233, 12, 2),
(234, 4, 2),
(235, 8, 1),
(236, 1, 1),
(237, 11, 0),
(238, 1, 3),
(239, 6, 2),
(240, 2, 1),
(241, 12, 1),
(242, 12, 3),
(243, 6, 1),
(244, 13, 2),
(245, 3, 1),
(246, 3, 2),
(247, 1, 1),
(248, 9, 1),
(249, 11, 1),
(250, 3, 1),
(251, 8, 0),
(252, 8, 1),
(253, 7, 2),
(254, 5, 3),
(255, 11, 1),
(256, 11, 1),
(257, 9, 0),
(258, 3, 2),
(259, 8, 2),
(260, 7, 2),
(261, 11, 0),
(262, 1, 2),
(263, 2, 1),
(264, 4, 2),
(265, 1, 3),
(266, 3, 2),
(267, 9, 2),
(268, 11, 2),
(269, 9, 0),
(270, 1, 1),
(271, 13, 3),
(272, 13, 1),
(273, 7, 2),
(274, 4, 2),
(275, 2, 3),
(276, 8, 1),
(277, 2, 2),
(278, 10, 1),
(279, 10, 3),
(280, 5, 1);

INSERT INTO Bets (user_id, team_1_goals, team_2_goals, game_id) VALUES
(1, 1, 2, 1),
(1, 0, 1, 2),
(1, 4, 3, 3),
(1, 0, 1, 4),
(1, 2, 4, 5),
(1, 1, 0, 6),
(1, 2, 2, 7),
(1, 2, 2, 8),
(1, 3, 1, 9),
(1, 1, 0, 10),
(1, 4, 4, 11),
(1, 1, 1, 12),
(1, 3, 2, 13),
(2, 0, 2, 1),
(2, 4, 3, 2),
(2, 1, 4, 3),
(2, 2, 2, 4),
(2, 1, 4, 5),
(2, 4, 4, 6),
(2, 1, 3, 7),
(2, 0, 3, 8),
(2, 1, 1, 9),
(2, 1, 3, 10),
(2, 2, 2, 11),
(2, 2, 2, 12),
(2, 2, 1, 13),
(3, 2, 3, 1),
(3, 3, 2, 2),
(3, 2, 1, 3),
(3, 2, 4, 4),
(3, 1, 1, 5),
(3, 3, 3, 6),
(3, 3, 3, 7),
(3, 0, 1, 8),
(3, 3, 0, 9),
(3, 0, 3, 10),
(3, 3, 1, 11),
(3, 3, 3, 12),
(3, 1, 4, 13),
(4, 2, 3, 1),
(4, 2, 1, 2),
(4, 3, 3, 3),
(4, 1, 2, 4),
(4, 0, 2, 5),
(4, 1, 2, 6),
(4, 3, 3, 7),
(4, 1, 3, 8),
(4, 4, 2, 9),
(4, 0, 2, 10),
(4, 4, 3, 11),
(4, 0, 3, 12),
(4, 3, 1, 13),
(5, 2, 2, 1),
(5, 2, 1, 2),
(5, 0, 1, 3),
(5, 3, 1, 4),
(5, 1, 3, 5),
(5, 3, 1, 6),
(5, 4, 2, 7),
(5, 1, 0, 8),
(5, 4, 1, 9),
(5, 2, 2, 10),
(5, 3, 4, 11),
(5, 0, 3, 12),
(5, 2, 1, 13),
(6, 2, 2, 1),
(6, 4, 2, 2),
(6, 0, 1, 3),
(6, 3, 3, 4),
(6, 4, 1, 5),
(6, 3, 2, 6),
(6, 3, 2, 7),
(6, 2, 1, 8),
(6, 4, 4, 9),
(6, 4, 0, 10),
(6, 4, 1, 11),
(6, 2, 3, 12),
(6, 1, 2, 13),
(7, 3, 0, 1),
(7, 1, 4, 2),
(7, 4, 1, 3),
(7, 0, 3, 4),
(7, 1, 1, 5),
(7, 2, 0, 6),
(7, 0, 4, 7),
(7, 0, 3, 8),
(7, 3, 2, 9),
(7, 1, 4, 10),
(7, 2, 0, 11),
(7, 2, 3, 12),
(7, 3, 3, 13),
(8, 3, 2, 1),
(8, 3, 1, 2),
(8, 2, 4, 3),
(8, 1, 0, 4),
(8, 2, 0, 5),
(8, 2, 2, 6),
(8, 2, 1, 7),
(8, 1, 1, 8),
(8, 0, 2, 9),
(8, 3, 2, 10),
(8, 1, 3, 11),
(8, 3, 0, 12),
(8, 0, 4, 13),
(9, 1, 2, 1),
(9, 1, 4, 2),
(9, 2, 3, 3),
(9, 3, 3, 4),
(9, 0, 1, 5),
(9, 1, 2, 6),
(9, 3, 1, 7),
(9, 1, 4, 8),
(9, 1, 3, 9),
(9, 1, 4, 10),
(9, 1, 4, 11),
(9, 1, 3, 12),
(9, 1, 3, 13),
(10, 2, 2, 1),
(10, 1, 4, 2),
(10, 1, 0, 3),
(10, 2, 2, 4),
(10, 1, 1, 5),
(10, 1, 3, 6),
(10, 2, 3, 7),
(10, 2, 2, 8),
(10, 4, 0, 9),
(10, 2, 0, 10),
(10, 2, 1, 11),
(10, 1, 1, 12),
(10, 4, 4, 13),
(11, 2, 3, 1),
(11, 1, 3, 2),
(11, 0, 2, 3),
(11, 2, 2, 4),
(11, 3, 0, 5),
(11, 2, 1, 6),
(11, 0, 3, 7),
(11, 2, 3, 8),
(11, 0, 2, 9),
(11, 2, 1, 10),
(11, 4, 2, 11),
(11, 1, 2, 12),
(11, 4, 4, 13),
(12, 3, 2, 1),
(12, 2, 1, 2),
(12, 0, 2, 3),
(12, 1, 1, 4),
(12, 0, 3, 5),
(12, 2, 3, 6),
(12, 1, 4, 7),
(12, 3, 4, 8),
(12, 0, 1, 9),
(12, 1, 2, 10),
(12, 2, 2, 11),
(12, 1, 1, 12),
(12, 3, 4, 13),
(13, 1, 2, 1),
(13, 4, 2, 2),
(13, 2, 3, 3),
(13, 1, 1, 4),
(13, 4, 0, 5),
(13, 2, 2, 6),
(13, 0, 3, 7),
(13, 2, 2, 8),
(13, 1, 3, 9),
(13, 0, 0, 10),
(13, 1, 3, 11),
(13, 1, 3, 12),
(13, 2, 1, 13),
(14, 2, 1, 1),
(14, 3, 3, 2),
(14, 0, 1, 3),
(14, 4, 2, 4),
(14, 0, 1, 5),
(14, 2, 1, 6),
(14, 4, 2, 7),
(14, 2, 2, 8),
(14, 4, 1, 9),
(14, 4, 4, 10),
(14, 1, 2, 11),
(14, 1, 1, 12),
(14, 3, 4, 13),
(15, 0, 3, 1),
(15, 1, 3, 2),
(15, 1, 0, 3),
(15, 2, 1, 4),
(15, 3, 2, 5),
(15, 2, 1, 6),
(15, 0, 1, 7),
(15, 4, 2, 8),
(15, 0, 0, 9),
(15, 3, 2, 10),
(15, 3, 4, 11),
(15, 4, 0, 12),
(15, 2, 0, 13),
(16, 1, 2, 1),
(16, 4, 1, 2),
(16, 0, 3, 3),
(16, 3, 1, 4),
(16, 1, 4, 5),
(16, 3, 2, 6),
(16, 1, 1, 7),
(16, 4, 1, 8),
(16, 3, 2, 9),
(16, 4, 1, 10),
(16, 2, 2, 11),
(16, 3, 1, 12),
(16, 4, 1, 13),
(17, 0, 1, 1),
(17, 2, 3, 2),
(17, 3, 4, 3),
(17, 1, 0, 4),
(17, 3, 4, 5),
(17, 0, 4, 6),
(17, 0, 3, 7),
(17, 3, 2, 8),
(17, 1, 4, 9),
(17, 1, 2, 10),
(17, 1, 2, 11),
(17, 1, 2, 12),
(17, 3, 0, 13),
(18, 1, 2, 1),
(18, 2, 0, 2),
(18, 2, 2, 3),
(18, 0, 3, 4),
(18, 1, 4, 5),
(18, 3, 2, 6),
(18, 2, 4, 7),
(18, 2, 3, 8),
(18, 3, 2, 9),
(18, 3, 1, 10),
(18, 2, 2, 11),
(18, 3, 3, 12),
(18, 4, 4, 13),
(19, 2, 3, 1),
(19, 1, 3, 2),
(19, 2, 4, 3),
(19, 2, 2, 4),
(19, 3, 4, 5),
(19, 0, 2, 6),
(19, 0, 4, 7),
(19, 2, 1, 8),
(19, 3, 0, 9),
(19, 2, 3, 10),
(19, 2, 1, 11),
(19, 3, 0, 12),
(19, 4, 2, 13),
(20, 1, 1, 1),
(20, 1, 2, 2),
(20, 1, 3, 3),
(20, 0, 3, 4),
(20, 0, 4, 5),
(20, 2, 3, 6),
(20, 0, 3, 7),
(20, 4, 2, 8),
(20, 2, 2, 9),
(20, 2, 3, 10),
(20, 2, 4, 11),
(20, 2, 2, 12),
(20, 1, 3, 13);

INSERT INTO Results (team_1_goals, team_2_goals, game_id) VALUES
(2, 3, 1),
(3, 4, 2),
(0, 2, 3),
(3, 0, 4),
(2, 2, 5),
(4, 0, 6),
(2, 2, 7),
(1, 1, 8),
(1, 0, 9),
(3, 4, 10),
(3, 4, 11),
(1, 2, 12),
(2, 2, 13);

INSERT INTO Points (points, game_id, user_id) VALUES
(1, 1, 1),
(1, 2, 1),
(0, 3, 1),
(0, 4, 1),
(0, 5, 1),
(1, 6, 1),
(4, 7, 1),
(1, 8, 1),
(1, 9, 1),
(0, 10, 1),
(0, 11, 1),
(0, 12, 1),
(1, 13, 1),
(1, 1, 2),
(0, 2, 2),
(1, 3, 2),
(1, 4, 2),
(0, 5, 2),
(1, 6, 2),
(0, 7, 2),
(0, 8, 2),
(1, 9, 2),
(1, 10, 2),
(0, 11, 2),
(0, 12, 2),
(1, 13, 2),
(4, 1, 3),
(0, 2, 3),
(0, 3, 3),
(0, 4, 3),
(1, 5, 3),
(1, 6, 3),
(1, 7, 3),
(0, 8, 3),
(1, 9, 3),
(1, 10, 3),
(0, 11, 3),
(0, 12, 3),
(0, 13, 3),
(4, 1, 4),
(0, 2, 4),
(0, 3, 4),
(0, 4, 4),
(0, 5, 4),
(0, 6, 4),
(1, 7, 4),
(0, 8, 4),
(1, 9, 4),
(1, 10, 4),
(0, 11, 4),
(1, 12, 4),
(1, 13, 4),
(0, 1, 5),
(0, 2, 5),
(1, 3, 5),
(1, 4, 5),
(0, 5, 5),
(1, 6, 5),
(1, 7, 5),
(1, 8, 5),
(1, 9, 5),
(0, 10, 5),
(4, 11, 5),
(1, 12, 5),
(1, 13, 5),
(0, 1, 6),
(0, 2, 6),
(1, 3, 6),
(1, 4, 6),
(1, 5, 6),
(1, 6, 6),
(1, 7, 6),
(1, 8, 6),
(1, 9, 6),
(0, 10, 6),
(0, 11, 6),
(1, 12, 6),
(0, 13, 6),
(0, 1, 7),
(1, 2, 7),
(0, 3, 7),
(0, 4, 7),
(1, 5, 7),
(1, 6, 7),
(0, 7, 7),
(0, 8, 7),
(1, 9, 7),
(1, 10, 7),
(0, 11, 7),
(1, 12, 7),
(1, 13, 7),
(0, 1, 8),
(0, 2, 8),
(1, 3, 8),
(1, 4, 8),
(1, 5, 8),
(1, 6, 8),
(1, 7, 8),
(4, 8, 8),
(0, 9, 8),
(0, 10, 8),
(1, 11, 8),
(0, 12, 8),
(0, 13, 8),
(1, 1, 9),
(1, 2, 9),
(1, 3, 9),
(1, 4, 9),
(0, 5, 9),
(0, 6, 9),
(1, 7, 9),
(0, 8, 9),
(0, 9, 9),
(1, 10, 9),
(1, 11, 9),
(1, 12, 9),
(0, 13, 9),
(0, 1, 10),
(1, 2, 10),
(0, 3, 10),
(1, 4, 10),
(1, 5, 10),
(0, 6, 10),
(0, 7, 10),
(1, 8, 10),
(1, 9, 10),
(0, 10, 10),
(0, 11, 10),
(0, 12, 10),
(1, 13, 10),
(4, 1, 11),
(1, 2, 11),
(4, 3, 11),
(1, 4, 11),
(1, 5, 11),
(1, 6, 11),
(0, 7, 11),
(0, 8, 11),
(0, 9, 11),
(0, 10, 11),
(0, 11, 11),
(4, 12, 11),
(1, 13, 11),
(0, 1, 12),
(0, 2, 12),
(4, 3, 12),
(1, 4, 12),
(0, 5, 12),
(0, 6, 12),
(0, 7, 12),
(0, 8, 12),
(0, 9, 12),
(1, 10, 12),
(0, 11, 12),
(0, 12, 12),
(0, 13, 12),
(1, 1, 13),
(0, 2, 13),
(1, 3, 13),
(1, 4, 13),
(1, 5, 13),
(1, 6, 13),
(0, 7, 13),
(1, 8, 13),
(0, 9, 13),
(0, 10, 13),
(1, 11, 13),
(1, 12, 13),
(1, 13, 13),
(0, 1, 14),
(0, 2, 14),
(1, 3, 14),
(1, 4, 14),
(0, 5, 14),
(1, 6, 14),
(1, 7, 14),
(1, 8, 14),
(1, 9, 14),
(0, 10, 14),
(1, 11, 14),
(0, 12, 14),
(0, 13, 14),
(1, 1, 15),
(1, 2, 15),
(0, 3, 15),
(1, 4, 15),
(1, 5, 15),
(1, 6, 15),
(0, 7, 15),
(1, 8, 15),
(1, 9, 15),
(0, 10, 15),
(4, 11, 15),
(0, 12, 15),
(1, 13, 15),
(1, 1, 16),
(0, 2, 16),
(1, 3, 16),
(1, 4, 16),
(0, 5, 16),
(1, 6, 16),
(1, 7, 16),
(1, 8, 16),
(1, 9, 16),
(0, 10, 16),
(0, 11, 16),
(0, 12, 16),
(1, 13, 16),
(1, 1, 17),
(1, 2, 17),
(1, 3, 17),
(1, 4, 17),
(0, 5, 17),
(0, 6, 17),
(0, 7, 17),
(1, 8, 17),
(0, 9, 17),
(1, 10, 17),
(1, 11, 17),
(4, 12, 17),
(1, 13, 17),
(1, 1, 18),
(0, 2, 18),
(0, 3, 18),
(0, 4, 18),
(0, 5, 18),
(1, 6, 18),
(0, 7, 18),
(0, 8, 18),
(1, 9, 18),
(0, 10, 18),
(0, 11, 18),
(0, 12, 18),
(1, 13, 18),
(4, 1, 19),
(1, 2, 19),
(1, 3, 19),
(1, 4, 19),
(0, 5, 19),
(0, 6, 19),
(0, 7, 19),
(1, 8, 19),
(1, 9, 19),
(1, 10, 19),
(0, 11, 19),
(0, 12, 19),
(1, 13, 19),
(0, 1, 20),
(1, 2, 20),
(1, 3, 20),
(0, 4, 20),
(0, 5, 20),
(0, 6, 20),
(0, 7, 20),
(1, 8, 20),
(1, 9, 20),
(1, 10, 20),
(1, 11, 20),
(0, 12, 20),
(0, 13, 20);
