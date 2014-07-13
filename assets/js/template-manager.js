var fs = require( 'fs' );

// Client side templates (made inline via Browserify)
function TemplateManager( $templateCache ) {
    var t = $templateCache;
    t.put( 'bets.html',             fs.readFileSync( __dirname + '/templates/bets.html',            'utf-8' ) );
    t.put( 'groups.html',           fs.readFileSync( __dirname + '/templates/groups.html',          'utf-8' ) );
    t.put( 'group.html',            fs.readFileSync( __dirname + '/templates/group.html',           'utf-8' ) );
    t.put( 'profile.html',          fs.readFileSync( __dirname + '/templates/profile.html',         'utf-8' ) );
    t.put( 'change-password.html',  fs.readFileSync( __dirname + '/templates/change-password.html', 'utf-8' ) );
    t.put( 'create-group.html',     fs.readFileSync( __dirname + '/templates/create-group.html',    'utf-8' ) );
    t.put( 'edit-bet.html',         fs.readFileSync( __dirname + '/templates/edit-bet.html',        'utf-8' ) );
    t.put( 'game.html',             fs.readFileSync( __dirname + '/templates/game.html',            'utf-8' ) );
    t.put( 'join-group.html',       fs.readFileSync( __dirname + '/templates/join-group.html',      'utf-8' ) );
    t.put( 'leave-group.html',      fs.readFileSync( __dirname + '/templates/leave-group.html',     'utf-8' ) );
    t.put( 'password.html',         fs.readFileSync( __dirname + '/templates/password.html',        'utf-8' ) );
    t.put( 'place-bet.html',        fs.readFileSync( __dirname + '/templates/place-bet.html',       'utf-8' ) );
    t.put( 'round.html',            fs.readFileSync( __dirname + '/templates/round.html',           'utf-8' ) );
    t.put( 'toplist.html',          fs.readFileSync( __dirname + '/templates/toplist.html',         'utf-8' ) );
    t.put( 'specialbet.html',       fs.readFileSync( __dirname + '/templates/specialbet.html',      'utf-8' ) );
}

TemplateManager.$inject = ['$templateCache'];

module.exports = TemplateManager;
