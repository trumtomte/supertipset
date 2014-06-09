--                             --
-- SUPERTIPSET DATABASE SCHEMA --
-- --------------------------- --

--
-- Users table
--
CREATE TABLE Users (
    id          INT UNSIGNED AUTO_INCREMENT NOT NULL,
    username    VARCHAR(50) NOT NULL,
    password    VARCHAR(200) DEFAULT '' NOT NULL,
    firstname   VARCHAR(50) DEFAULT '' NOT NULL,
    lastname    VARCHAR(50) DEFAULT '' NOT NULL,
    email       VARCHAR(50) DEFAULT '' NOT NULL,
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
    PRIMARY KEY(id),
    UNIQUE KEY points_per_game (game_id, user_id)
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
    group_name  VARCHAR(20) NOT NULL,
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

