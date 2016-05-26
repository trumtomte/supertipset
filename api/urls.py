from django.conf.urls import url, include
from rest_framework import routers

from .viewsets import UserViewSet, BetViewSet, GameViewSet, RoundViewSet, \
                      TeamViewSet, PlayerViewSet, GroupViewSet, \
                      SpecialBetViewSet, GoalViewSet, PointViewSet, \
                      ResultViewSet, SpecialBetResultViewSet, \
                      TournamentViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'bets', BetViewSet)
router.register(r'games', GameViewSet)
router.register(r'rounds', RoundViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'players', PlayerViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'specialbets', SpecialBetViewSet)
router.register(r'goals', GoalViewSet)
router.register(r'points', PointViewSet)
router.register(r'results', ResultViewSet)
router.register(r'specialbetresults', SpecialBetResultViewSet)
router.register(r'tournaments', TournamentViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^auth/', include('rest_framework.urls')),
]
