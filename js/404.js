
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
    if ( typeof BAW_IS_ADBLOCK !== 'undefined' ) {
        require(['app/i18/_'], function(i18) {
            require(['app/_'], function(app) {
                var init;
                
                init = function() {
                    if ( !app.gameOptions.get('window-options:lang') ) {
                        app.gameOptions.set('window-options', {lang: getBrowserLang()});
                    }
                    app.gameOptions.set('window-games', {game: 'space', showOnStartup: false});
                    i18.setLanguage(app.gameOptions.get('window-options:lang'));
                    app.preloader.showIndicator();

                    new app.Game({
                        splashscreen: '404'
                    });
                };
                
                if ( app.gameOptions.isLoaded() ) {
                    init();
                } else {
                    app.gameOptions.addListener('loaded', init);
                }
            });
        });
    } else {
        $('#a-container').hide();
        $(document.body).css('height', window.innerHeight + 'px');
        $(document.body).css('width', window.innerWidth + 'px');
        $(document.body).append($([
            '<div class="adblock-message">',
                '<div>404</div>',
            '</div>',
            '<img class="adblock-game-preview-left" src="' + SS + 'images/adblock-left.png"/>',
            '<img class="adblock-game-preview-right" src="' + SS + 'images/adblock-right.png"/>',
            '<img class="adblock-game-preview-left-bottom" src="' + SS + 'images/adblock-left-bottom.png"/>',
            '<img class="adblock-game-preview-right-bottom" src="' + SS + 'images/adblock-right-bottom.png"/>'
        ].join('')));
    }
}());