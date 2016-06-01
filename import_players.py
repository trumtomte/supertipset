def import_players(Team, Player):
    filename = 'players2.csv'

    with open(filename, 'r') as f:
        players = f.read().split('\n')
    f.close()

    for player_row in players:
        player, team = player_row.split(',')
        firstname, lastname = player.split(' ')

        t = Team.objects.get(country=team)
        p = Player(firstname=firstname, lastname=lastname)
        p.teams.append(t)
        p.save()
