import django_filters
from rest_framework import filters
from .models import Bet, Game, Goal, Result, Point

# Custom filter for multiple values
# http://stackoverflow.com/a/28842803
class ListFilter(django_filters.Filter):
    def filter(self, qs, value):
        if not value:
            return qs

        self.lookup_type = 'in'
        return super(ListFilter, self).filter(qs, value.split(','))

# Game
class GameFilter(filters.FilterSet):
    tournament = django_filters.NumberFilter(name="round__tournament")
    
    class Meta:
        model = Game
        fields = ('team_1', 'team_2', 'round', 'group_name', 'tournament')

# Bet
class BetFilter(filters.FilterSet):
    round = django_filters.NumberFilter(name="game__round")
    tournament = django_filters.NumberFilter(name="game__round__tournament")
    
    class Meta:
        model = Bet
        fields = ('user', 'game', 'round', 'tournament')

# Result
class ResultFilter(filters.FilterSet):
    round = django_filters.NumberFilter(name="game__round")
    tournament = django_filters.NumberFilter(name="game__round__tournament")
    
    class Meta:
        model = Result
        fields = ('game', 'created_at', 'round', 'tournament')

# Goal
class GoalFilter(filters.FilterSet):
    round = django_filters.NumberFilter(name="game__round")
    tournament = django_filters.NumberFilter(name="game__round__tournament")

    class Meta:
        model = Goal
        fields = ('player', 'game', 'round', 'tournament')

# Point
class PointFilter(filters.FilterSet):
    round = django_filters.NumberFilter(name="result__game__round")
    tournament = django_filters.NumberFilter(name="result__game__round__tournament")
    users = ListFilter(name="user")

    class Meta:
        model = Point
        fields = ('user', 'users', 'result', 'round', 'tournament')
