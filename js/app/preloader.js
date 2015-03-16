
define('app/preloader', 
[
    'app/core/_', 'app/window/_', 'app/episodes/_'
], 
function(core, _window, episode) {
    
    function Preloader() {
        core.EventEmitter.call(this);
        this.preloaderTimer = null;
        this.preloaderIndicator = new _window.PreloaderIndicator();
    }
    
    Preloader.prototype = Object.create(core.EventEmitter.prototype, {
        constructor: {
            value: Preloader,
            enumerable: false
        }
    });
    
    /**
     * @method get
     * @param {String} resourceId
     * @return {Image}
     */
    Preloader.prototype.get = function(resourceId) {
        return this.queue.getResult(resourceId);
    };
    
    /**
     * @method load
     */
    Preloader.prototype.load = function() {
        episode.load($.proxy(function() {
            var link = document.createElement('link');
            
            createjs.Sound.alternateExtensions = ['mp3'];
            this.queue = new createjs.LoadQueue(false);
            this.queue.installPlugin(createjs.Sound);
            this.queue.addEventListener('complete', $.proxy(this.onComplete, this));
            this.queue.addEventListener("progress", $.proxy(this.onProgress, this));
            this.queue.addEventListener("loadstart", $.proxy(this.onLoadStart, this));
            this.queue.loadManifest(episode.getResources());
            $('#css-episode').remove();

            link.rel = 'stylesheet';
            link.href = SS + 'css/episodes/' + episode.getName() + '.css' + REVISION;
            link.type = 'text/css';
            link.id = 'css-episode';
            link.media = 'screen';
            $(document.head).append(link);
        }, this));
    };
    
    /**
     * @method showIndicator
     */
    Preloader.prototype.showIndicator = function() {
        this.preloaderIndicator.open();
    };
    
    /**
     * @method hideIndicator
     */
    Preloader.prototype.hideIndicator = function() {
        this.preloaderIndicator.close();
    };
    
    /**
     * @method onLoadStart
     * @param {Object} event
     */
    Preloader.prototype.onLoadStart = function(event) {
        this.showIndicator();
        this.emit('loadstart');
    };
    
    /**
     * @method onProgress
     * @param {Object} event
     */
    Preloader.prototype.onProgress = function(event) {
        this.preloaderIndicator.updateProgress((event.loaded * 100) >> 0);
        this.emit('progress', event.loaded);
    };
    
    /**
     * @method onComplete
     * @param {Object} event
     */
    Preloader.prototype.onComplete = function(event) {
        this.hideIndicator();
        this.emit('complete');
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Preloader();
    }
    
    return instance;
});