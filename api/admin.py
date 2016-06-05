from django.contrib import admin
from collections import defaultdict

from .models import User, Group, Tournament, Round, Team, Game, Player, Bet, \
        SpecialBet, SpecialBetResult, Point, Result, Goal, SpecialBetFinal

# TODO: admin classes for all models? custom listing for all models?

def calculate_points(t1, t2, b1, b2):
    """
    Takes number of goals for each team (team 1 & team 2) and compares them
    with user bets (bet 1 & bet 2) and then calculates the points.
    """
    # Perfect bet
    if t1 == b1 and t2 == b2:
        return 10

    # Start points at 0
    points = 0
    # Calculate goal/bet difference
    tDiff = t1 - t2
    bDiff = b1 - b2

    # One bet is the same amount of goals for one team
    if t1 == b1 or t2 == b2:
        points += 1

    # Team 1 won
    if tDiff > 0 and bDiff > 0:
        points += 4
    # Team 2 won
    elif tDiff < 0 and bDiff < 0:
        points += 4
    # Draw
    elif tDiff == 0 and bDiff == 0:
        points += 4

    return points

# NOTE: Atomic batch update for better performance?
# from django.db import transaction
# @transaction.atomic

class ResultAdmin(admin.ModelAdmin):
    actions = ['calculate_points_action']

    def calculate_points_action(self, request, queryset):
        # All results from games 
        for result in queryset:
            t1 = result.team_1_goals
            t2 = result.team_2_goals
            game = result.game

            # All bets placed on the game by users
            bets = Bet.objects.filter(game=game.id)

            for bet in bets:
                b1 = bet.team_1_bet
                b2 = bet.team_2_bet
                user = bet.user
                points = calculate_points(t1, t2, b1, b2)

                # TODO: possible bottleneck
                try:
                    p = Point(user=user, points=points, result=result)
                    p.save()
                except Exception:
                    print("<Point> object already exists for user.")

        self.message_user(request, 'Points has been calculated!')

    # Dropdown menu text
    calculate_points_action.short_description = 'Calculate points'

class TournamentAdmin(admin.ModelAdmin):
    actions = ['calculate_points_action']

    def calculate_points_action(self, request, queryset):
        for tournament in queryset:
            # special bets from users
            special_bets = SpecialBet.objects.filter(tournament=tournament.id)
            correct_bets = SpecialBetFinal.objects.prefetch_related('players') \
                                          .filter(tournament=tournament.id)

            if len(correct_bets) == 0:
                self.message_user(request, 'There are no final special bet results available!')
                return False

            correct_bet = correct_bets[0]

            for special_bet in special_bets:
                player_points = 0
                goals_points = 0
                team_points = 0

                if special_bet.player in correct_bet.players.all():
                    player_points = 25

                if special_bet.player_goals == correct_bet.goals:
                    goals_points = 25

                if special_bet.team.id == correct_bet.team.id:
                    team_points = 50

                try:
                    result = SpecialBetResult(user=special_bet.user,
                                              tournament=tournament,
                                              player=player_points,
                                              goals=goals_points,
                                              team=team_points)
                    result.save()
                except Exception:
                    print("<SpecialBetResult> object already exists for user.")


        self.message_user(request, 'Points has been calculated!')

    # Dropdown menu text
    calculate_points_action.short_description = 'Calculate points (special bets)'


admin.site.register(User)
admin.site.register(Group)
admin.site.register(Tournament, TournamentAdmin)
admin.site.register(Round)
admin.site.register(Team)
admin.site.register(Game)
admin.site.register(Player)
admin.site.register(Bet)
admin.site.register(SpecialBet)
admin.site.register(SpecialBetResult)
admin.site.register(SpecialBetFinal)
admin.site.register(Point)
admin.site.register(Goal)
admin.site.register(Result, ResultAdmin)
