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
                ms = ms || delay;

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
                var name = $attr.ngNotify,
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
