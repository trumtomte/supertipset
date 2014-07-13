// Routes
function Router( $routeProvider, userID, tournamentID ) {
    // Bet route
    var bets = {
        controller: 'BetsCtrl',
        templateUrl: 'bets.html',
        resolve: {
            user: ['UserService', function( UserService ) {
                return UserService.findOne( userID );
            }],
            rounds: ['RoundService', function( RoundService ) {
                return RoundService.find( tournamentID );
            }],
            bets: ['BetService', function( BetService ) {
                return BetService.find( userID );
            }],
            teams: ['TeamService', function( TeamService ) {
                return TeamService.all();
            }]
        }
    };

    // Bet routes
    $routeProvider.when( '/', bets );
    $routeProvider.when( '/bets', bets );

    // User specific groups
    $routeProvider.when( '/groups', {
        controller: 'GroupsCtrl',
        templateUrl: 'groups.html',
        resolve: {
            user: ['UserService', function( UserService ) {
                return UserService.findOne( userID );
            }],
            groups: ['UserGroupService', function( UserGroupService ) {
                return UserGroupService.find( userID );
            }]
        }
    });

    // Specific group
    $routeProvider.when( '/groups/:id', {
        controller: 'GroupCtrl',
        templateUrl: 'group.html',
        resolve: {
            user: ['UserService', function( UserService ) {
                return UserService.findOne( userID );
            }],
            group: ['GroupService', '$route', function( GroupService, $route ) {
                return GroupService.findOne( $route.current.params.id );
            }]
        }
    });

    // Profile (current user)
    $routeProvider.when( '/profile', {
        controller: 'ProfileCtrl',
        templateUrl: 'profile.html',
        resolve: {
            user: ['UserService', function( UserService ) {
                return UserService.findOne( userID );
            }],
            groups: ['UserGroupService', function( UserGroupService ) {
                return UserGroupService.find( userID );
            }],
            bets: ['BetService', function( BetService ) {
                return BetService.find( userID );
            }],
            rounds: ['RoundService', function( RoundService ) {
                return RoundService.find( tournamentID );
            }],
            teams: ['TeamService', function( TeamService ) {
                return TeamService.all();
            }]
        }
    });
    
    // Profile (other user)
    $routeProvider.when( '/profile/:id', {
        controller: 'ProfileCtrl',
        templateUrl: 'profile.html',
        resolve: {
            user: ['UserService', '$route', function( UserService, $route ) {
                return UserService.findOne( $route.current.params.id );
            }],
            groups: ['UserGroupService', '$route', function( UserGroupService, $route ) {
                return UserGroupService.find( $route.current.params.id );
            }],
            bets: ['BetService', '$route', function( BetService, $route ) {
                return BetService.find( $route.current.params.id );
            }],
            rounds: ['RoundService', function( RoundService ) {
                return RoundService.find( tournamentID );
            }],
            teams: ['TeamService', function( TeamService ) {
                return TeamService.all();
            }]
        }
    });
    
    // Top lists
    $routeProvider.when( '/toplist', {
        controller: 'TopListCtrl',
        templateUrl: 'toplist.html',
        resolve: {
            toplists: ['TopListService', function( TopListService ) {
                return TopListService.all();
            }]
        }
    });

    // Default
    $routeProvider.otherwise({ redirectTo: '/' });
}

Router.$inject = ['$routeProvider', 'userID', 'tournamentID'];

module.exports = Router;
