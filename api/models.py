from django.db import models

class User(models.Model):
    """
    Represents a user
    """
    username = models.CharField(max_length=50)
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    password = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} ({} {}, {})".format(self.username,
                                       self.firstname,
                                       self.lastname,
                                       self.email)

class Group(models.Model):
    """
    Represents user defined groups
    """
    admin = models.ForeignKey(User, related_name='admin')
    users = models.ManyToManyField(User, related_name='groups')
    name = models.CharField(max_length=50)
    password = models.CharField(max_length=100)
    description = models.TextField(default='')
    color = models.CharField(max_length=7, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Tournament(models.Model):
    """
    Represents a tournament of rounds and games
    """
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default='')
    start_date = models.DateTimeField()
    stop_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Round(models.Model):
    """
    Represents a round of games in a tournament
    """
    name = models.CharField(max_length=50)
    tournament = models.ForeignKey(Tournament)
    start_date = models.DateTimeField()
    stop_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} ({})".format(self.name, self.tournament.name)

class Team(models.Model):
    """
    Represents a team that participates in games
    """
    name = models.CharField(max_length=50)
    country = models.CharField(max_length=50, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Game(models.Model):
    """
    Represents a game between two teams
    """
    team_1 = models.ForeignKey(Team, related_name='team_1')
    team_2 = models.ForeignKey(Team, related_name='team_2')
    round = models.ForeignKey(Round, related_name='games')
    group_name = models.CharField(max_length=20, default='')
    start_date = models.DateTimeField()
    stop_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} {} - {} ({})".format(self.team_1.name,
                                        self.team_2.name,
                                        str(self.round),
                                        self.group_name)

class Player(models.Model):
    """
    Represents a player of a team
    """
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    teams = models.ManyToManyField(Team)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} {}".format(self.firstname, self.lastname)

class Bet(models.Model):
    """
    Represents a bet made by a user for a specific game
    """
    user = models.ForeignKey(User, related_name='bets',
                             on_delete=models.CASCADE)
    game = models.ForeignKey(Game)
    team_1_bet = models.IntegerField()
    team_2_bet = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} - {} av {} i matchen: {}".format(str(self.team_1_bet),
                                                    str(self.team_2_bet),
                                                    str(self.user),
                                                    str(self.game))

class SpecialBet(models.Model):
    """
    Represents a special bet made by a user for a specific tournament
    """
    user = models.ForeignKey(User, related_name='special_bets',
                             on_delete=models.CASCADE)
    player = models.ForeignKey(Player)
    player_goals = models.IntegerField()
    team = models.ForeignKey(Team)
    tournament = models.ForeignKey(Tournament)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} ({})".format(str(self.user), str(self.tournament))

class SpecialBetResult(models.Model):
    """
    Represents the results of special betting
    """
    user = models.ForeignKey(User, related_name='special_bet_results',
                             on_delete=models.CASCADE)
    player = models.IntegerField()
    goals = models.IntegerField()
    team = models.IntegerField()
    tournament = models.ForeignKey(Tournament)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "tournament")

    def __str__(self):
        return "{}s {}m {}l - {} ({})".format(str(self.player),
                                              str(self.goals),
                                              str(self.team),
                                              str(self.user),
                                              str(self.tournament))
class SpecialBetFinal(models.Model):
    """
    Represents the final results of a tournament
    """
    tournament = models.ForeignKey(Tournament)
    players = models.ManyToManyField(Player)
    goals = models.IntegerField()
    team = models.ForeignKey(Team)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.tournament.name


class Result(models.Model):
    """
    Represents the result of a played game
    """
    game = models.ForeignKey(Game, related_name='result')
    team_1_goals = models.IntegerField()
    team_2_goals = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} - {}, {}".format(self.team_1_goals,
                                    self.team_2_goals,
                                    str(self.game))

class Point(models.Model):
    """
    Represents points gained by a user betting on games
    """
    user = models.ForeignKey(User, related_name='points', null=True, blank=True,
                             on_delete=models.CASCADE)
    points = models.IntegerField()
    result = models.ForeignKey(Result)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "result")

    def __str__(self):
        return "{} till {} för matchen: {}".format(str(self.points),
                                                   str(self.user),
                                                   str(self.result.game))

class Goal(models.Model):
    """
    Represents a goal(s) made by a player from a team
    """
    player = models.ForeignKey(Player)
    game = models.ForeignKey(Game)
    goals = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} mål av {} i matchen: {}".format(self.goals,
                                                   str(self.player),
                                                   str(self.game))

# Import players from a CSV file
def import_players(filename):

    with open(filename, 'r') as f:
        players = f.read().split('\n')
    f.close()

    for player_row in players:
        if len(player_row) > 0:
            player, team = player_row.split(', ')
            names = player.split(' ')

            firstname = names.pop(0)
            lastname = ' '.join(names)

            t = Team.objects.get(country=team)
            p = Player(firstname=firstname, lastname=lastname)
            p.save()
            p.teams.add(t)
