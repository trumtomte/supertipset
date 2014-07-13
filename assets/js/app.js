var angular = require( 'angular' ),
    ngRoute = require( 'angular-route' ),
    ngAnimate = require( 'angular-animate' ),
    ngDialog = require( './services/dialog' )( angular ),
    ngNotify = require( './services/notify' )( angular ),
    ngProgressbar = require( './services/progressbar' )( angular );

var Router = require( './router' ),
    TemplateManager = require( './template-manager' );

// Application module
angular.module( 'supertipset', [
    'ngRoute',
    'ngAnimate',
    'ngNotify',
    'ngDialog',
    'ngProgressbar',
    'supertipset.controllers',
    'supertipset.services',
    'supertipset.directives',
    'supertipset.filters',
    'supertipset.models'
]).config( Router ).run( TemplateManager );

// Application module dependencies
angular.module( 'supertipset.controllers', [] );
angular.module( 'supertipset.services', [] );
angular.module( 'supertipset.directives', [] );
angular.module( 'supertipset.filters', [] );
angular.module( 'supertipset.models', [] );

// Create all modules
var controllers = require( './controllers' ),
    directives = require( './directives' ),
    filters = require( './filters' ),
    services = require( './services' ),
    models = require( './models' );

// Create all controllers/services etc.
function modulize( modules, ns, method ) {
    modules.forEach( function( m ) {
        angular.module( 'supertipset.' + ns )[method]( m.name, m.value );
    });
}

modulize( controllers, 'controllers', 'controller' );
modulize( directives, 'directives', 'directive' );
modulize( filters, 'filters', 'filter' );
modulize( services, 'services', 'factory' );
modulize( models, 'models', 'factory' );
