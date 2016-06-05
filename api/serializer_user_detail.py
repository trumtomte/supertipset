from rest_framework import serializers

from .models import User, Bet, Game, Round, Group, SpecialBet, \
                    SpecialBetResult, Point

from .serializers import TeamSerializer, PlayerSerializer, ResultSerializer, \
                         UserSerializer, SpecialBetResultSerializer

from .serializer_group_detail import DetailGroupSerializer

# Round
class RoundSerializer(serializers.ModelSerializer):

    class Meta:
        model = Round
        fields = ('id', 'name', 'tournament', 'start_date', 'stop_date')

# Game
class GameSerializer(serializers.ModelSerializer):
    round = RoundSerializer(read_only=True)
    team_1 = TeamSerializer(read_only=True)
    team_2 = TeamSerializer(read_only=True)
    result = ResultSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ('id', 'team_1', 'team_2', 'round',
                  'group_name', 'start_date', 'stop_date', 'result')
# Bet
class BetSerializer(serializers.ModelSerializer):
    game = GameSerializer(read_only=True)

    class Meta:
        model = Bet
        fields = ('id', 'game', 'team_1_bet', 'team_2_bet', 'created_at')

# Point
class PointSerializer(serializers.ModelSerializer):
    result = ResultSerializer(read_only=True)

    class Meta:
        model = Point
        fields = ('id', 'points', 'result')
        # fields = ('id', 'points', 'game')

# SpecialBet
class SpecialBetSerializer(serializers.ModelSerializer):
    player = PlayerSerializer(read_only=True)
    team = TeamSerializer(read_only=True)

    class Meta:
        model = SpecialBet
        fields = ('id', 'player', 'player_goals', 'team', 'tournament')

# Group
class GroupSerializer(serializers.ModelSerializer):
    admin = UserSerializer(read_only=True)

    class Meta:
        model = Group
        fields = ('id', 'admin', 'users', 'name', 'description', 'color')

# Detail serializer, fetches multiple relationships
class DetailUserSerializer(serializers.ModelSerializer):
    bets = BetSerializer(many=True, read_only=True)
    points = PointSerializer(many=True, read_only=True)
    special_bets = SpecialBetSerializer(many=True, read_only=True)
    special_bet_results = SpecialBetResultSerializer(many=True, read_only=True)
    groups = DetailGroupSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'firstname', 'lastname', 'email', 'bets',
                  'points', 'special_bets', 'special_bet_results', 'groups')

# As detail but without groups and bets
class DeepUserSerializer(serializers.ModelSerializer):
    points = PointSerializer(many=True, read_only=True)
    special_bet_results = SpecialBetResultSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'firstname', 'lastname', 'email', 'points',
                  'special_bet_results')

