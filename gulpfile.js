// Dependencies
var gulp =  require( 'gulp' ),
    sass = require( 'gulp-ruby-sass' ),
    clean = require( 'gulp-clean' ),
    minify = require( 'gulp-minify-css' ),
    uglify = require( 'gulp-uglify' ),
    concat = require( 'gulp-concat' );

// Compile SASS to CSS and minify the CSS source
gulp.task( 'styles', function() {
    return gulp.src( ['assets/sass/backend.scss', 'assets/sass/frontend.scss'] )
        .pipe( sass({ style: 'compressed' }) )
        .pipe( gulp.dest( 'assets/css' ) )
        .pipe( minify() );
});

// Concatenate all JS files
gulp.task( 'scripts', function() {
    // AngularJS source files
    var src = [
        'assets/js/app.js',
        'assets/js/services/*',
        'assets/js/directives/*',
        'assets/js/filters/*',
        'assets/js/controllers/*'
    ];

    return gulp.src( src )
        .pipe( concat( 'app.build.js' ) )
        .pipe( gulp.dest( 'assets/js' ) );
});

// Minify all JS to app.min.js
gulp.task( 'scripts-min', function() {
    // JS source files
    var src = [
        'assets/js/vendor/angular/angular.min.js',
        'assets/js/vendor/angular-route/angular-route.min.js',
        'assets/js/vendor/angular-animate/angular-animate.min.js',
        'assets/js/vendor/lodash/dist/lodash.min.js',
        'assets/js/app.build.js'
    ];

    return gulp.src( src )
        .pipe( concat( 'app.min.js' ) )
        .pipe( uglify() )
        .pipe( gulp.dest( 'assets/js' ) );
});

// Watch for changes
gulp.task( 'watch', function() {
    // JS
    gulp.watch( 'assets/js/**/*.js', ['scripts'] );
    // SASS
    gulp.watch( 'assets/sass/**/*.scss', ['styles'] );
});

// Default task
gulp.task( 'default', ['scripts', 'scripts-min', 'styles']);

// Clean build directory
gulp.task( 'clean', function() {
    return gulp.src( ['build/*'], { read: false } )
        .pipe( clean() );
});

// Build task
gulp.task( 'build', ['scripts', 'scripts-min', 'styles'], function() {
    var src = [
        'assets/js/app.min.js',
        'assets/css/main.css',
        'assets/templates/*',
        'assets/images/*',
        'assets/fonts/*',
        'routes/*',
        'views/*',
        'utilities/*',
        'server.js',
        'humans.txt',
        'robots.txt',
        'sitemap.xml',
        'node_modules/body-parser/**/*',
        'node_modules/cookie-parser/**/*',
        'node_modules/cookie-session/**/*',
        'node_modules/csurf/**/*',
        'node_modules/express/**/*',
        'node_modules/jade/**/*',
        'node_modules/morgan/**/*',
        'node_modules/mysql/**/*'
    ];

    return gulp.src( src, { base: './' } )
        .pipe( gulp.dest( 'build' ) );
});
