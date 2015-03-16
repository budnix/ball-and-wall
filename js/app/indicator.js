
define('app/indicator', [], function() {

    var 
        /**
         * @property _timer
         * @type {Number}
         * @static
         * @private
         */
        _timer = null,
    
        /**
         * @property indicator
         * @type {Element}
         * @static
         * @private
         */
        _indicator = null,

        /**
         * @property showed
         * @type {Boolean}
         * @static
         * @private
         * @default false
         */
        _showed = false,
        
        /**
         * @property _height
         * @type {Number}
         * @static
         * @private
         * @default 0
         */
        _height = 0,

        /**
         * @property options
         * @type {Object}
         * @static
         * @private
         */
        _options = {
            element: '#indicator-container',
            duration: 500,
            reaction_delay: 100
        };


    function Indicator() {
        _indicator = $(_options.element);
        _height = _indicator.outerHeight();
    }
    
    /**
     * @method show
     */
    Indicator.prototype.show = function() {
        if ( _timer !== null ) {
            return;
        }
        _timer = setTimeout(function() {
            _showed = true;
            _indicator.animate({top: 0}, _options.duration);
        }, _options.reaction_delay);
    };
    
    /**
     * @method hide
     */
    Indicator.prototype.hide = function() {
        if ( _showed ) {
            setTimeout(function() {
                _indicator.animate({top: - (_height * 2)}, _options.duration);
            }, 1000);
        }
        clearTimeout(_timer);
        _timer = null;
        _showed = false;
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Indicator();
    }
    
    return instance;
});