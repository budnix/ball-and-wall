
define('app/core/mediator', 
[
    'app/core/event-emitter'
], 
function(EventEmitter) {

    function Mediator() {
        EventEmitter.call(this);
    }
    
    Mediator.prototype = Object.create(EventEmitter.prototype, {
        constructor: {
            value: Mediator,
            enumerable: false
        }
    });
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Mediator();
    }
    
    return instance;
});