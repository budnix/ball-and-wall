
define('app/entities/bullets', 
[
    'app/entities/_base'
], 
function(EntitiesBase) {
       
    function Bullets() {
        EntitiesBase.call(this);
        this.id = 'bullets';
        this.initialize();
    }
    
    Bullets.prototype = Object.create(EntitiesBase.prototype, {
        constructor: {
            value: Bullets,
            enumerable: false
        }
    });
       
    /**
     * @method initialize
     */
    Bullets.prototype.initialize = function() {

    };

    /**
     * @method create
     * @param {Object} options
     */
    Bullets.prototype.create = function(options) {
        var bullet = EntitiesBase.prototype.create.call(this, require('app/entity/bullet').createNew(options));
        
        bullet.addToStage();
        
        return bullet;
    };
            
    /**
     * @method update
     * @param {Object} event
     */
    Bullets.prototype.update = function(event) {
        this.reset();

        while ( this.current() ) {
            this.current().update(event);
            
            if ( !this.current().isExists() ) {
                this.removeChildByIndex(this.index);
            }
            this.next();
        }
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Bullets();
    }
    
    return instance;
});