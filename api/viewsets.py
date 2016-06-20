from rest_framework import viewsets, filters, status
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password, make_password
from django.db.models import Prefetch

from .models import User, Bet, Game, Round, Team, Player, Group, SpecialBet, \
                    Goal, SpecialBetResult, Result, Point, Tournament, \
                    SpecialBetFinal

from .filters import GameFilter, BetFilter, ResultFilter, GoalFilter, \
                     PointFilter

from .serializers import UserSerializer, BetSerializer, GameSerializer, \
                         RoundSerializer, TeamSerializer, PlayerSerializer, \
                         GroupSerializer, SpecialBetSerializer, \
                         GoalSerializer, PointSerializer, ResultSerializer, \
                         SpecialBetResultSerializer, TournamentSerializer, \
                         SpecialBetFinalSerializer

from .serializer_user_detail import DetailUserSerializer, DeepUserSerializer
from .serializer_group_detail import DetailGroupSerializer

from rest_framework_extensions.cache.decorators import cache_response

# NOTE possible bottlenecks from the large prefetches?

class UserViewSet(viewsets.ModelViewSet):
    """
    Viewset for users
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # Cache key function
    def calculate_cache_key(self, view_instance, view_method, request, args, kwargs):
        return '.'.join(map(str, [len(args),
                                  len(kwargs),
                                  hash(frozenset(request.GET.items())),
                                  hash(request.path)]))


    @cache_response(6, key_func='calculate_cache_key')
    @list_route()
    def deep(self, request):
        tournament_id = request.GET.get('tournament')

        if tournament_id:
            user = User.objects.prefetch_related(
                        Prefetch('points', queryset=Point.objects.filter(result__game__round__tournament=tournament_id)) 
                    ) \
                   .prefetch_related(
                        Prefetch('special_bet_results', queryset=SpecialBetResult.objects.filter(tournament=tournament_id)) 
                    ) \
                   .all()
        else:
            user = User.objects.prefetch_related('points') \
                               .prefetch_related('special_bet_results') \
                               .all()

        serializer = DeepUserSerializer(user, many=True)
        return Response(serializer.data)

    # Detail route that fetches lots of relationships
    @cache_response(6, key_func='calculate_cache_key')
    @detail_route(methods=['get'])
    def detail(self, request, pk=None):
        tournament_id = request.GET.get('tournament')

        if tournament_id:
            user = User.objects.prefetch_related(
                        Prefetch('bets', queryset=Bet.objects.filter(game__round__tournament=tournament_id)) 
                    ) \
                   .prefetch_related(
                        Prefetch('points', queryset=Point.objects.filter(result__game__round__tournament=tournament_id)) 
                    ) \
                   .prefetch_related(
                        Prefetch('special_bets', queryset=SpecialBet.objects.filter(tournament=tournament_id)) 
                    ) \
                   .prefetch_related(
                        Prefetch('special_bet_results', queryset=SpecialBetResult.objects.filter(tournament=tournament_id)) 
                    ) \
                   .prefetch_related(
                        Prefetch('groups__users__points', queryset=Point.objects.filter(result__game__round__tournament=tournament_id)) 
                    ) \
                   .prefetch_related(
                        Prefetch('groups__users__special_bets', queryset=SpecialBet.objects.filter(tournament=tournament_id)) 
                    ) \
                   .prefetch_related(
                        Prefetch('groups__users__special_bet_results', queryset=SpecialBetResult.objects.filter(tournament=tournament_id)) 
                    ) \
                   .get(pk=pk)
        else:
            user = self.get_object()

        serializer = DetailUserSerializer(user)
        return Response(serializer.data)

    # Detail route for adding group relationships
    @detail_route(methods=['post'])
    def group(self, request, pk=None):
        user = self.get_object()
        group_name = self.request.data['name']
        password = self.request.data['password']

        group = Group.objects.filter(name=group_name)

        if len(group) == 0:
            err = {"error": 'Group not found'}
            return Response(err, status=status.HTTP_404_NOT_FOUND)

        group = group[0]

        if not check_password(password, group.password):
            err = {"error": 'Unauthorized'}
            return Response(err, status=status.HTTP_401_UNAUTHORIZED)

        group.users.add(user)
        group.save()

        serializer = GroupSerializer(group)
        return Response(serializer.data)

    @detail_route(methods=['put'])
    def password(self, request, pk=None):
        p = self.request.data['password']

        user = self.get_object()
        user.password = make_password(p)
        user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data)

class GroupViewSet(viewsets.ModelViewSet):
    """
    Viewset for groups
    """
    queryset = Group.objects.select_related('admin') \
                            .prefetch_related('users') \
                            .all()
    serializer_class = GroupSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('admin', 'users')

    # Cache key function
    def calculate_cache_key(self, view_instance, view_method, request, args, kwargs):
        return '.'.join(map(str, [len(args),
                                  len(kwargs),
                                  hash(frozenset(request.GET.items())),
                                  hash(request.path)]))

    @cache_response(6, key_func='calculate_cache_key')
    @list_route()
    def deep(self, request):
        tournament_id = request.GET.get('tournament')
        users = request.GET.get('users')
        admin = request.GET.get('admin')

        if tournament_id:
            groups = Group.objects.prefetch_related(
                        Prefetch('users__points', queryset=Point.objects.filter(result__game__round__tournament=tournament_id)) 
                    ) \
                   .prefetch_related(
                        Prefetch('users__special_bets', queryset=SpecialBet.objects.filter(tournament=tournament_id)) 
                    ) \
                   .prefetch_related(
                        Prefetch('users__special_bet_results', queryset=SpecialBetResult.objects.filter(tournament=tournament_id)) 
                    )

            if users:
                groups = groups.filter(users__in=users.split(','))
            if admin:
                groups = groups.filter(admin=admin)
        else:
            groups = Group.objects.select_related('admin') \
                                  .prefetch_related('users') \
                                  .all()

        serializer = DetailGroupSerializer(groups, many=True)
        return Response(serializer.data)

    # Detail route that fetches lots of relationships
    @cache_response(6, key_func='calculate_cache_key')
    @detail_route(methods=['get'])
    def detail(self, request, pk=None):

        tournament_id = request.GET.get('tournament')

        if tournament_id:
            group = Group.objects.prefetch_related(
                        Prefetch('users__points', queryset=Point.objects.filter(result__game__round__tournament=tournament_id)) 
                    ) \
                   .prefetch_related(
                        Prefetch('users__special_bets', queryset=SpecialBet.objects.filter(tournament=tournament_id)) 
                    ) \
                   .prefetch_related(
                        Prefetch('users__special_bet_results', queryset=SpecialBetResult.objects.filter(tournament=tournament_id)) 
                    ) \
                   .get(pk=pk)
        else:
            group = self.get_object()

        serializer = DetailGroupSerializer(group)
        return Response(serializer.data)

    @detail_route(methods=['put'])
    def password(self, request, pk=None):
        p = self.request.data['password']
        group = self.get_object()
        group.password = make_password(p)
        group.save()

        serializer = GroupSerializer(group)
        return Response(serializer.data)

    @detail_route(methods=['put'])
    def leave(self, request, pk=None):
        admin_id = self.request.data['admin']
        user_id = self.request.data['user']
        group = self.get_object()

        user = User.objects.get(pk=user_id)

        group.users.remove(user)

        if admin_id > 0:
            admin = User.objects.get(pk=admin_id)
            group.admin = admin

        group.save()

        serializer = GroupSerializer(group)
        return Response(serializer.data)


    def perform_create(self, serializer):
        password = make_password(self.request.data['password'])
        user = User.objects.get(pk=self.request.data['user'])
        serializer.save(admin=user, users=[user], password=password)


class BetViewSet(viewsets.ModelViewSet):
    """
    Viewset for bets
    """
    queryset = Bet.objects.select_related('user') \
                          .select_related('game') \
                          .all()
    serializer_class = BetSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = BetFilter

    def perform_create(self, serializer):
        user = User.objects.get(pk=self.request.data['user'])
        game = Game.objects.get(pk=self.request.data['game'])
        serializer.save(user=user, game=game)


class GameViewSet(viewsets.ModelViewSet):
    """
    Viewset for games
    """
    queryset = Game.objects.select_related('team_1') \
                           .select_related('team_2') \
                           .prefetch_related('result') \
                           .all()
    serializer_class = GameSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = GameFilter


class RoundViewSet(viewsets.ModelViewSet):
    """
    Viewset for rounds
    """
    queryset = Round.objects.select_related('tournament') \
                            .prefetch_related('games') \
                            .all()
    serializer_class = RoundSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('tournament',)


class TeamViewSet(viewsets.ModelViewSet):
    """
    Viewset for teams
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class PlayerViewSet(viewsets.ModelViewSet):
    """
    Viewset for players
    """
    queryset = Player.objects.prefetch_related('teams').all()
    serializer_class = PlayerSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('teams',)


