// Application module
angular.module( 'supertipset', ['ngRoute', 'ngAnimate', 'supertipset.controllers'] )
// Routes
.config( ['$routeProvider', function( $routeProvider ) {
    // Bets
    var bets = {
        controller: 'BetsCtrl',
        templateUrl: '/assets/templates/bets.html',
        resolve: {
            user: ['api', 'consts.user_id', function( api, id ) {
                return api.users.findOne( id );
            }],
            rounds: ['api', 'consts.user_id', function( api, id ) {
                return api.rounds.find( id );
            }],
            bets: ['api', 'consts.user_id', function( api, id ) {
                return api.bets.find( id );
            }]
        }
    };
    // Bets-routes
    $routeProvider.when( '/', bets );
    $routeProvider.when( '/bets', bets );

    // Groups
    $routeProvider.when( '/groups', {
        controller: 'GroupsCtrl',
        templateUrl: '/assets/templates/groups.html',
        resolve: {
            groups: ['api', 'consts.user_id', function( api, id ) {
                return api.usergroups.find( id );
            }]
        }
    });

    // Group
    $routeProvider.when( '/groups/:id', {
        controller: 'GroupCtrl',
        templateUrl: '/assets/templates/group.html',
        resolve: {
            group: ['api', '$route', function( api, $route ) {
                return api.groups.findOne( $route.current.params.id );
            }]
        }
    });

    // Profile (current user)
    $routeProvider.when( '/profile', {
        controller: 'ProfileCtrl',
        templateUrl: '/assets/templates/profile.html',
        resolve: {
            user: ['api', 'consts.user_id', function( api, id ) {
                return api.users.findOne( id );
            }],
            groups: ['api', 'consts.user_id', function( api, id ) {
                return api.usergroups.find( id );
            }]
        }
    });
    
    // Profile (other user)
    $routeProvider.when( '/profile/:id', {
        controller: 'ProfileCtrl',
        templateUrl: '/assets/templates/profile.html',
        resolve: {
            user: ['api', '$route', function( api, $route ) {
                return api.users.findOne( $route.current.params.id );
            }],
            groups: ['api', '$route', function( api, $route ) {
                return api.usergroups.find( $route.current.params.id );
            }]
        }
    });
    
    // Top list
    $routeProvider.when( '/toplist', {
        controller: 'TopListCtrl',
        templateUrl: '/assets/templates/toplist.html',
        resolve: {

        }
    });
}]);

angular.module( 'supertipset.controllers', [] );

angular.module( 'supertipset' ).factory( 'api', ['$http', '$cacheFactory', function( $http, $cacheFactory ) {
    // API error handler
    function e( m, o ) {
        return function( d ) {
            console.log( '[API ERROR]', m, o, '[RESPONSE]', d );
        }
    }

    var cache = $cacheFactory.get( '$http' );

    // API methods
    return {
        // Users
        users: {
            findOne: function( id ) {
                return $http.get( '/api/users/' + id, { cache: true } ).error( e( 'Unable to find user by id' ) );
            }
        },
        // User groups
        usergroups: {
            find: function( id ) {
                return $http.get( '/api/usergroups/' + id, { cache: true } ).error( e( 'Unable to find user groups by id' ) );
            }
        },
        // Groups
        groups: {
            findOne: function( id ) {
                return $http.get( '/api/groups/' + id, { cache: true } ).error( e( 'Unable to find group by id' ) );
            }
        },
        // Rounds
        rounds: {
            find: function( id ) {
                return $http.get( '/api/rounds/' + id, { cache: true } ).error( e( 'Unable to find rounds by id' ) );
            }
        },
        // Bets
        bets: {
            find: function( id ) {
                return $http.get( '/api/bets/' + id, { cache: true } ).error( e( 'Unable to find bets by id' ) );
            },
            create: function( bets ) {
                cache.remove( '/api/bets/' + bets.user_id );
                return $http.post( '/api/bets/' + bets.user_id, bets ).error( e( 'Unable to create a new bet' ) );
            },
            update: function( bets ) {
                cache.remove( '/api/bets/' + bets.user_id );
                return $http.put( '/api/bets/' + bets.user_id, bets ).error( e( 'Unable to update bets by id' ) );
            }
        }
    };
}]);

