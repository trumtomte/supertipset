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
