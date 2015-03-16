
define('app/entities/blocks', 
[
    'app/entities/_base', 'app/entity/_'
], 
function(EntitiesBase, entity) {
       
    function Blocks() {
        EntitiesBase.call(this);
        this.id = 'blocks';
        this.primaryBlocksLength = 0;
        this.initialize();
    }
    
    Blocks.prototype = Object.create(EntitiesBase.prototype, {
        constructor: {
            value: Blocks,
            enumerable: false
        }
    });
       
    /**
     * @method initialize
     */
    Blocks.prototype.initialize = function() {

    };

    /**
     * @method create
     * @param {Number} typeId
     */
    Blocks.prototype.create = function(typeId) {
        var block = EntitiesBase.prototype.create.call(this, entity.block.createNew(typeId));
    
        if ( block.isPrimary() ) {
            this.primaryBlocksLength ++;
        }
        
        return block;
    };
            
    /**
     * @method isCleared
     * @return {Boolean}
     */
    Blocks.prototype.isCleared = function() {
        return this.primaryBlocksLength === 0;
    };
    
    /**
     * @method create
     */
    Blocks.prototype.destroy = function() {
        EntitiesBase.prototype.destroy.call(this);
        this.primaryBlocksLength = 0;
    };
    
    /**
     * @method removeChildByIndex
     * @param {Number} index
     */
    Blocks.prototype.removeChildByIndex = function(index) {
        var child = this.childs[index];
        
        if ( child && child.isPrimary() ) {
            this.primaryBlocksLength --;
        }
        EntitiesBase.prototype.removeChildByIndex.call(this, index);
    };
    
    /**
     * @method update
     * @param {Object} event
     */
    Blocks.prototype.update = function(event) {
        this.reset();

        // @todo check performance
        while ( this.current() ) {
            if ( !this.current().isUpdatable(event) ) {
                this.next();
                
                continue;
            }
            this.current().update(event);
            
            if ( !this.current().isExists() ) {
                this.removeChildByIndex(this.index);
            }
            this.next();
        }
    };

    /**
     * @method updateCurrent
     * @param {Object} event
     */
    Blocks.prototype.updateCurrent = function(event) {
        var current = this.current();

        current.update(event);
        
        if ( current.isDestroyed() || !current.isExists() ) {
            this.removeChildByIndex(this.index);
        }
    };
    
    /**
     * @method updateCurrent
     * @param {EntityBase} entity
     * @param {Object} event
     */
    Blocks.prototype.updateEntity = function(entity, event) {
        this.index = this.childs.indexOf(entity);
        
        this.updateCurrent(event);
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Blocks();
    }
    
    return instance;
});