angular.module( 'supertipset' ).directive( 'game', ['api', 'consts.user_id', function( api, id ) {
    var directive = {
        require: '^ngModel',
        transclude: true,
        replace: true,
        templateUrl: '/assets/templates/game.html',
        link: function( $scope, $element, $attr ) {
            // Dates to determine if the game is done (been played)
            var today = new Date();
                gameStart = new Date( Date.parse( $scope.game.game_start ) );

            // Check if the user has bets on this game
            var bets = _.find( $scope.bets, { round_id: $scope.round.id } );
            $scope.bet = _.find( bets.bets, { game_id: $scope.game.game_id } );

            // Allowed values for bets
            $scope.bettingRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

            // Setup bets
            if ( $scope.bet ) {
                $scope.betOne = $scope.bettingRange[$scope.bet.team_1_bet];
                $scope.betTwo = $scope.bettingRange[$scope.bet.team_2_bet];
            } else {
                $scope.betOne = $scope.bettingRange[0];
                $scope.betTwo = $scope.bettingRange[0];
            }

            $scope.updateBet = function( betOne, betTwo ) {
                // If the user submits the same bet - do nothing
                if ( $scope.bet.team_1_bet == betOne &&
                     $scope.bet.team_2_bet == betTwo ) {
                    return true;
                }

                var bets = {
                    id: $scope.bet.bet_id,
                    user_id: id,
                    team_1_bet: betOne,
                    team_2_bet: betTwo
                };

                var success = function( res ) {
                    console.log( 'success', res );
                    $scope.bet.team_1_bet = betOne;
                    $scope.bet.team_2_bet = betTwo;
                };

                api.bets.update( bets ).success( success );
            };

            $scope.newBet = function( betOne, betTwo ) {
                var bets = {
                    user_id: id,
                    game_id: $scope.game.game_id,
                    team_1_bet: betOne,
                    team_2_bet: betTwo
                };

                var success = function( res ) {
                    console.log( 'success', res );

                    $scope.bet = {
                        user_id: id,
                        game_id: $scope.game.game_id,
                        team_1_bet: betOne,
                        team_2_bet: betTwo,
                        bet_id: res.insertId
                    };

                    $scope.betOne = $scope.bettingRange[betOne];
                    $scope.betTwo = $scope.bettingRange[betTwo];
                };

                api.bets.create( bets ).success( success );
            };

            // Dont allow betting if the game is done (been played)
            if ( today > gameStart ) {
                console.log( 'game has been played' );
                $scope.isDone = true;

            } else {
                console.log( 'game hasnt been played' );
                $scope.isDone = false;
            }
        }
    };

    return directive;
}]);


