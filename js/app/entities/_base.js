
define('app/entities/_base', 
[
    
], 
function() {
    
    function Base() {
        this.childs = [];
        this.index = 0;
        this.length = 0;
    }

    /**
     * @method initialize
     */
    Base.prototype.initialize = function() {

    };

    /**
     * @method create
     * @param {EntityBase} entity
     * @return {EntityBase}
     */
    Base.prototype.create = function(entity) {
        if ( !entity ) {
            return null;
        }
        this.childs.push(entity);
        this.length ++;

        return entity;
    };

    /**
     * @method destroy
     */
    Base.prototype.destroy = function() {
        $.each(this.childs, function(i, child) {
            child.destroy();
            child = null;
        });
        this.childs = [];
        this.index = 0;
        this.length = 0;
    };

    /**
     * @method getLength
     * @return {Number}
     */
    Base.prototype.getLength = function() {
        return this.length;
    };

    /**
     * @method getChilds
     * @return {Array}
     */
    Base.prototype.getChilds = function() {
        return this.childs;
    };

    /**
     * @method removeChildByIndex
     * @param {Number} index
     */
    Base.prototype.removeChildByIndex = function(index) {
        delete this.childs[index];
        this.childs.splice(index, 1);
        this.length --;
        this.index --;
        
        if ( this.length < 0 ) {
            this.length = 0;
        }
        if ( this.index < 0 ) {
            this.index = 0;
        }
    };
    
    /**
     * @method removeChild
     * @param {Entity} entity
     */
    Base.prototype.removeChild = function(entity) {
        var index = this.childs.indexOf(entity);
        
        if ( index !== -1 ) {
            this.removeChildByIndex(index);
        }
    };

    /**
     * @method reset
     * @return {Base}
     */
    Base.prototype.reset = function() {
        this.index = 0;

        return this;
    };

    /**
     * @method current
     * @return {EntityBase}
     */
    Base.prototype.current = function() {
        return this.childs[this.index];
    };

    /**
     * @method next
     * @return {EntitiesBase}
     */
    Base.prototype.next = function() {
        this.index ++;

        return this;
    };

    /**
     * @method previous
     * @return {EntitiesBase}
     */
    Base.prototype.previous = function() {
        this.index --;

        return this;
    };
    
    /**
     * @method getIndex
     * @return {Number}
     */
    Base.prototype.getIndex = function() {
        return this.index;
    };
    
    /**
     * @method setIndex
     * @param {Number} index
     * @return {EntitiesBase}
     */
    Base.prototype.setIndex = function(index) {
        this.index = index;
        
        return this;
    };
    
    return Base;
});