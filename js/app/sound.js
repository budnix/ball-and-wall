
define('app/sound', 
[
    'app/core/_', 'app/game-options'
], 
function(core, gameOptions) {

    var 
        /**
         * @property _disabledSounds
         * @static
         * @private
         * @type {Boolean}
         */
        _disabledSounds = false,
                
        /**
         * @property _disabledMusic
         * @static
         * @private
         * @type {Boolean}
         */
        _disabledMusic = false,
                
        /**
         * @property _loopSounds
         * @static
         * @private
         * @type {Object}
         */
        _loopSounds = {},
        
        /**
         * @property _playMusicTimer
         * @static
         * @private
         * @type {Number}
         */
        _playMusicTimer = null,
        
        /**
         * @property _stopMusicTimer
         * @static
         * @private
         * @type {Number}
         */
        _stopMusicTimer = null;
    
    
    function Sound() {
        core.EventEmitter.call(this);
        this.initEvents();
    }
    
    Sound.prototype = Object.create(core.EventEmitter.prototype, {
        constructor: {
            value: Sound,
            enumerable: false
        }
    });
    
    /**
     * @method initEvents
     */
    Sound.prototype.initEvents = function() {
        gameOptions.addListener('change:window-options', $.proxy(this.onWindowOptionsChange, this));
        gameOptions.addListener('loaded', $.proxy(this.onWindowOptionsLoaded, this));
    };
    
    /**
     * @method play
     * @param {String} sound
     * @param {Number} delay Optional
     */
    Sound.prototype.play = function(sound, delay) {
        if ( this.isSoundsDisabled() || core.helperApp.platform() == 'wp8' ) {
            return;
        }
        // TODO Temp - Four different sounds for 'space' episode
        if ( sound == 'block-hit' && gameOptions.get('window-games:game') == 'space' ) {
            sound = sound + '-' + (Math.ceil(Math.random() * 4) || 1);
        }
        createjs.Sound.play('s-' + sound, {
            interrupt: createjs.Sound.INTERRUPT_ANY,
            delay: delay || 0
        });
    };
    
    /**
     * @method stop
     * @param {String} sound
     */
    Sound.prototype.stop = function(sound) {
        createjs.Sound.stop('s-' + sound);
    };
    
    /**
     * @method playMusic
     */
    Sound.prototype.playMusic = function() {
        var volume = 0;

        if ( this.isMusicDisabled() || core.helperApp.platform() == 'wp8' ) {
            return;
        }
        clearInterval(_stopMusicTimer);
        clearInterval(_playMusicTimer);
        
        if ( !_loopSounds.music ) {
            _loopSounds.music = createjs.Sound.play('s-music', {
                interrupt: createjs.Sound.INTERRUPT_ANY,
                loop: -1,
                volume: 0
            });
        } else {
            volume = _loopSounds.music.volume * Math.PI / 2;
        }
        
        _playMusicTimer = setInterval(function() {
            volume = volume + 0.05;
            _loopSounds.music.volume = Math.sin(volume);
            
            if ( volume >= Math.PI / 2 ) {
                clearInterval(_playMusicTimer);
            }
        }, 150);
    };
    
    /**
     * @method stopMusic
     * @param {Boolean} immediately
     */
    Sound.prototype.stopMusic = function(immediately) {
        var volume = 0;

        if ( !_loopSounds.music ) {
            return;
        }
        clearInterval(_stopMusicTimer);
        clearInterval(_playMusicTimer);
        
        if ( immediately ) {
            _loopSounds.music.stop();
            _loopSounds.music = null;
            
            return;
        }
        volume = _loopSounds.music.volume * Math.PI / 2;
        
        _stopMusicTimer = setInterval(function() {
            volume = volume - 0.05;
            _loopSounds.music.volume = Math.sin(volume);
            
            if ( volume <= 0 ) {
                clearInterval(_stopMusicTimer);
                _loopSounds.music.stop();
                _loopSounds.music = null;
            }
        }, 150);
    };
    
    /**
     * @method isSoundsDisabled
     * @return {Boolean}
     */
    Sound.prototype.isSoundsDisabled = function() {
        return _disabledSounds;
    };
    
    /**
     * @method isSoundsDisabled
     * @return {Boolean}
     */
    Sound.prototype.isMusicDisabled = function() {
        return _disabledMusic;
    };
    
    /**
     * @method disableSounds
     * @param {Boolean} flag
     */
    Sound.prototype.disableSounds = function(flag) {
        _disabledSounds = flag;
    };
    
    /**
     * @method disableMusic
     * @param {Boolean} flag
     */
    Sound.prototype.disableMusic = function(flag) {
        _disabledMusic = flag;
    };
    
    /**
     * Reset sounds and music setting. Init state by user window options settings.
     * 
     * @method resetSettings
     */
    Sound.prototype.resetSettings = function() {
        _disabledSounds = gameOptions.get('window-options:sound') === 'off';
        _disabledMusic = gameOptions.get('window-options:music') === 'off';
    };
    
    /**
     * @method onWindowOptionsChange
     * @param {Object} options
     */
    Sound.prototype.onWindowOptionsChange = function(options) {
        this.disableSounds(options.sound === 'off');
        this.disableMusic(options.music === 'off');
        
        if ( this.isMusicDisabled() ) {
            this.stopMusic(true);
        }
    };
    
    /**
     * @method onWindowOptionsLoaded
     */
    Sound.prototype.onWindowOptionsLoaded = function() {
        this.disableSounds(gameOptions.get('window-options:sound') === 'off');
        this.disableMusic(gameOptions.get('window-options:music') === 'off');
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Sound();
    }
    
    return instance;
});