(function( angular ) {
    // Module
    angular.module( 'ngNotify', ['ngNotify.provider', 'ngNotify.directive'] );
    // Service
    angular.module( 'ngNotify.provider', [] ).provider( 'ngNotify', function() {
        var channels = {},
            delay = 4000,
            stackable = false;

        this.setDelay = function( ms ) {
            delay = angular.isNumber( ms ) ? ms : 4000;
        };

        this.setStackable = function( isStackable ) {
            stackable = isStackable;
        };

        this.$get = ['$timeout', function( $timeout ) {
            // Publish a notification to a channel, remove it after the set delay
            function publish( chan, notification, ms ) {
                ms || ms = delay

                if ( stackable === false && channels[chan].length > 0 ) {
                    remove( chan, channels[chan][0] );
                }

                channels[chan].push( notification );

                $timeout( function() {
                    remove( chan, notification );
                }, ms );
            };

            // Remove a notification
            function remove( chan, notification ) {
                var index;

                index = channels[chan].indexOf( notification );

                if ( index < 0 ) {
                    return false;
                }

                channels[chan].splice( index, 1 );
            };

            // Send a notification (of chosen level and message) to the chosen channel
            function send( chan, level, message, ms ) {
                publish( chan, { level: level, message: message }, ms );
            };

            // Create a new channel
            return function( chan ) {
                if ( ! channels.hasOwnProperty( chan ) ) {
                    channels[chan] = [];
                }

                return {
                    notifications: channels[chan],
                    remove: angular.bind( this, remove, chan ),
                    send: angular.bind( this, send, chan ),
                    info: angular.bind( this, send, chan, 'info' ),
                    warn: angular.bind( this, send, chan, 'warn' ),
                    error: angular.bind( this, send, chan, 'error' ),
                    success: angular.bind( this, send, chan, 'success' )
                };
            };
        }];
    });
    // Directive
    angular.module( 'ngNotify.directive', [] ).directive( 'ngNotify', ['ngNotify', function( notify ) {
        var directive;

        directive = {
            scope: {},
            transclude: true,
            template:
                '<ul class="ng-notify-items">' +
                    '<li class="ng-notify-item" data-ng-click="remove(notification)" data-ng-transclude data-ng-class="notification.level" data-ng-repeat="notification in notifications"></li>' +
                '</ul>',
            link: function( $scope, $element, $attr ) {
                var name = $attr.ngNotify;
                    channel = notify( name );

                $scope.notifications = channel.notifications;

                $scope.remove = function( notification ) {
                    channel.remove( notification );
                };
            }
        };

        return directive;
    }]);

    /*
        .ng-notify-item.ng-enter, .ng-notify-item.ng-move {
            -webkit-transition: 0.4s linear all;
            -moz-transition: 0.4s linear all;
            -o-transition: 0.4s linear all;
            transition: 0.4s linear all;
            opacity: 0;
        }

        .ng-notify-item.ng-enter.ng-enter-active,
        .ng-notify-item.ng-move.ng-move-active {
            opacity: 1;
        }

        .ng-notify-item.ng-leave {
            -webkit-animation: 0.5s ng-notify-hide;
            -moz-animation: 0.5s ng-notify-hide;
            -o-animation: 0.5s ng-notify-hide;
            animation: 0.5s ng-notify-hide;
        }

        @keyframes ng-notify-hide {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        @-webkit-keyframes ng-notify-hide {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        @-moz-keyframes ng-notify-hide {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        @-o-keyframes ng-notify-hide {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    */
    
})( angular );

(function( angular ) {
    // Module
    angular.module( 'ngProgressbar', ['ngProgressbar.provider', 'ngProgressbar.directive'] );
    // Service
    angular.module( 'ngProgressbar.provider', [] ).provider( 'ngProgressbar', function() {
        var progress, color;

        progress = 0;
        color = '#DA5757';

        this.setColor = function( newColor ) {
            color = newColor ? newColor : color;
        };

        this.$get = ['$document', '$rootScope', '$timeout', '$interval', '$compile', function( $document, $rootScope, $timeout, $interval, $compile ) {
            var $scope, $body, $bar, progressInterval, count, methods;

            $scope = $rootScope.$new();
            $body = $document.find( 'body' );
            count = 1;

            $bar = $compile( '<div data-ng-progressbar></div>' )( $scope );
            $body.append( $bar );

            $scope.progress = progress;
            $scope.color = color;

            methods = {
                start: function() {
                    if ( angular.isDefined( progressInterval ) ) {
                        count++;
                        return;
                    }

                    // Increment progress slower and slower
                    progressInterval = $interval( function() {
                        $scope.progress += ( 0.15 / count ) * Math.pow( 1 - Math.sqrt( 100 - $scope.progress ), 2 );
                    }, 200 );
                },
                stop: function() {
                    $interval.cancel( progressInterval );
                    progressInterval = undefined;
                },
                complete: function() {
                    if ( ! angular.isDefined( progressInterval ) ) {
                        return;
                    }

                    if ( count > 1 ) {
                        count--;
                        return;
                    }

                    $interval.cancel( progressInterval );
                    progressInterval = undefined;
                    $scope.progress = 100;
                    count = 1;

                    $timeout( function() {
                        $bar.children().css( 'opacity', '0' );

                        $timeout( function() {
                            $scope.progress = 0;

                            $timeout( function() {
                                $bar.children().css( 'opacity', '1' );
                            }, 400 );
                        }, 300 );
                    }, 300 );
                },
                reset: function() {
                    if ( angular.isDefined( progressInterval ) ) {
                        $interval.cancel( progressInterval );
                        progressInterval = undefined;
                        $scope.progress = 0;
                        count = 1;
                    }
                },
                color: function( newColor ) {
                    $scope.color = newColor;
                }
            };

            return methods;
        }];
    });
    // Directive
    angular.module( 'ngProgressbar.directive', [] ).directive( 'ngProgressbar', function() {
        var directive;

        directive = {
            replace: true,
            template: '<div id="ng-progressbar-container"><div id="ng-progressbar"></div></div>',
            link: function( $scope, $element ) {
                $scope.$watch( 'progress', function( newValue ) {
                    $scope.progress = newValue;
                    $element.eq( 0 ).children().css( 'width', newValue + '%' );
                });

                $scope.$watch( 'color', function( newValue ) {
                    $scope.color = newValue;
                    $element.eq( 0 ).children().css( 'background-color', newValue );
                    $element.eq( 0 ).children().css( 'color', newValue );
                });
            }
        };

        return directive;
    });

    /*****
     * CSS
     *****
        #ng-progressbar {
            margin: 0;
            padding: 0;
            z-index: 99998;
            background-color: #DA5757;
            color: #DA5757;
            box-shadow: 0 0 10px 0;
            height: 2px;
            opacity: 1;
            width: 0%;

            -webkit-transition: all 0.3s ease-in-out;
            -moz-transition: all 0.3s ease-in-out;
            -o-transition: all 0.3s ease-in-out;
            transition: all 0.3s ease-in-out;
        }

        #ng-progressbar-container {
            position: fixed;
            margin: 0;
            padding: 0;
            top: 0;
            left: 0;
            right: 0;
            z-index: 99999;
        }
     */
     
})( angular );

