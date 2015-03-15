
define('app/window/games',
[
    'app/window/_base', 'app/core/_', 'app/game-options', 'app/i18/_'
],
function(WindowBase, core, gameOptions, i18) {

    function Games() {
        WindowBase.call(this);
        this.name = 'games';
        this.className = 'lbx-games';
        this.showOverlay = true;
        this.options = $.extend({
            isCustom: false,
            game: 'space',
            showOnStartup: true
        }, gameOptions.get('window-' + this.name) || {});
        this.selectedGame = this.options.game;
        this.initialize();
    }
    
    Games.prototype = Object.create(WindowBase.prototype, {
        constructor: {
            value: Games,
            enumerable: false
        }
    });

    /**
     * @method header
     */
    Games.prototype.header = function() {
        return i18._('games-header');
    };

    /**
     * @method model
     */
    Games.prototype.model = function() {
        var adsTarget = 'games' + (core.helperAds.getScreenClass() == 'big' ? '_728x90' : ''),
            onPlayClick = $.proxy(this.onPlayClick, this),
            adsContainer;

        if ( core.helperApp.platform() == 'chrome' ) {
            adsContainer = {tag: 'webview', src: API_ADDR + 'ads-chrome.html/' + adsTarget};
        } else {
            adsContainer = {tag: 'iframe', src: API_ADDR + 'ads-web.html/' + adsTarget,
                scrolling: 'no', frameborder: '0', vspace: '0', marginheight: '0', marginwidth: '0',
                hspace: '0', allowtransparency: 'true'};
        }

        return {
            tag: 'div', className: 'games-wrapper', childs: [
                {tag: 'div', className: 'games-window', childs: []},
                {tag: 'div', className: 'option-item show-on-start checkbox', childs: []},
                {tag: 'div', className: 'ads ads-' + core.helperAds.getScreenClass(), childs: [
                    core.helperAds.isOn() ? {tag: 'div', className: 'ads-label', html: 'advertisement'} : {},
                    core.helperAds.isOn() ? adsContainer : {}
                ]},
                {tag: 'div', className: 'game-button-cont', styles: core.helperAds.isOn() ? {} : {marginTop: 24, paddingBottom: 44}, 
                    childs: [{tag: 'div', className: 'medium primary btn icon-right icon-arrow-right ' + 
                                    (this.options.game == 'pegasus' ? 'warning' : ''), childs: [
                        {tag: 'a', href: '#', html: i18._('games-start-game'), events: [{click: onPlayClick}]}
                    ]}
                ]}
            ]
        };
    };

    /**
     * @property games
     * @type {Array}
     */
    Games.prototype.games = [
        {
            type: 'radio', 
            id: 'game', 
            items: [
                {
                    name: function() {return i18._('games-episode:space');}, 
                    desc: function() {return i18._('games-episode-desc:space');}, 
                    fontColorClass: 'font-white',
                    value: 'space',
                    disabled: false
                },
                {
                    name: function() {return i18._('games-episode:pegasus');}, 
                    desc: function() {return i18._('games-episode-desc:pegasus');}, 
                    value: 'pegasus',
                    fontColorClass: 'font-brown',
                    disabled: false
                }
            ]
        }
    ];

    Games.prototype.initialize = function(options) {
        WindowBase.prototype.initialize.call(this, options);
        
        if ( !this.options.isCustom ) {
            this.addListener('change', $.proxy(function(key, value) {
                this.options[key] = value;
                
                gameOptions.set('window-' + this.name, {
                    game: this.options.game,
                    showOnStartup: this.options.showOnStartup
                });
            }, this));
        }
    };

    /**
     * @method onOptionClick
     * @param {DOMEvent} event
     */
    Games.prototype.onOptionClick = function(event) {
        var clicked, item, value;

        clicked = $(event.target);
        
        if ( !clicked.hasClass('option-item') ) {
            item = clicked.parents('.option-item');
        }
        if ( !clicked.hasClass('option-item-entry') ) {
            clicked = clicked.parents('.option-item-entry');
        }
        event.preventDefault();

        if ( item.hasClass('radio') ) {
            item.children().each($.proxy(function(i, element) {
                var gameName;
                
                element = $(element);
                gameName = element.find('.game-name');
                element.removeClass('selected');
                
                if ( element.context == clicked[0] ) {
                    element.addClass('selected');
                    value = clicked.attr('data-item').split('|')[1];
                    
                    if ( clicked.attr('data-item').split('|')[0] == 'game' ) {
                        gameName.text(i18._('games-episode:' + value) + ' (' + i18._('selected') + ')');
                        this.selectedGame = value;
                        
                        if ( !this.options.isCustom ) {
                            this.emit('change', ['game', value]);
                        }
                    }
                } else {
                    gameName.text(i18._('games-episode:' + element.attr('data-item').split('|')[1]));
                }
            }, this));
        }
        if ( item.hasClass('checkbox') ) {
            if ( clicked.hasClass('selected') ) {
                clicked.removeClass('selected');
                value = 0;
            } else {
                clicked.addClass('selected');
                value = 1;
            }
            if ( !this.options.isCustom ) {
                this.emit('change', ['showOnStartup', value]);
            }
        }
    };

    /**
     * @method onPlayClick
     * @param {Object} event
     */
    Games.prototype.onPlayClick = function(event) {
        event.preventDefault();
        this.play();
    };
    
    /**
     * @method play
     */
    Games.prototype.play = function() {
        if ( this.options.isCustom ) {
            location.assign('/#episode-' + (this.selectedGame || this.options.game));
        } else {
            this.close();
            this.emit('selectEpisode', [this.selectedGame || this.options.game]);   
        }
    };

    /**
     * @method open
     * @param {Object} options
     */
    Games.prototype.open = function(options) {
        WindowBase.prototype.open.call(this, options);
        this.setScrollableContent('.games-window');
        this.selectedGame = this.options.game;

        if ( core.helperApp.platform() == 'chrome' ) {
            document.querySelector('webview').addEventListener('newwindow', function(event) {
                event.preventDefault();
                window.open(event.targetUrl);
            });
        }
    };

    /**
     * @method close
     * @param {Object} options
     */
    Games.prototype.close = function(options) {
        WindowBase.prototype.close.call(this, options);
    };

    /**
     * @method _buildHtml
     */
    Games.prototype._buildHtml = function() {
        var model, className;

        $.each(this.games, $.proxy(function(i, game) {
            model = {tag: 'div', className: 'option-item ' + game.type, childs: []};
            
            $.each(game.items, $.proxy(function(i, item) {
                if ( game.type == 'checkbox' ) {
                    className = this.options[game.id] ? 'selected' : '';
                } else {
                    className = this.options[game.id] == item.value ? 'selected' : '';
                }
                var _text = item.name(), _desc;
                _desc = item.desc().substr(0, 150) + ' ... ';

                if ( item.disabled ) {
                    _text += ' (' + i18._('soon') + ')';
                    _desc = '';
                }
                if ( className == 'selected' ) {
                    _text = _text + ' (' + i18._('selected') + ')';
                }
                
                model.childs.push(
                    {tag: 'a', 'data-item': game.id + '|' + item.value,
                        className: 'option-item-entry ' + className + (item.disabled ? ' disabled ' : ' '),
                        events: [{click: item.disabled ? function(e){e.preventDefault();} : $.proxy(this.onOptionClick, this)}],
                        childs: [
                            {tag: 'img', className: 'game-preview', 
                                src: SS + 'images/games/' + item.value + '/episode' + (core.helperApp.pixelRatio() >= 2 ? '@2x' : '') + '.png'},
                            {tag: 'img', className: 'levels-preview', 
                                src: SS + 'images/games/' + item.value + '/episode-levels-preview' + (core.helperApp.pixelRatio() >= 2 ? '@2x' : '') + '.png'},
                            {tag: 'span', className: 'game-name ' + item.fontColorClass, html: _text}
                        ]
                    }
                );
            }, this));
            this.workingModel.childs[0].childs.push(model);
        }, this));

        this.workingModel.childs[1].childs.push({tag: 'a', 
            className: 'option-item-entry min ' + (this.options.showOnStartup ? 'selected' : ''), 
            events: [{click: $.proxy(this.onOptionClick, this)}],
            html: i18._('games-show-on-startup')});

        WindowBase.prototype._buildHtml.call(this);
    };

    return Games;
});