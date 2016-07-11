from operator import itemgetter

from django.db.models import Prefetch, Sum, Count, F, Value, Case, When
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.hashers import check_password, make_password

from rest_framework import viewsets, filters, status
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response
from rest_framework_extensions.cache.decorators import cache_response

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
                         SpecialBetFinalSerializer, Top10BetsSerializer, \
                         Top10PointsSerializer, Top10MembersSerializer, \
                         Top10AverageSerializer, GroupOverviewSerializer

from .serializer_user_detail import DetailUserSerializer 

# TODO
# - add checking of request data - and response based on that

class UserViewSet(viewsets.ModelViewSet):
    """
    Viewset for users
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def calculate_cache_key(self, view_instance, view_method, request, args,
                            kwargs):
        """
        Calculates the key for caching
        """
        return '.'.join(map(str, [len(args),
                                  len(kwargs),
                                  hash(frozenset(request.GET.items())),
                                  hash(request.path)]))

    @cache_response(8, key_func='calculate_cache_key')
    @list_route()
    def top_10_bets(self, request):
        """
        Get the top 10 users based on 10pt bets from a given tournament (or all)
        """
        tournament_id = request.GET.get('tournament')

        if tournament_id:
            users = User.objects.filter(
                points__result__game__round__tournament=tournament_id,
                points__points__exact=10
            )
        else:
            users = User.objects.filter(points__points__exact=10) 
                    
        users = users \
                .annotate(top_bet_count=Count('points', distinct=True)) \
                .exclude(top_bet_count__isnull=True) \
                .order_by('-top_bet_count')[:10]

        serializer = Top10BetsSerializer(users, many=True)
        return Response(serializer.data)

    @cache_response(8, key_func='calculate_cache_key')
    @list_route()
    def top_10_points(self, request):
        """
        Get the top 10 users based on points from a given tournament (or all)
        """
        tournament_id = request.GET.get('tournament')

        if tournament_id:
            users = User.objects.extra(
                select={'sum_special_bets': "SELECT COALESCE(t.player + t.team + t.goals, 0) FROM api_specialbetresult AS t WHERE t.tournament_id = %s AND t.user_id = api_user.id"},
                select_params=(tournament_id,)
            )
        else:
            users = User.objects.extra(
                select={'sum_special_bets': "SELECT SUM(COALESCE(t.player + t.team + t.goals, 0)) FROM api_specialbetresult AS t WHERE t.user_id = api_user.id"}
            )

        users = users \
                .annotate(sum_points=Sum(Case(
                    When(points__result__game__round__tournament=tournament_id,
                         then=F('points__points')),
                    default=Value(0)
                ))) \
                .values('id', 'username', 'sum_points', 'sum_special_bets') \
                .order_by('-sum_points')

        for u in users:
            u['sum_special_bets'] = int(u['sum_special_bets'] or 0)
            u['total_points'] = u['sum_points'] + u['sum_special_bets']

        # Filter out users with 0 total points
        users = filter(lambda u: u['total_points'] > 0, users)
        # Sort by total points and limit by 10
        users = sorted(users, key=itemgetter('total_points'), reverse=True)[:10]

        serializer = Top10PointsSerializer(users, many=True)
        return Response(serializer.data)

    # TODO rewrite for better performance etc.
    # Detail route that fetches lots of relationships
    @cache_response(8, key_func='calculate_cache_key')
    @detail_route(methods=['get'])
    def detail(self, request, pk=None):
        tournament_id = request.GET.get('tournament')

        if tournament_id:
            user = User.objects.prefetch_related(
                Prefetch('bets',
                    queryset=Bet.objects.filter(game__round__tournament=tournament_id)),
                Prefetch('points',
                    queryset=Point.objects.filter(result__game__round__tournament=tournament_id)),
                Prefetch('special_bets',
                    queryset=SpecialBet.objects.filter(tournament=tournament_id)),
                Prefetch('special_bet_results',
                    queryset=SpecialBetResult.objects.filter(tournament=tournament_id)),
                Prefetch('groups__users__points',
                    queryset=Point.objects.filter(result__game__round__tournament=tournament_id)),
                Prefetch('groups__users__special_bets',
                    queryset=SpecialBet.objects.filter(tournament=tournament_id)),
                Prefetch('groups__users__special_bet_results',
                    queryset=SpecialBetResult.objects.filter(tournament=tournament_id)) 
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

    def calculate_cache_key(self, view_instance, view_method, request, args,
                            kwargs):
        """
        Calculates the key for caching
        """
        return '.'.join(map(str, [len(args),
                                  len(kwargs),
                                  hash(frozenset(request.GET.items())),
                                  hash(request.path)]))

    # Top 10 Members (count)
    @cache_response(8, key_func='calculate_cache_key')
    @list_route()
    def top_10_members(self, request):
        groups = Group.objects.annotate(member_count=Count('users')) \
                         .values('id', 'name', 'member_count') \
                         .order_by('-member_count')[:10]

        serializer = Top10MembersSerializer(groups, many=True)
        return Response(serializer.data)

    # Top 10 Average (points per group)
    @cache_response(8, key_func='calculate_cache_key')
    @list_route()
    def top_10_average(self, request):
        tournament_id = request.GET.get('tournament')

        groups = Group.objects \
                    .annotate(
                        member_count=Count('users', distinct=True),
                        sum_points=Sum(Case(
                            When(users__points__result__game__round__tournament=tournament_id,
                                 then=F('users__points__points')),
                            default=Value(0)
                        ))
                    ) \
                    .extra(
                        select={'sum_special_bets': "SELECT SUM(DISTINCT CASE WHEN api_specialbetresult.tournament_id = 2 THEN (api_specialbetresult.player + api_specialbetresult.team + api_specialbetresult.goals) ELSE 0 END) FROM api_user LEFT OUTER JOIN api_specialbetresult ON (api_user.id = api_specialbetresult.user_id) LEFT OUTER JOIN api_group_users ON (api_group_users.user_id = api_user.id) WHERE api_group_users.group_id = api_group.id"},
                        select_params=(tournament_id,)
                    ) \
                    .values('id', 'name', 'member_count', 'sum_points',
                            'sum_special_bets')

        # # Add the average to each group
        for g in groups:
            g['sum_special_bets'] = int(g['sum_special_bets'] or 0)
            g['average'] = (g['sum_points'] + g['sum_special_bets']) / g['member_count']

        groups = sorted(groups, key=itemgetter('average'), reverse=True)[:10]

        serializer = Top10AverageSerializer(groups, many=True)
        return Response(serializer.data)

    @cache_response(8, key_func='calculate_cache_key')
    @list_route()
    def list(self, request):
        tournament_id = request.GET.get('tournament')
        user_ids = request.GET.get('users')

        # NOTE
        # Should be able to calculate total points between all tournaments?
        if not tournament_id:
            err = {"error": 'Parameter <tournament_id> missing'}
            return Response(err, status=status.HTTP_400_BAD_REQUEST)

        # Get all groups based on user ids
        groups = Group.objects \
                    .values('id', 'name', 'description', 'admin') \
                    .order_by('name')

        # Only get groups containing the user ids
        if user_ids:
            groups = groups.filter(users__in=user_ids.split(','))

        # Get all users based on what groups they have a relation to
        users = User.objects \
                .filter(groups__in=[group['id'] for group in groups]) \
                .annotate(country=Case(
                    When(special_bets__tournament=tournament_id,
                         then=F('special_bets__team__name')),
                    default=Value("")
                )) \
                .annotate(sum_points=Sum(Case(
                    When(points__result__game__round__tournament=tournament_id,
                         then=F('points__points')),
                    default=Value(0)
                ))) \
                .extra(
                    select={'sum_special_bets': "SELECT COALESCE(t.player + t.team + t.goals, 0) FROM api_specialbetresult AS t WHERE t.tournament_id = %s AND t.user_id = api_user.id"},
                    select_params=(tournament_id,)
                ) \
                .values('id', 'username', 'country', 'sum_points',
                        'sum_special_bets', 'groups') \
                .order_by('id')

        # Add users to each group 
        for user in users:
            # Calculate total points for a user
            user['sum_special_bets'] = int(user['sum_special_bets'] or 0)
            user['total_points'] = user['sum_points'] + user['sum_special_bets']

            for group in groups:
                # User has a relation to the group,
                # add the user to the group then pop the dict-key
                # break out of the loop since it found the group relation
                if user['groups'] == group['id']:
                    group.setdefault('users', []).append(user)
                    user.pop('groups', None)
                    break

        # Sort users based on total points
        for group in groups:
            group['users'] = sorted(group['users'], key=itemgetter('total_points'), reverse=True)

        serializer = GroupOverviewSerializer(groups, many=True)
        return Response(serializer.data)

    @cache_response(8, key_func='calculate_cache_key')
    @detail_route(methods=['get'])
    def users(self, request, pk=None):
        tournament_id = request.GET.get('tournament')

        if not tournament_id:
            err = {"error": 'Parameter <tournament_id> missing'}
            return Response(err, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects \
                .filter(groups__exact=pk) \
                .annotate(country=Case(
                    When(special_bets__tournament=tournament_id,
                         then=F('special_bets__team__name')),
                    default=Value("")
                )) \
                .annotate(sum_points=Sum(Case(
                    When(points__result__game__round__tournament=tournament_id,
                         then=F('points__points')),
                    default=Value(0)
                ))) \
                .extra(
                    select={'sum_special_bets': "SELECT COALESCE(t.player + t.team + t.goals, 0) FROM api_specialbetresult AS t WHERE t.tournament_id = %s AND t.user_id = api_user.id"},
                    select_params=(tournament_id,)
                ) \
                .values('id', 'username', 'sum_points', 'country',
                        'sum_special_bets')

        for user in users:
            user['sum_special_bets'] = int(user['sum_special_bets'] or 0)
            user['total_points'] = user['sum_points'] + user['sum_special_bets']

        users = sorted(users, key=itemgetter('total_points'), reverse=True)

        try:
            group = Group.objects.values('id', 'name', 'description', 'admin') \
                                 .get(pk=pk)
        except Exception:
            err = {"error": 'Group not found'}
            return Response(err, status=status.HTTP_404_NOT_FOUND)

        group['users'] = users

        serializer = GroupOverviewSerializer(group)
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
            # TODO check if admin exists or not?
            admin = User.objects.get(pk=admin_id)
            group.admin = admin

        group.save()

        serializer = GroupSerializer(group)
        return Response(serializer.data)


    def perform_create(self, serializer):
        password = make_password(self.request.data['password'])
        user = User.objects.get(pk=self.request.data['user'])
        serializer.save(admin=user, users=[user], password=password)


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