class SpecialBetViewSet(viewsets.ModelViewSet):
    """
    Viewset for special bets
    """
    queryset = SpecialBet.objects.select_related('user') \
                                 .select_related('player') \
                                 .select_related('team') \
                                 .select_related('tournament') \
                                 .all()
    serializer_class = SpecialBetSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('user', 'player', 'team', 'tournament')

    def perform_create(self, serializer):
        user = User.objects.get(pk=self.request.data['user'])
        player = Player.objects.get(pk=self.request.data['player'])
        team = Team.objects.get(pk=self.request.data['team'])
        tournament = Tournament.objects.get(pk=self.request.data['tournament'])

        serializer.save(user=user, player=player, team=team,
                        tournament=tournament)

    def update(self, request, pk=None):
        special_bet = self.get_object()
        player = Player.objects.get(pk=self.request.data['player'])
        team = Team.objects.get(pk=self.request.data['team'])
        player_goals = self.request.data['player_goals']

        special_bet.player = player
        special_bet.team = team
        special_bet.player_goals = player_goals
        special_bet.save()

        serializer = SpecialBetSerializer(special_bet)
        return Response(serializer.data)


class GoalViewSet(viewsets.ModelViewSet):
    """
    Viewset for goals
    """
    queryset = Goal.objects.select_related('player') \
                           .select_related('game') \
                           .all()
    serializer_class = GoalSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = GoalFilter


class PointViewSet(viewsets.ModelViewSet):
    """
    Viewset for points
    """
    queryset = Point.objects.select_related('user') \
                            .select_related('result') \
                            .all()
    serializer_class = PointSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = PointFilter


class ResultViewSet(viewsets.ModelViewSet):
    """
    Viewset for results
    """
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = ResultFilter


class SpecialBetResultViewSet(viewsets.ModelViewSet):
    """
    Viewset for special bet results
    """
    queryset = SpecialBetResult.objects.select_related('user') \
                                       .select_related('tournament') \
                                       .all()
    serializer_class = SpecialBetResultSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('user', 'tournament', 'created_at')


class TournamentViewSet(viewsets.ModelViewSet):
    """
    Viewset for tournaments
    """
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('name', 'start_date', 'stop_date')


class SpecialBetFinalViewSet(viewsets.ModelViewSet):
    """
    Viewset for special bets (final results)
    """
    queryset = SpecialBetFinal.objects.all()
    serializer_class = SpecialBetFinalSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('tournament', 'team', 'player', 'created_at')
