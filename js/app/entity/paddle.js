
define('app/entity/paddle', 
[
    'app/entity/_base', 'app/input/_', 'app/game-options', 'app/stage', 'app/preloader', 'app/entities/bullets', 
    'app/episodes/_', 'app/sound'
], 
function(EntityBase, input, gameOptions, stage, preloader, bullets, episode, sound) {
    
    var
        /**
         * @property _paddleOptions
         * @static
         * @private
         * @type {Object}
         */
        _paddleOptions = {};
    
    
    function Paddle() {
        EntityBase.call(this);
        this.id = 'paddle';
        this.gunLeftBitmap = null;
        this.gunRightBitmap = null;
        this.leftBitmap = null;
        this.centerBitmap = null;
        this.rightBitmap = null;
        this.bulletNeedWait = false;
        this.states = {};
        this.timeouts = {
            glue: 15000,
            grow: 15000,
            gun: 10000,
            shrink: 15000,
            cpu: 10000
        };
        this.timers = {};
    }
    
    Paddle.prototype = Object.create(EntityBase.prototype, {
        constructor: {
            value: Paddle,
            enumerable: false
        }
    });

    /**
     * @method init
     */
    Paddle.prototype.init = function() {
        var container;

        _paddleOptions = episode.getManifest().paddle;
        
        this.gunLeftBitmap = new createjs.Bitmap(preloader.get('c-paddle-barrel').src);
        this.gunRightBitmap = new createjs.Bitmap(preloader.get('c-paddle-barrel').src);
        this.leftBitmap = new createjs.Bitmap(preloader.get('c-paddle-left').src);
        this.centerBitmap = new createjs.Bitmap(preloader.get('c-paddle-center').src);
        this.rightBitmap = new createjs.Bitmap(preloader.get('c-paddle-right').src);

        this.states = {};
        this.height = preloader.get('c-paddle-center').height || 20;
        this.centerBitmap.x = preloader.get('c-paddle-left').width;
        this.rightBitmap.x = 25;
        
        this.gunLeftBitmap.visible = false;
        this.gunRightBitmap.visible = false;
        
        container = new createjs.Container();
        container.addChild(this.leftBitmap, this.centerBitmap, this.rightBitmap, this.gunLeftBitmap, this.gunRightBitmap);
        EntityBase.prototype.init.call(this, container);
        this.setLayerId(500);
        stage.add(this);
    };
    
    /**
     * @method create
     * @return {Paddle}
     */
    Paddle.prototype.create = function() {
        this.init();
        
        return this;
    };
    
    /**
     * @method createNew
     * @return {Paddle}
     */
    Paddle.prototype.createNew = function() {
        var paddle = new Paddle();
        
        paddle.init();
        
        return paddle;
    };
    
    /**
     * @method destroy
     */
    Paddle.prototype.destroy = function() {
        EntityBase.prototype.destroy.call(this);
        bullets.destroy();
    };

    /**
     * @method initDefaults
     */
    Paddle.prototype.initDefaults = function() {
        this.setPos(this.getCanvasWidth() / 2, this.getCanvasHeight() - this.getHeight());
    };
    
    /**
     * @method reset
     */
    Paddle.prototype.reset = function() {
        this.normalSize();
        this.gunLeftBitmap.visible = false;
        this.gunRightBitmap.visible = false;
        this.states = {};
        $.each(this.timers, function(key, value) {
            clearTimeout(value);
        });
    };
    
    /**
     * @method isCollision
     * @param {EntityBase} entity
     * @return {Boolean}
     */
    Paddle.prototype.isCollision = function(entity) {
        var bx, by, bw, bh,
            ex, ey, ew, eh;

        if ( !entity.isVisible() || !entity.isCollidable() ) {
            return false;
        }
        bx = this.getX();
        by = this.getY();
        bw = this.getWidth();
        bh = this.getHeight();
        ex = entity.getX();
        ey = entity.getY();
        ew = entity.getWidth();
        eh = entity.getHeight();

        return bx + bw >= ex && bx <= ex + ew && by + bh >= ey && by <= ey + eh;
    };
    
    /**
     * @method gun
     * @return {Paddle}
     */
    Paddle.prototype.gun = function() {
        var _this = this;
        
        this.states.gun = true;
        clearTimeout(this.timers.gun);
        
        this.gunLeftBitmap.visible = true;
        this.gunRightBitmap.visible = true;
        
        this.timers.gun = setTimeout(function() {
            _this.gunLeftBitmap.visible = false;
            _this.gunRightBitmap.visible = false;
            _this.states.gun = null;
        }, this.timeouts.gun);
        
        return this;
    };
    
    /**
     * @method hasGun
     * @return {Boolean}
     */
    Paddle.prototype.hasGun = function() {
        return this.states.gun ? true : false;
    };
    
    /**
     * @method glue
     * @return {Paddle}
     */
    Paddle.prototype.glue = function() {
        var _this = this;
        
        this.states.glue = true;
        clearTimeout(this.timers.glue);
        
        this.timers.glue = setTimeout(function() {
            _this.states.glue = null;
        }, this.timeouts.glue);
        
        return this;
    };
    
    /**
     * @method hasGlue
     * @return {Boolean}
     */
    Paddle.prototype.hasGlue = function() {
        return this.states.glue ? true : false;
    };
    
    /**
     * @method cpu
     * @return {Paddle}
     */
    Paddle.prototype.cpu = function() {
        var _this = this,
            animParams;

        if ( this.states.cpu ) {
            return this;
        }
        animParams = {
            alpha: 0.7,
            y: this.getY()
        };
        this.states.cpu = true;
        this.bitmap.alpha = 0;
        this.setY(this.getY() + this.getHeight());
        this.normalSize();
        this.animate(animParams, 1000);
        clearTimeout(this.timers.cpu);
        
        this.timers.cpu = setTimeout(function() {
            _this.animate({
                y: _this.getY() + _this.getHeight()
            }, 1000, function() {
                _this.states.cpu = null;
                _this.destroy(); 
            });
        }, this.timeouts.cpu);
        
        return this;
    };
    
    /**
     * @method growSize
     * @return {Paddle}
     */
    Paddle.prototype.growSize = function() {
        var _this = this;
        
        this.size(_paddleOptions.sizes.grow);
        clearTimeout(this.timers.grow);
        
        this.timers.grow = setTimeout(function() {
            _this.normalSize();
        }, this.timeouts.grow);
        
        return this;
    };

    /**
     * @method shrinkSize
     * @return {Paddle}
     */
    Paddle.prototype.shrinkSize = function() {
        var _this = this;
        
        this.size(_paddleOptions.sizes.shrink);
        clearTimeout(this.timers.shrink);
        
        this.timers.shrink = setTimeout(function() {
            _this.normalSize();
        }, this.timeouts.shrink);
        
        return this;
    };
    
    /**
     * @method normalSize
     * @return {Paddle}
     */
    Paddle.prototype.normalSize = function() {
        this.size(_paddleOptions.sizes.normal);
        
        return this;
    };
    
    /**
     * @method size
     * @param {Number} size
     */
    Paddle.prototype.size = function(size) {
        if ( this.centerBitmap.scaleX == size ) {
            return;
        }
        var paddleCenterW = preloader.get('c-paddle-center').width,
            paddleLeftW = preloader.get('c-paddle-left').width,
            paddleRightW = preloader.get('c-paddle-right').width;
        
        this.centerBitmap.scaleX = size;
        this.rightBitmap.x = paddleCenterW * size + paddleLeftW;
        
        this.width = paddleLeftW + (paddleCenterW * size) + paddleRightW;
        this.halfWidth = null;
        
        this.gunLeftBitmap.x = paddleLeftW + _paddleOptions.left_barrel_rel_pos.x;
        this.gunLeftBitmap.y = _paddleOptions.left_barrel_rel_pos.y;
        this.gunRightBitmap.x = this.rightBitmap.x - this.gunRightBitmap.image.width + _paddleOptions.right_barrel_rel_pos.x;
        this.gunRightBitmap.y = _paddleOptions.right_barrel_rel_pos.y;
    };

    /**
     * @method update
     * @param {Object} event
     */
    Paddle.prototype.update = function(event) {
        if ( this.isMainEntity() ) {
            this.updateMainEntity(event);
        } else {
            if ( this.states.cpu ) {
                this.updateCpuMode(event);
            }
        }
    };
    
    /**
     * @method updateMainEntity
     * @param {Object} event
     */
    Paddle.prototype.updateMainEntity = function(event) {
        var _this = this, x, margin, maxWidth;

        margin = this.getHalfWidth() - 5;

        if ( input.keyboard.isPressed('left') ) {
            input.pointer.x = input.pointer.x - (8 * gameOptions.get('fps_ratio'));
            
            if ( input.pointer.x < margin ) {
                input.pointer.x = margin;
            }
        } else if ( input.keyboard.isPressed('right') ) {
            input.pointer.x = input.pointer.x + (8 * gameOptions.get('fps_ratio'));
            maxWidth = ((this.getCanvasWidth() - this.getWidth()) *  stage.getScale()) + margin;
            
            if ( input.pointer.x > maxWidth ) {
                input.pointer.x = maxWidth;
            }
        }
        x = input.pointer.x - margin;
        
        if ( stage.getScale() !== 1 ) {
            x = x * 1 / stage.getScale();
        }
        if ( x <= 0 ) {
            x = 0;
        }
        if ( x >= this.getCanvasWidth() - this.getWidth() ) {
            x = this.getCanvasWidth() - this.getWidth();
        }
        this.setX(x >> 0);
        
        if ( this.hasGun() && !this.bulletNeedWait && (input.pointer.isClick() || input.keyboard.isPressed('space|enter|up')) ) {
            this.bulletNeedWait = true;
            
            setTimeout(function() {
                _this.bulletNeedWait = false;
            }, _paddleOptions.bullet_rate_timeout);
            
            bullets.create().setPos(
                this.getX() + _paddleOptions.left_bullet_rel_pos.x, 
                this.getY() + _paddleOptions.left_bullet_rel_pos.y
            );
            bullets.create().setPos(
                this.getX() + this.rightBitmap.x - this.gunRightBitmap.image.width + _paddleOptions.right_bullet_rel_pos.x, 
                this.getY() + _paddleOptions.right_bullet_rel_pos.y
            );
            sound.play('gun');
        }
        bullets.update(event);
    };
    
    /**
     * @method updateCpuMode
     * @param {Object} event
     */
    Paddle.prototype.updateCpuMode = function(event) {
        var bx, xMagnitude, ball, dir;
        
        ball = stage.getBall();
        bx = ball.getX();
        xMagnitude = Math.abs(this.getX() + this.getHalfWidth() - bx - ball.getHalfWidth());
        dir = Math.sin(Math.min(xMagnitude / 50, 2)) * 9;
        
        if ( this.getX() + this.getHalfWidth() > bx + ball.getHalfWidth() ) {
            dir = - dir;
        }
        this.setX(this.getX() + dir);
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Paddle();
    }
    
    return instance;
});