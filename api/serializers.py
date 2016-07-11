from rest_framework import serializers

from .models import User, Bet, Game, Round, Team, Player, Group, SpecialBet, \
                    Goal, SpecialBetResult, Result, Point, Tournament, \
                    SpecialBetFinal


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for users
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'firstname', 'lastname', 'email')


class TournamentSerializer(serializers.ModelSerializer):
    """
    Serializer for tournaments
    """
    class Meta:
        model = Tournament
        fields = ('id', 'name', 'color', 'start_date', 'stop_date')


class TeamSerializer(serializers.ModelSerializer):
    """
    Serializer for teams
    """
    class Meta:
        model = Team
        fields = ('id', 'name', 'country')


class ResultSerializer(serializers.ModelSerializer):
    """
    Serializer for results
    """
    class Meta:
        model = Result
        fields = ('id', 'game', 'team_1_goals', 'team_2_goals', 'created_at')


class GameSerializer(serializers.ModelSerializer):
    """
    Serializer for games
    """
    team_1 = TeamSerializer(read_only=True)
    team_2 = TeamSerializer(read_only=True)
    result = ResultSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ('id', 'team_1', 'team_2', 'round',
                  'group_name', 'start_date', 'stop_date', 'result')


class RoundSerializer(serializers.ModelSerializer):
    """
    Serializer for rounds
    """
    tournament = TournamentSerializer(read_only=True)
    games = GameSerializer(many=True, read_only=True)

    class Meta:
        model = Round
        fields = ('id', 'name', 'tournament',
                  'start_date', 'stop_date', 'games')


class BetSerializer(serializers.ModelSerializer):
    """
    Serializer for bets
    """
    user = UserSerializer(read_only=True)
    game = GameSerializer(read_only=True)

    class Meta:
        model = Bet
        fields = ('id', 'user', 'game', 'team_1_bet',
                  'team_2_bet', 'created_at')


class PlayerSerializer(serializers.ModelSerializer):
    """
    Serializer for players
    """
    teams = TeamSerializer(many=True, read_only=True)

    class Meta:
        model = Player
        fields = ('id', 'firstname', 'lastname', 'teams')


class GroupSerializer(serializers.ModelSerializer):
    """
    Serializer for groups
    """
    admin = UserSerializer(read_only=True)
    users = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ('id', 'admin', 'users', 'name', 'description', 'color')

    def create(self, validated_data):
        users_data = validated_data.pop('users')
        group = Group.objects.create(**validated_data)
        for user in users_data:
            group.users.add(user)
        return group


class SpecialBetSerializer(serializers.ModelSerializer):
    """
    Serializer for special bets
    """
    user = UserSerializer(read_only=True)
    player = PlayerSerializer(read_only=True)
    team = TeamSerializer(read_only=True)
    tournament = TournamentSerializer(read_only=True)

    class Meta:
        model = SpecialBet
        fields = ('id', 'user', 'player', 'player_goals', 'team', 'tournament')


class GoalSerializer(serializers.ModelSerializer):
    """
    Serializer for goals
    """
    player = PlayerSerializer(read_only=True)
    game = GameSerializer(read_only=True)

    class Meta:
        model = Goal
        fields = ('id', 'player', 'game', 'goals')


class PointSerializer(serializers.ModelSerializer):
    """
    Serializer for points
    """
    user = UserSerializer(read_only=True)
    result = ResultSerializer(read_only=True)

    class Meta:
        model = Point
        fields = ('id', 'user', 'points', 'result')


class SpecialBetResultSerializer(serializers.ModelSerializer):
    """
    Serializer for special bet results
    """
    user = UserSerializer(read_only=True)

    class Meta:
        model = SpecialBetResult
        fields = ('id', 'user', 'player', 'goals',
                  'team', 'tournament', 'created_at')


class SpecialBetFinalSerializer(serializers.ModelSerializer):
    """
    Serializer for special bet (final results)
    """
    class Meta:
        model = SpecialBetFinal
        fields = ('id', 'tournament', 'player', 'goals', 'team', 'created_at')

class Top10BetsSerializer(serializers.ModelSerializer):
    """
    Serializer for top 10 of 10-pts bets
    """
    top_bet_count = serializers.IntegerField()

    class Meta:
        model = User
        fields = ('id', 'username', 'top_bet_count')


class Top10PointsSerializer(serializers.ModelSerializer):
    """
    Serializer for top 10 total points for users
    """
    sum_points = serializers.IntegerField()
    sum_special_bets = serializers.IntegerField()
    total_points = serializers.IntegerField()

    class Meta:
        model = User
        fields = ('id', 'username', 'sum_points', 'sum_special_bets',
                  'total_points')


class Top10MembersSerializer(serializers.ModelSerializer):
    """
    Serializer for top 10 group member count
    """
    member_count = serializers.IntegerField()

    class Meta:
        model = Group
        fields = ('id', 'name', 'member_count')


class Top10AverageSerializer(serializers.ModelSerializer):
    """
    Serializer for top 10 average points from groups (users)
    """
    member_count = serializers.IntegerField()
    sum_points = serializers.IntegerField()
    sum_special_bets = serializers.IntegerField()
    average = serializers.IntegerField()

    class Meta:
        model = Group
        fields = ('id', 'name', 'member_count', 'sum_points',
                  'sum_special_bets', 'average')


class UserOverviewSerializer(serializers.ModelSerializer):
    """
    Serializer for a short summary of user info
    """
    sum_points = serializers.IntegerField()
    sum_special_bets = serializers.IntegerField()
    total_points = serializers.IntegerField()
    country = serializers.CharField()

    class Meta:
        model = User
        fields = ('id', 'username', 'sum_points', 'sum_special_bets',
                  'total_points', 'country')


class GroupOverviewSerializer(serializers.ModelSerializer):
    """
    Serializer for groups of users with a short summary
    """
    users = UserOverviewSerializer(many=True, read_only=True)
    admin = serializers.IntegerField()

    class Meta:
        model = Group
        fields = ('id', 'name', 'description', 'users', 'admin')
