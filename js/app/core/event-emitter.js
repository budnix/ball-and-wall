
define('app/core/event-emitter', [], function() {

    function EventEmitter() {
        this.listeners = {};
    }

    /**
     * @method addListener
     * @param {String} name
     * @param {Function} callback
     * @return {EventEmitter}
     */
    EventEmitter.prototype.addListener = function(name, callback) {
        if ( !this.listeners[name] ) {
            this.listeners[name] = [];
        }
        if ( !$.isFunction(callback) ) {
            throw new TypeError('Callback passed to addListener must by a function.');
        }
        this.listeners[name].push(callback);
        
        return this;
    };
    
    /**
     * @method removeListener
     * @param {String} name
     * @param {Function} callback
     * @return {EventEmitter}
     */
    EventEmitter.prototype.removeListener = function(name, callback) {
        if ( !this.listeners[name] ) {
            this.listeners[name] = [];
        }
        this.listeners[name] = $(this.listeners[name]).filter(function(i, fn) {
            return fn != callback;
        });
        
        return this;
    };
    
    /**
     * @method emit
     * @param {String} name
     * @param {Array|String} args
     * @return {EventEmitter}
     */
    EventEmitter.prototype.emit = function(name, args) {
        var _this = this;
        
        if ( !this.listeners[name] ) {
            this.listeners[name] = [];
        }
        $(this.listeners[name]).each(function(i, fn) {
            fn.apply(_this, $.isArray(args) ? args : [args]);
        });
        
        return this;        
    };
    
    return EventEmitter;
});