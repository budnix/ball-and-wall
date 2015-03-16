
define('app/input/keyboard', 
[
    
], 
function() {
    
    var 
        /**
         * @property _keys
         * @static
         * @private
         * @type {Object}
         */
        _keys = {
            'left': false,
            'right': false,
            'up': false,
            'down': false,
            'space': false
        },
        
        /**
         * @property _getKeyName
         * @static
         * @private
         * @returns {Function}
         */
        _getKeyName;


    _getKeyName = function(keyCode) {
        if ( keyCode === 37 ) {
            return 'left';
        } else if ( keyCode === 39 ) {
            return 'right';
        } else if ( keyCode === 38 ) {
            return 'up';
        } else if ( keyCode === 40 ) {
            return 'down';
        } else if ( keyCode === 32 ) {
            return 'space';
        } else if ( keyCode === 13 ) {
            return 'enter';
        }
        
        return null;
    };
    
    function Keyboard() {
        this.initEvents();
    }
    
    /**
     * @method initEvents
     */
    Keyboard.prototype.initEvents = function() {
        var _this = this, d = $(document);

        d.bind('keydown', function(event) {
            _this.onKeyDown(event);
        });
        d.bind('keyup', function(event) {
            _this.onKeyUp(event);
        });
    };

    /**
     * @method isPressed
     * @param {String} keyName
     */
    Keyboard.prototype.isPressed = function(keyName) {
        var keyName = keyName.split('|');
        
        return keyName.filter(function(key) {
            return _keys[key];
        }).length > 0;
    };
    
    /**
     * @method onKeyDown
     * @param {Object} event
     */
    Keyboard.prototype.onKeyDown = function(event) {
        _keys[_getKeyName(event.keyCode)] = true;
    };

    /**
     * @method onKeyUp
     * @param {Object} event
     */
    Keyboard.prototype.onKeyUp = function(event) {
        _keys[_getKeyName(event.keyCode)] = false;
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Keyboard();
    }
    
    return instance;
});