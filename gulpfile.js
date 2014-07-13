// Dependencies
var gulp =  require( 'gulp' ),
    sass = require( 'gulp-ruby-sass' ),
    clean = require( 'gulp-clean' ),
    minify = require( 'gulp-minify-css' ),
    uglify = require( 'gulp-uglify' ),
    browserify = require( 'browserify' ),
    source = require( 'vinyl-source-stream' ),
    rename = require( 'gulp-rename' );

// Compile SASS to CSS and minify the CSS source
gulp.task( 'styles', function() {
    return gulp.src( ['assets/sass/backend.scss', 'assets/sass/frontend.scss'] )
        .pipe( sass({ style: 'compressed' }) )
        .pipe( gulp.dest( 'assets/css' ) )
        .pipe( minify() );
});


var bundler = browserify( './assets/js/app.js' );

// Browserify
gulp.task( 'browserify', function() {
    return bundler
        .transform( 'brfs' )
        .bundle({ debug: true })
        .pipe( source( 'bundle.js' ) )
        .pipe( gulp.dest( 'assets/js' ) );
});

// Uglify browserify source
gulp.task( 'browserify-min', function() {
    return gulp.src( 'assets/js/bundle.js' )
        .pipe( rename( 'bundle.min.js' ) )
        .pipe( uglify() )
        .pipe( gulp.dest( 'assets/js' ) );
});

// Watch for changes
gulp.task( 'watch', function() {
    // JS
    gulp.watch( ['assets/js/**/*.js', '!assets/js/bundle*'], ['browserify'] );
    // SASS
    gulp.watch( 'assets/sass/**/*.scss', ['styles'] );
});

// Clean build directory
gulp.task( 'clean', function() {
    return gulp.src( ['build/*'], { read: false } )
        .pipe( clean() );
});

// Build task
gulp.task( 'build', ['browserify', 'browserify-min', 'styles'], function() {
    var src = [
        'assets/js/bundle.js',
        'assets/js/bundle.min.js',
        'assets/css/backend.css',
        'assets/css/frontend.css',
        'assets/images/*',
        'routes/*',
        'views/*',
        'models/*',
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

// Default task
gulp.task( 'default', ['build']);
