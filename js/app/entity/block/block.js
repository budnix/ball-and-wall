
define('app/entity/block/block', 
[
    'app/entity/block/_base', 'app/episodes/_'
], 
function(BaseBlock, episode) {
        
    function Block() {
        BaseBlock.call(this);
        this.id = 'block';
    }    
    
    Block.prototype = Object.create(BaseBlock.prototype, {
        constructor: {
            value: Block,
            enumerable: false
        }
    });

    /**
     * @method create
     * @param {Number} typeId
     * @return {Block}
     */
    Block.prototype.create = function(typeId) {
        this.init(typeId);
        
        return this;
    };
    
    /**
     * @method createNew
     * @param {Number} typeId
     * @return {Block}
     */
    Block.prototype.createNew = function(typeId) {
        var types = episode.getBlocks(), 
            block;
    
        if ( types[typeId].entity ) {
            block = require('app/entity/block/' + types[typeId].entity).createNew({type: $.extend(types[typeId], {id: typeId})});
        } else {
            block = new Block();
            block.init(typeId);
        }
        
        return block;
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Block();
    }
    
    return instance;
});