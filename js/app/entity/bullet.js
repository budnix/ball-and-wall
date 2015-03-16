
define('app/entity/bullet', 
[
    'app/entity/_base', 'app/preloader', 'app/core/mediator', 'app/sound', 'app/dashboard', 'app/stage', 'app/game-options',
    'app/core/_'
], 
function(EntityBase, preloader, mediator, sound, dashboard, stage, gameOptions, core) {
    
    function Bullet() {
        EntityBase.call(this);
        this.id = 'bullet';
        this.speedStep = 4 * core.helperApp.pixelRatio();
        this.speedX = 0;
        this.speedY = 0;
        this.x = 0;
        this.y = 0;
        this.initX = 0;
        this.initY = 0;
        this.alive = true;
    }
    
    Bullet.prototype = Object.create(EntityBase.prototype, {
        constructor: {
            value: Bullet,
            enumerable: false
        }
    });

    /**
     * @method init
     */
    Bullet.prototype.init = function() {
        EntityBase.prototype.init.call(this, new createjs.Bitmap(preloader.get('c-paddle-bullet').src));
        this.setLayerId(540);
    };
    
    /**
     * @method create
     * @return {Bullet}
     */
    Bullet.prototype.create = function() {
        this.init();
        
        return this;
    };
    
    /**
     * @method createNew
     * @return {Bullet}
     */    
    Bullet.prototype.createNew = function() {
        var bonus;
        
        bonus = new Bullet();
        bonus.init();
        
        return bonus;
    };

    /**
     * @method isCollision
     * @param {Entity} entity
     * @return {Boolean}
     */
    Bullet.prototype.isCollision = function(entity) {
        var bx, by, bw, bh,
            ex, ey, ew, eh;

        if ( !entity.isVisible() ) {
            return false;
        }
        bx = this.getX() - this.bitmap.regX;
        by = this.getY() - this.bitmap.regY;
        bw = this.getWidth();
        bh = this.getHeight();
        ex = entity.getX();
        ey = entity.getY();
        ew = entity.getWidth();
        eh = entity.getHeight();

        if ( bx > ex + ew || bx + bw < ex || by > ey + eh || by + bh < ey ) {
            return false;
        }
        
        return true;
    };
    
    /**
     * @method setPos
     * @param {Number} x
     * @param {Number} y
     */
    Bullet.prototype.setPos = function(x, y) {
        EntityBase.prototype.setPos.call(this, x, y);
        this.x = this.initX = x;
        this.y = this.initY = y;
    };

    /**
     * @method update
     * @param {Object} event
     */
    Bullet.prototype.update = function(event) {
        var bonuses, blocks, block, delta;
        
        delta = event.delta * (createjs.Ticker.getFPS() / 1000) * gameOptions.get('fps_ratio');
        this.bitmap.y -= this.speedStep * delta;
        
        bonuses = stage.getBonuses();
        blocks = stage.getBlocks().reset();
        block = blocks.current();

        while ( block ) {
            if ( !block.isCollidable() ) {
                block = blocks.next().current();
                
                continue;
            }
            if ( this.isCollision(block) ) {
                this.destroy();
                
                if ( block.isDestroyable() ) {
                    sound.play(block.getHitSound() ? block.getHitSound() : 'block-hit');
                }
                blocks.updateCurrent(event);
                
                if ( block.isDestroyed() && block.isExists() ) {
                    if ( block.isBonusable() ) {
                        bonuses.randomCreate(block);
                    }
                    dashboard.getScore().incr(block.getScore());
                }
                if ( blocks.isCleared() ) {
                    mediator.emit('game:stage-clear');
                    bonuses.destroy();
                }
                break;
            }
            block = blocks.next().current();
        }
        
        if ( this.isExists() && this.bitmap.y + this.getHeight() < 0 ) {
            this.destroy();
        }
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Bullet();
    }
    
    return instance;
});