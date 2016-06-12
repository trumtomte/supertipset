from rest_framework import serializers

from .models import User, Bet, Game, Round, Group, SpecialBet, \
                    SpecialBetResult, Point

from .serializers import TeamSerializer, PlayerSerializer, ResultSerializer, \
                         UserSerializer, SpecialBetResultSerializer

from .serializer_group_detail import DetailGroupSerializer


class RoundSerializer(serializers.ModelSerializer):
    """
    Serialier for rounds
    """
    class Meta:
        model = Round
        fields = ('id', 'name', 'tournament', 'start_date', 'stop_date')


class GameSerializer(serializers.ModelSerializer):
    """
    Serializer for games
    """
    round = RoundSerializer(read_only=True)
    team_1 = TeamSerializer(read_only=True)
    team_2 = TeamSerializer(read_only=True)
    result = ResultSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ('id', 'team_1', 'team_2', 'round',
                  'group_name', 'start_date', 'stop_date', 'result')


class BetSerializer(serializers.ModelSerializer):
    """
    Serializer for bets
    """
    game = GameSerializer(read_only=True)

    class Meta:
        model = Bet
        fields = ('id', 'game', 'team_1_bet', 'team_2_bet', 'created_at')


class PointSerializer(serializers.ModelSerializer):
    """
    Serializer for points
    """
    result = ResultSerializer(read_only=True)

    class Meta:
        model = Point
        fields = ('id', 'points', 'result')


class SpecialBetSerializer(serializers.ModelSerializer):
    """
    Serializer for special bets
    """
    player = PlayerSerializer(read_only=True)
    team = TeamSerializer(read_only=True)

    class Meta:
        model = SpecialBet
        fields = ('id', 'player', 'player_goals', 'team', 'tournament')


class GroupSerializer(serializers.ModelSerializer):
    """
    Serializer for groups
    """
    admin = UserSerializer(read_only=True)

    class Meta:
        model = Group
        fields = ('id', 'admin', 'users', 'name', 'description', 'color')


class DetailUserSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for users
    """
    bets = BetSerializer(many=True, read_only=True)
    points = PointSerializer(many=True, read_only=True)
    special_bets = SpecialBetSerializer(many=True, read_only=True)
    special_bet_results = SpecialBetResultSerializer(many=True, read_only=True)
    groups = DetailGroupSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'firstname', 'lastname', 'email', 'bets',
                  'points', 'special_bets', 'special_bet_results', 'groups')


class DeepUserSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for users but omitting some fields
    """
    points = PointSerializer(many=True, read_only=True)
    special_bet_results = SpecialBetResultSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'firstname', 'lastname', 'email', 'points',
                  'special_bet_results')

