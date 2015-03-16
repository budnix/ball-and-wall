
define('app/game-options', 
[
    'app/core/_', 'app/episodes/_'
], 
function(core, episode) {
    
    var 
        /**
         * @property _FPS
         * @type {Number}
         * @static
         */
        _FPS = 60,
                
        /**
         * @property _fpsRatio
         * @type {Number}
         * @static
         */
        _fpsRatio = 0,
               
        /**
         * @property _options
         * @type {Object}
         * @static
         */
        _options = {},
        
        /**
         * @property _defaults
         * @type {Object}
         * @static
         */
        _defaults = {
            'window-games': {
                showOnStartup: true,
                game: 'space'
            },
            'window-options': {
                music: 'on',
                sound: 'on',
                lang: null,
                fps: _FPS,
                cookieInfo: false
            },
            'window-first-time': {
                needToShow: true
            },
            'window-rounds': {
                'data': []
            },
            'level-editor': {
                episode: 'space'
            },
            'player': {
                ac: null,
                name: null,
                social: null,
                hash: null
            },
            'stats-filter': {
                episodeType: 'all-episodes',
                sortType: 'created-desc',
                timeRangeType: 'all-time'
            }
        };
    
    
    function GameOptions() {
        core.EventEmitter.call(this);
        this.storage = new core.StorageLocal('game-options');
        this.optionsLoaded = false;
        this.initEvents();
        
//        if ( core.helperBrowser.name == 'chrome' || core.helperBrowser.name == 'safari' ) {
            _defaults['window-options'].fps = 60;
//        } else {
//            _defaults['window-options'].fps = 30;
//        }
        this.storage.get().then($.proxy(function(data) {
            _options = $.extend(_defaults, JSON.parse(data || '{}'));
            this.emit('loaded');
        }, this));
    }
    
    GameOptions.prototype = Object.create(core.EventEmitter.prototype, {
        constructor: {
            value: GameOptions,
            enumerable: false
        }
    });
    
    GameOptions.prototype.initEvents = function() {
        this.addListener('loaded', $.proxy(this.onLoaded, this));
    };
    
    /**
     * @method get
     * @param {String} key
     * @param {*} def
     * @return {*}
     */
    GameOptions.prototype.get = function(key, def) {
        var keys, value;
    
        if ( key == 'fps_ratio' ) {
            return _fpsRatio;
        }
        if ( key == 'fps' ) {
            return _FPS;
        }
        keys = key.split(':');
        value = _options[keys[0]];
        
        if ( keys.length > 1 && value ) {
            value = value[keys[1]];
        }
        
        return value === null || value === undefined ? def : value;
    };
    
    /**
     * @method set
     * @param {String} key
     * @param {*} value
     * @return {GameOptions}
     */
    GameOptions.prototype.set = function(key, value) {
        var prevValue = $.extend({}, this.get(key));
        
        if ( $.isPlainObject(value) ) {
            _options[key] = $.extend(this.get(key, {}), value);
        } else {
            return;
//            _options[key] = JSON.parse(value);
        }
        if ( this.get('window-options:fps') != _FPS ) {
            _FPS = this.get('window-options:fps');
        }
        if ( key == 'window-games' ) {
            episode.use(this.get('window-games:game'));
        }
        this.emit('change:' + key, [value, prevValue]);
        this.storage.set(JSON.stringify(_options));
        
        return this;
    };
    
    /**
     * @method isLoaded
     * @return {Boolean}
     */
    GameOptions.prototype.isLoaded = function() {
        return this.optionsLoaded;
    };
    
    /**
     * @method onLoaded
     */
    GameOptions.prototype.onLoaded = function() {
        this.optionsLoaded = true;
        _fpsRatio = 60 / (this.get('window-options:fps') >> 0);
        episode.use(this.get('window-games:game'));
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new GameOptions();
    }
    
    return instance;
});