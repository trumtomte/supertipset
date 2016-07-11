from rest_framework import serializers

from .models import User, Bet, Game, Round, Group, SpecialBet, \
                    SpecialBetResult, Point

from .serializers import UserSerializer, TeamSerializer, PlayerSerializer, \
                         SpecialBetResultSerializer


class PointSerializer(serializers.ModelSerializer):
    """
    Serializer for points
    """
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


class ShallowUserSerializer(serializers.ModelSerializer):
    """
    Shallow serializer for users, doesnt fetch complete relationships
    """
    points = PointSerializer(many=True, read_only=True)
    special_bets = SpecialBetSerializer(many=True, read_only=True)
    special_bet_results = SpecialBetResultSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'firstname', 'lastname', 'email',
                  'points', 'special_bets', 'special_bet_results')


class DetailGroupSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for groups
    """
    admin = UserSerializer(read_only=True)
    users = ShallowUserSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ('id', 'admin', 'users', 'name', 'description', 'color')