angular.module( 'supertipset' ).directive( 'round', function() {
    var directive = {
        require: '^ngModel',
        transclude: true,
        replace: true,
        templateUrl: '/assets/templates/round.html',
        link: function( $scope, $element, $attr ) {
            var today = new Date(),
                roundStart = new Date( Date.parse( $scope.round.start ) ),
                roundStop = new Date( Date.parse( $scope.round.stop ) );

            if ( roundStart < today && roundStop > today ) {
                $scope.isCurrentRound = true;
            } else {
                $scope.isCurrentRound = false;
            }
        }
    };

    return directive;
});

angular.module( 'supertipset.controllers' ).controller( 'AppCtrl', ['$scope', function( $scope ) {
    $scope.$back = function() {
        window.history.back();
    };
}]);

angular.module( 'supertipset.controllers' ).controller( 'BetsCtrl', ['$scope', '$route', function( $scope, $route ) {
    $scope.user = $route.current.locals.user.data.user;
    $scope.rounds = $route.current.locals.rounds.data.rounds;
    $scope.bets = $route.current.locals.bets.data.bets;

    console.log( 'BETS', $scope.user, $scope.rounds, $scope.bets );
}]);


angular.module( 'supertipset.controllers' ).controller( 'GroupCtrl', ['$scope', '$route', function( $scope, $route ) {
    $scope.group = $route.current.locals.group.data.group;

    console.log( 'GROUP', $scope.group );
}]);


angular.module( 'supertipset.controllers' ).controller( 'GroupsCtrl', ['$scope', '$route', function( $scope, $route ) {
    $scope.groups = $route.current.locals.groups.data.groups;

    console.log( 'GROUPS', $scope.groups );
}]);


angular.module( 'supertipset.controllers' ).controller( 'ProfileCtrl', ['$scope', '$route', function( $scope, $route ) {
    $scope.user = $route.current.locals.user.data.user;
    $scope.groups = $route.current.locals.groups.data.groups;

    if ( $route.current.params.id ) {
        console.log( 'other user' );
    } else {
        console.log( 'current user' );
    }

    console.log( 'PROFILE', $scope.groups, $scope.user );
}]);


angular.module( 'supertipset.controllers' ).controller( 'TopListCtrl', ['$scope', '$route', function( $scope, $route ) {
    // TODO
}]);

