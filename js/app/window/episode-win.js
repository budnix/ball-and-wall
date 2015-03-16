
define('app/window/episode-win', 
[
    'app/window/_base', 'app/i18/_', 'app/player'
],
function(WindowBase, i18, player) {
    
    function EpisodeWin() {
        WindowBase.call(this);
        this.name = 'win-episode';
        this.className = 'lbx-episode-win';
        this.showOverlay = true;
        this.showCloseButton = false;
        this.options = {
            episode: 'space'
        };
        this.initialize();
    }
    
    EpisodeWin.prototype = Object.create(WindowBase.prototype, {
        constructor: {
            value: EpisodeWin,
            enumerable: false
        }
    });
    
    /**
     * @method header
     */
    EpisodeWin.prototype.header = function() {
        return i18._('episode-win-header').replace('{player}', player.getName());
    };
    
    /**
     * @method model
     */
    EpisodeWin.prototype.model = function() {
        var onConfirm, body;
            
        onConfirm = $.proxy(function() {
            this.close();
        }, this);
        body = i18._('episode-win-content:' + this.options.episode)
                .replace('{episode}', i18._('games-episode:' + this.options.episode));
            
        return {
            tag: 'div', className: 'tab-contents', childs: [
                {tag: 'div', className: 'body-cont default alert', html: body},
                {tag: 'div', className: 'buttons-cont', childs: [
                    {tag: 'div', className: 'medium primary btn', childs: [
                        {tag: 'a', href: '#', html: i18._('ok'), events: [{click: onConfirm}]}
                    ]}
                ]}
            ]
        };
    };
    
    /**
     * @method initialize
     * @param {Object} options
     */
    EpisodeWin.prototype.initialize = function(options) {
        WindowBase.prototype.initialize.call(this, options);
    };
    
    /**
     * @method open
     * @param {Object} data
     */
    EpisodeWin.prototype.open = function(data) {
        WindowBase.prototype.open.call(this, data);
    };
    
    return EpisodeWin;
});