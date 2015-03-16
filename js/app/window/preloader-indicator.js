
define('app/window/preloader-indicator', 
[
    'app/window/_base', 'app/i18/_'
],
function(WindowBase, i18) {
    
    function PreloaderIndicator() {
        WindowBase.call(this);
        this.name = 'preloader-indicator';
        this.className = 'lbx-preloader-indicator';
        this.showOverlay = true;
        this.showMinimizeButton = false;
        this.showCloseButton = false;
        this.options = {};
        this.initialize();
    }
    
    PreloaderIndicator.prototype = Object.create(WindowBase.prototype, {
        constructor: {
            value: PreloaderIndicator,
            enumerable: false
        }
    });
    
    /**
     * @method header
     */
    PreloaderIndicator.prototype.header = function() {
        return i18._('preloader-header');
    };
    
    /**
     * @method model
     */
    PreloaderIndicator.prototype.model = function() {
        return {
            tag: 'div', className: 'tab-contents', childs: [
                {tag: 'div', className: 'body-cont', html: i18._('preloader-progress') + ': 0%'}
            ]
        };
    };
    
    /**
     * @method header
     * @param {Number} percent
     */
    PreloaderIndicator.prototype.updateProgress = function(percent) {
        if ( this.content ) {
            this.content.find('.body-cont').text(i18._('preloader-progress') + ': ' + percent + '%');
        }
    };
    
    /**
     * @method initialize
     * @param {Object} options
     */
    PreloaderIndicator.prototype.initialize = function(options) {
        WindowBase.prototype.initialize.call(this, options);
    };

    return PreloaderIndicator;
});