
define('app/window/rounds',
[
    'app/window/_base', 'app/core/_', 'app/game-options', 'app/i18/_'
],
function(WindowBase, core, gameOptions, i18) {

    function Rounds() {
        WindowBase.call(this);
        this.name = 'rounds';
        this.className = 'lbx-rounds';
        this.showOverlay = true;
        this.options = {
            game: 'space',
            levels: []
        };
        this.selectedLevel = 0;
        this.initialize();
    }
    
    Rounds.prototype = Object.create(WindowBase.prototype, {
        constructor: {
            value: Rounds,
            enumerable: false
        }
    });

    /**
     * @method header
     */
    Rounds.prototype.header = function() {
        return i18._('rounds-header');
    };

    /**
     * @method model
     */
    Rounds.prototype.model = function() {
        var adsTarget = 'games' + (core.helperAds.getScreenClass() == 'big' ? '_728x90' : ''),
            onPlayClick = $.proxy(this.onPlayClick, this),
            onBackClick = $.proxy(this.onBackClick, this),
            onRoundsScroll = $.proxy(this.onRoundsScroll, this),
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
                {tag: 'div', className: 'games-window', childs: [], events: [{scroll: onRoundsScroll}]},
                {tag: 'div', className: 'ads ads-' + core.helperAds.getScreenClass(), childs: [
                    core.helperAds.isOn() ? {tag: 'div', className: 'ads-label', html: 'advertisement'} : {},
                    core.helperAds.isOn() ? adsContainer : {}
                ]},
                {tag: 'div', className: 'row buttons', styles: core.helperAds.isOn() ? {} : {marginTop: 24, paddingBottom: 44}, 
                    childs: [
                        EPISODES.length > 1 ? {tag: 'div', className: 'medium primary btn icon-left icon-arrow-left ' + 
                                    (this.options.game == 'pegasus' ? 'warning' : ''), childs: [
                            {tag: 'a', href: '#', html: i18._('rounds-choose-episode'), events: [{click: onBackClick}]}
                        ]} : {},
                        {tag: 'div', className: 'medium secondary btn icon-right icon-arrow-right', childs: [
                            {tag: 'a', href: '#', html: i18._('rounds-choose-round'), events: [{click: onPlayClick}]}
                        ]}
                ]}
            ]
        };
    };

    Rounds.prototype.initialize = function() {
        WindowBase.prototype.initialize.call(this);
    };

    /**
     * @method open
     * @param {Object} options
     */
    Rounds.prototype.open = function(options) {
        this.unlockLevel(options.game, 0);
        this.unlockLevel(options.game, 1);
        WindowBase.prototype.open.call(this, options);
        this.setScrollableContent('.games-window');
        
        if ( core.helperApp.platform() == 'chrome' ) {
            document.querySelector('webview').addEventListener('newwindow', function(event) {
                event.preventDefault();
                window.open(event.targetUrl);
            });
        }
//        for ( var i = 0; i < 50; i++ ) {
//            this.unlockLevel(this.options.game, i);
//        }
    };

    /**
     * @method close
     * @param {Object} options
     */
    Rounds.prototype.close = function(options) {
        WindowBase.prototype.close.call(this, options);
    };
    
    /**
     * @method unlockLevel
     * @param {String} episode
     * @param {Number} round
     */
    Rounds.prototype.unlockLevel = function(episode, round) {
        var data = gameOptions.get('window-' + this.name, {});
        
        if ( !data[episode] ) {
            data[episode] = [];
        }
        data[episode][round] = 1;
        gameOptions.set('window-' + this.name, data);
    };
    
    /**
     * @method loadSelectedLevel
     * @return {Number}
     */
    Rounds.prototype.loadSelectedLevel = function() {
        return gameOptions.get('window-' + this.name + '-' + this.options.game + ':selectedLevel') >> 0;
    };
    
    /**
     * @method saveSelectedLevel
     */
    Rounds.prototype.saveSelectedLevel = function() {
        gameOptions.set('window-' + this.name + '-' + this.options.game, {selectedLevel: this.selectedLevel});
    };
    
    /**
     * @method onOptionClick
     * @param {DOMEvent} event
     */
    Rounds.prototype.onOptionClick = function(event) {
        var clicked, itemEntry;

        clicked = $(event.target);
        
        if ( !clicked.hasClass('option-item-entry') ) {
            itemEntry = clicked.parents('.option-item-entry');
        } else {
            itemEntry = clicked;
        }
        if ( !clicked.hasClass('option-item') ) {
            clicked = clicked.parents('.option-item');
        }
        event.preventDefault();
        
        if ( itemEntry.hasClass('disabled') ) {
            return;
        }

        clicked.find('a.option-item-entry').each($.proxy(function(i, element) {
            element = $(element);
            element.removeClass('selected');
            
            if ( element.context == itemEntry.get(0) ) {
                element.addClass('selected');
                this.selectedLevel = itemEntry.attr('data-id') >> 0;
                this.saveSelectedLevel();
            }
        }, this));
    };

    /**
     * @method onPlayClick
     * @param {Object} event
     */
    Rounds.prototype.onPlayClick = function(event) {
        event.preventDefault();
        this.close();
        this.emit('play', {episode: this.options.game, level: this.selectedLevel});
    };
    
    /**
     * @method onBackClick
     * @param {Object} event
     */
    Rounds.prototype.onBackClick = function(event) {
        event.preventDefault();
        this.close();
        this.emit('back');
    };
    
    /**
     * @method onRoundsScroll
     * @param {Object} event
     */
    Rounds.prototype.onRoundsScroll = function(event) {
//        var scrollTop = this.content.find('.games-window').scrollTop();
//        core.mediator.emit('');
    };

    /**
     * @method _buildHtml
     */
    Rounds.prototype._buildHtml = function() {
        var unlockData = gameOptions.get('window-' + this.name, {}),
            model, unlocked;

        this.selectedLevel = this.loadSelectedLevel();
        model = {tag: 'ul', className: 'option-item four_up tiles', childs: []};
        unlockData = unlockData[this.options.game] || [];
        
        $.each(this.options.levels, $.proxy(function(i, name) {
            var levelPreview, lockPreview;
            
            unlocked = unlockData[i];
            levelPreview = SS + 'images/games/' + this.options.game + 
                                        '/' + i + (core.helperApp.pixelRatio() >= 2 ? '@2x' : '') + '.jpg';
            lockPreview = SS + 'images/games/locked' + (core.helperApp.pixelRatio() >= 2 ? '@2x' : '') + '.jpg';
            model.childs.push(
                {tag: 'li', childs: [
                    {tag: 'a', 'data-id': i,
                        className: 'option-item-entry ' + (i === this.selectedLevel ? 'selected' : '') + 
                                (unlocked ? '' : 'disabled'),
                        events: [{click: $.proxy(this.onOptionClick, this)}],
                        childs: [
                            {tag: 'img', className: 'round-preview', src: unlocked ? levelPreview : lockPreview},
                            {tag: 'span', className: 'round-name', html: '&nbsp;' + (i + 1) + ') ' + name + ''}
                        ]
                    }
                ]}
            );
        }, this));
        this.workingModel.childs[0].childs.push(model);

        WindowBase.prototype._buildHtml.call(this);
    };

    return Rounds;
});