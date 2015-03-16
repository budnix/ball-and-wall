
define('app/window/help', 
[
    'app/window/_base', 'app/core/_', 'app/i18/_', 'app/game-options', 'app/episodes/_'
],
function(WindowBase, core, i18, gameOptions, episode) {

    function Help() {
        WindowBase.call(this);
        this.name = 'help';
        this.className = 'lbx-' + this.name;
        this.showOverlay = true;
        this.options = {};
        this.initialize();
    }
    
    Help.prototype = Object.create(WindowBase.prototype, {
        constructor: {
            value: Help,
            enumerable: false
        }
    });
    
    /**
     * @method header
     */
    Help.prototype.header = function() {
        return 'Help';
    };

    /**
     * @method model
     */
    Help.prototype.model = function() {
        
        return {
            tag: 'div', className: 'info-content', childs: [
                {tag: 'div', className: 'tab-buttons', childs: [
                    {tag: 'a', html: i18._('help-tab-game-rules'), className: 'tab-selected'}
                ]},
                {tag: 'div', className: 'tab-contents game-rules', styles: {display: 'block'}, childs: [
                    {tag: 'div', className: 'row', childs: [
                        {tag: 'span', className: 'light label', html: i18._('help-game-rules-target-label')},
                        {tag: 'p', className: 'edge', html: i18._('help-game-rules-target-desc:' + gameOptions.get('window-games:game'))}
                    ]},
                    {tag: 'div', className: 'row', childs: [
                        {tag: 'span', className: 'light label', html: i18._('help-game-rules-score-label')},
                        {tag: 'p', className: 'edge', html: i18._('help-game-rules-score-desc:' + gameOptions.get('window-games:game'))}
                    ]},
                    {tag: 'div', className: 'row', childs: [
                        {tag: 'span', className: 'light label', html: i18._('help-game-rules-bonus-label')},
                        {tag: 'p', html: i18._('help-game-rules-bonus-desc:' + gameOptions.get('window-games:game'))},
                        {tag: 'ul', className: 'bonus bonus-list', childs: []}
                    ]}
                ]}
            ]
        };
    };
    
    Help.prototype.initialize = function(options) {
        WindowBase.prototype.initialize.call(this, options);
    };

    /**
     * @method open
     * @param {Object} options
     */
    Help.prototype.open = function(options) {
        WindowBase.prototype.open.call(this, options);
    };

    /**
     * @method close
     */
    Help.prototype.close = function() {
        WindowBase.prototype.close.call(this);
    };

    /**
     * @method _buildHtml
     */
    Help.prototype._buildHtml = function() {
        var preloader = require('app/preloader'),
            bonuses = [];
        
        $.each(episode.getBonuses(), function(index, value) {
            if ( episode.getBonuses()[Math.max(index - 1, 0)].name === value.name ) {
                return;
            }
            var preDesc = '', model;
            
            if ( value.name != 'score' ) {
                preDesc = core.utilsString.substitute(
                        i18._('help-game-rules-bonus-' + (value.score > 0 ? 'add' : 'subtract')), {
                            score: Math.abs(value.score)
                        });
                preDesc += ' ';
            }
            model = {tag: 'li', childs: [
                {tag: 'img', className: 'preview', src: preloader.get('c-bonus-' + value.name).src},
                {tag: 'span', className: 'desc', html: preDesc 
                            + core.utilsString.substitute(i18._('help-game-rules-bonus-' + value.name), value)}
            ]};
            bonuses.push(model);
        });
        this.workingModel.childs[1].childs[2].childs[2].childs = bonuses;
        WindowBase.prototype._buildHtml.call(this);

        this.tab = new core.Tab({
            buttons: this.content.find('.tab-buttons a'),
            contents: this.content.find('.tab-contents'),
            active_tab_class: 'tab-selected'
        });

        return this;      
    };

    return Help;
});