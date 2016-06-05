from rest_framework import serializers

from .models import User, Bet, Game, Round, Team, Player, Group, SpecialBet, \
                    Goal, SpecialBetResult, Result, Point, Tournament

# User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'firstname', 'lastname', 'email')

# Tournament
class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ('id', 'name', 'color', 'start_date', 'stop_date')

# Team
class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ('id', 'name', 'country')

# Result
class ResultSerializer(serializers.ModelSerializer):
    # game = serializers.PrimaryKeyRelatedField(read_only=True)
    # game = GameSerializer(read_only=True)

    class Meta:
        model = Result
        fields = ('id', 'game', 'team_1_goals', 'team_2_goals', 'created_at')
        # fields = ('id', 'result', 'team_1_goals', 'team_2_goals', 'created_at')

# Game
class GameSerializer(serializers.ModelSerializer):
    # team_1 = serializers.PrimaryKeyRelatedField(read_only=True)
    # team_2 = serializers.PrimaryKeyRelatedField(read_only=True)
    # round = serializers.PrimaryKeyRelatedField(read_only=True)
    # round = RoundSerializer(read_only=True)
    team_1 = TeamSerializer(read_only=True)
    team_2 = TeamSerializer(read_only=True)
    result = ResultSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ('id', 'team_1', 'team_2', 'round',
                  'group_name', 'start_date', 'stop_date', 'result')

# Round
class RoundSerializer(serializers.ModelSerializer):
    # tournament = serializers.PrimaryKeyRelatedField(read_only=True)
    tournament = TournamentSerializer(read_only=True)
    games = GameSerializer(many=True, read_only=True)

    class Meta:
        model = Round
        fields = ('id', 'name', 'tournament',
                  'start_date', 'stop_date', 'games')
# Bet
class BetSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    game = GameSerializer(read_only=True)

    class Meta:
        model = Bet
        fields = ('id', 'user', 'game', 'team_1_bet',
                  'team_2_bet', 'created_at')

# Player
class PlayerSerializer(serializers.ModelSerializer):
    # team = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    teams = TeamSerializer(many=True, read_only=True)

    class Meta:
        model = Player
        fields = ('id', 'firstname', 'lastname', 'teams')

# Group
class GroupSerializer(serializers.ModelSerializer):
    # admin = serializers.PrimaryKeyRelatedField(read_only=True)
    # users = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
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

# SpecialBet
class SpecialBetSerializer(serializers.ModelSerializer):
    # user = serializers.PrimaryKeyRelatedField(read_only=True)
    # player = serializers.PrimaryKeyRelatedField(read_only=True)
    # team = serializers.PrimaryKeyRelatedField(read_only=True)
    # tournament = serializers.PrimaryKeyRelatedField(read_only=True)
    user = UserSerializer(read_only=True)
    player = PlayerSerializer(read_only=True)
    team = TeamSerializer(read_only=True)
    tournament = TournamentSerializer(read_only=True)

    class Meta:
        model = SpecialBet
        fields = ('id', 'user', 'player', 'player_goals', 'team', 'tournament')

# Goal
class GoalSerializer(serializers.ModelSerializer):
    # player = serializers.PrimaryKeyRelatedField(read_only=True)
    # game = serializers.PrimaryKeyRelatedField(read_only=True)
    player = PlayerSerializer(read_only=True)
    game = GameSerializer(read_only=True)

    class Meta:
        model = Goal
        fields = ('id', 'player', 'game', 'goals')

# Point
class PointSerializer(serializers.ModelSerializer):
    # user = serializers.PrimaryKeyRelatedField(read_only=True)
    # game = serializers.PrimaryKeyRelatedField(read_only=True)
    user = UserSerializer(read_only=True)
    result = ResultSerializer(read_only=True)
    # game = GameSerializer(read_only=True)

    class Meta:
        model = Point
        fields = ('id', 'user', 'points', 'result')
        # fields = ('id', 'user', 'points', 'game')

# Special Bet Result
class SpecialBetResultSerializer(serializers.ModelSerializer):
    # user = serializers.PrimaryKeyRelatedField(read_only=True)
    # player = serializers.PrimaryKeyRelatedField(read_only=True)
    # team = serializers.PrimaryKeyRelatedField(read_only=True)
    # tournament = serializers.PrimaryKeyRelatedField(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = SpecialBetResult
        fields = ('id', 'user', 'player', 'goals',
                  'team', 'tournament', 'created_at')

