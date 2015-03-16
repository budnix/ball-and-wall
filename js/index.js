
(function() {
    var getBrowserLang;

    getBrowserLang = function getBrowserLang() {
        var l, f = function() {
            if ( navigator.language ) {
                return navigator.language;
            }

            return navigator.browserLanguage;
        };
        l = (f() + '').toLowerCase();

        if ( l.split('-').length >= 2 && l.split('-')[0] == l.split('-')[1] ) {
            return l.split('-')[0];
        }
        
        return l;
    };
    require(['app/i18/_', 'app/core/_'], function(i18, core) {
        require(['app/_'], function(app) {
            var options = {},
                regExpEpisode = /#?episode-([a-z0-9\-]+)/,
                isChromeApp = core.helperApp.platform() == 'chrome',
                episode,
                init;

            init = function() {
                if ( i18.exists(getBrowserLang()) ) {
                    if ( !app.gameOptions.get('window-options:lang') ) {
                        app.gameOptions.set('window-options', {lang: getBrowserLang()});
                    }
                } else {
                    if ( !app.gameOptions.get('window-options:lang') || !i18.exists(app.gameOptions.get('window-options:lang')) ) {
                        app.gameOptions.set('window-options', {lang: 'en-us'});
                    }
                }
                if ( location.hash.match(regExpEpisode) ) {
                    episode = location.hash.match(regExpEpisode)[1];
                    location.hash = '';

                    if ( EPISODES.indexOf(episode) !== -1 ) {
                        app.gameOptions.set('window-games', {game: episode});
                    }
                }
                i18.setLanguage(app.gameOptions.get('window-options:lang'));
                app.preloader.showIndicator();

                if ( core.storageGlobal.get('level') ) {
                    options.customLevel = core.storageGlobal.get('level');
                }
                new app.Game(options);

                if ( !app.gameOptions.get('window-options:cookieInfo') ) {
                    $([
                        '<div id="cookie">',
                            i18._(isChromeApp ? 'usage-data-info' : 'cookie-info'),
                        '</div>'
                    ].join('')).appendTo(document.body).find('.btn').on('click', function(event) {
                        event.preventDefault();

                        app.gameOptions.set('window-options', {cookieInfo: true});
                        $(event.target).parents('#cookie').remove();
                    });
                }
                // fork me
                $('.fork-me').show();
            };

            if ( app.gameOptions.isLoaded() ) {
                init();
            } else {
                app.gameOptions.addListener('loaded', init);
            }
        });
    });
}());