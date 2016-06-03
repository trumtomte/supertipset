from rest_framework import serializers

from .models import User, Bet, Game, Round, Group, SpecialBet, \
                    SpecialBetResult, Point

from .serializers import UserSerializer, TeamSerializer, PlayerSerializer, \
                         SpecialBetResultSerializer


# Point
class PointSerializer(serializers.ModelSerializer):

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

# Shallow serializer, doesnt fetch complete relationships
class ShallowUserSerializer(serializers.ModelSerializer):
    points = PointSerializer(many=True, read_only=True)
    special_bets = SpecialBetSerializer(many=True, read_only=True)
    special_bet_results = SpecialBetResultSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'firstname', 'lastname', 'email',
                  'points', 'special_bets', 'special_bet_results')

# Detail serializer, fetches multiple relationships
class DetailGroupSerializer(serializers.ModelSerializer):
    admin = UserSerializer(read_only=True)
    users = ShallowUserSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ('id', 'admin', 'users', 'name', 'description', 'color')
