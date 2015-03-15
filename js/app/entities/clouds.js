
define('app/entities/clouds', 
[
    'app/entities/_base'
], 
function(EntitiesBase) {
       
    function Clouds() {
        EntitiesBase.call(this);
        this.id = 'clouds';
        this.initialize();
    }
    
    Clouds.prototype = Object.create(EntitiesBase.prototype, {
        constructor: {
            value: Clouds,
            enumerable: false
        }
    });
       
    /**
     * @method initialize
     */
    Clouds.prototype.initialize = function() {

    };

    /**
     * @method create
     * @param {String|Number} score
     * @param {Object} options
     */
    Clouds.prototype.create = function(score, options) {
        var entity = EntitiesBase.prototype.create.call(this, require('app/entity/cloud').createNew(score, options));
        
        entity.addToStage();
        
        return entity;
    };
    
    /**
     * @method update
     * @param {Object} event
     */
    Clouds.prototype.update = function(event) {
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
        instance = new Clouds();
    }
    
    return instance;
});