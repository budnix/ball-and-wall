
define('app/entity/block/_base', 
[
    'app/entity/_base', 'app/preloader', 'app/episodes/_'
], 
function(Base, preloader, episode) {
        
    function BlockBase() {
        Base.call(this);
        this.id = 'block-base';
        this.type = {};
        this.typeId = null;
        this.destroyed = false;
        this.hits = 0;
        this.life = 1;
    }    
    
    BlockBase.prototype = Object.create(Base.prototype, {
        constructor: {
            value: BlockBase,
            enumerable: false
        }
    });

    /**
     * @method init
     * @param {Number} typeId
     */
    BlockBase.prototype.init = function(typeId) {
        var types = episode.getBlocks();
        
        if ( !types[typeId] ) {
            return;
        }
        this.type = types[typeId];
        this.typeId = typeId;
        
        if ( this.type.animation ) {
            this.type.animation.images = [
                preloader.get('c-block-' + this.type.texture + '-anim')
            ];
            var ss = new createjs.SpriteSheet(this.type.animation);
            Base.prototype.init.call(this, new createjs.BitmapAnimation(ss));
        } else {
            Base.prototype.init.call(this, 
                    new createjs.Bitmap(preloader.get('c-block-' + this.type.texture).src));
        }
        this.setLayerId(400);
    };

    /**
     * @method hit
     */
    BlockBase.prototype.hit = function() {
        this.hits ++;
    };

    /**
     * @method getTypeId
     * @return {Number}
     */
    BlockBase.prototype.getTypeId = function() {
        return this.typeId;
    };
    
    /**
     * @method getTexture
     * @return {String}
     */
    BlockBase.prototype.getTexture = function() {
        return this.type.texture;
    };
    
    /**
     * @method getScore
     * @return {Number}
     */
    BlockBase.prototype.getScore = function() {
        return this.type.score;
    };

    /**
     * @method getHardness
     * @return {Number}
     */
    BlockBase.prototype.getHardness = function() {
        return this.type.hardness;
    };
    
    /**
     * @method getAvailability
     * @return {Number|null}
     */
    BlockBase.prototype.getAvailability = function() {
        return this.type.availability || null;
    };
    
    /**
     * @method getHitSound
     * @return {String|null}
     */
    BlockBase.prototype.getHitSound = function() {
        return this.type.sound;
    };

    /**
     * @method isDestroyable
     * @return {Boolean}
     */
    BlockBase.prototype.isDestroyable = function() {
        return this.type.destroyable;
    };

    /**
     * @method isCollidable
     * @return {Boolean}
     */
    BlockBase.prototype.isCollidable = function() {
        return this.type.collidable;
    };
    
    /**
     * @method isUpdatable
     * @return {Boolean}
     */
    BlockBase.prototype.isUpdatable = function() {
        return this.type.entity;
    };
    
    /**
     * @method isBonusable
     * @return {Boolean}
     */
    BlockBase.prototype.isBonusable = function() {
        return this.type.bonusable;
    };
    
    /**
     * @method isPrimary
     * @return {Boolean}
     */
    BlockBase.prototype.isPrimary = function() {
        return this.type.primary;
    };
    
    /**
     * @method isAnimateScore
     * @return {Boolean}
     */
    BlockBase.prototype.isAnimateScore = function() {
        return this.type.animateScore;
    };
    
    /**
     * @method isDestroyed
     * @return {Boolean}
     */
    BlockBase.prototype.isDestroyed = function() {
        return this.destroyed;
    };

    /**
     * @method update
     * @param {Object} event
     */
    BlockBase.prototype.update = function(event) {
        if ( !this.type.destroyable ) {
            return;
        }
        var _this = this;
        
        this.hit();

        if ( this.hits >= this.type.hardness ) {
            if ( !this.isDestroyed() ) {
                createjs.Tween.get(this.bitmap).to({
                    alpha: 0,
                    scaleX: 0, 
                    scaleY: 0, 
                    x: this.getX() + this.getHalfWidth(), 
                    y: this.getY() + this.getHalfHeight()
                }, 300, createjs.Ease.cubicInOut).call(function() {
                    _this.destroy();
                });
            }
            this.destroyed = true;

            return;
        }
        var image = new Image();
        
        image.src = preloader.get('c-block-' + this.type.texture + '-' + (this.hits + 1)).src;
        this.bitmap.image = image;
    };
    
    return BlockBase;
});