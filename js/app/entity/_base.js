
define('app/entity/_base', 
[
    'app/stage', 'app/core/_'
], 
function(stage, core) {
    
    function EntityBase() {
        core.EventEmitter.call(this);
        this.id = null;
        this.bitmap = null;
        this.speedStep = {x: 2, y: 2};
        this.width = 0;
        this.height = 0;
        this.halfWidth = 0;
        this.halfHeight = 0;
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.collidable = true;
        this.childs = [];
        this.mainEntity = false;
        this.options = {
            anim_delay: 4000
        };
        this.animTimer = null;
        this.animating = false;
    }
    
    EntityBase.prototype = Object.create(core.EventEmitter.prototype, {
        constructor: {
            value: EntityBase,
            enumerable: false
        }
    });

    /**
     * @method init
     * @param {Bitmap} bitmap
     * @param {Object} options
     */
    EntityBase.prototype.init = function(bitmap, options) {
        var _this = this;
        
        this.options = $.extend(this.options, options || {});
        this.bitmap = bitmap;
        
        if ( !this.bitmap.layerId ) {
            this.setLayerId(1);
        }
        if ( this.bitmap instanceof createjs.BitmapAnimation ) {
            if ( this.bitmap.spriteSheet.getAnimation('loop') ) {
                this.bitmap.gotoAndPlay('loop');

                if ( this.bitmap.spriteSheet.getAnimation('loop').next === null && this.options.anim_delay ) {
                    this.animTimer = setInterval(function() {
                        _this.bitmap.gotoAndPlay('loop');
                    }, this.options.anim_delay);
                }
            }
        }
        if ( core.helperApp.platform() != 'wp8' ) {
            this.bitmap.addEventListener('click', function(event) {
                event.target = _this;
                _this.emit('click', event);
            });
            this.bitmap.addEventListener('mousedown', function(event) {
                event.target = _this;
                _this.emit('mousedown', event);
            });
            this.bitmap.addEventListener('mouseover', function(event) {
                event.target = _this;
                _this.emit('mouseover', event);
            });
            this.bitmap.addEventListener('mouseout', function(event) {
                event.target = _this;
                _this.emit('mouseout', event);
            });
        }
    };

    /**
     * @method initDefaults
     */
    EntityBase.prototype.initDefaults = function() {

    };
    
    /**
     * @method animate
     * @param {Object} params
     * @param {Number} duration
     * @param {Function} callback
     * @return {EntityBase}
     */
    EntityBase.prototype.animate = function(params, duration, callback) {
        if ( this.animating ) {
            return this;
        }
        this.animating = true;
        createjs.Tween.get(this.bitmap).to(params, duration, params.transition ? params.transition : createjs.Ease.cubicInOut)
                .call($.proxy(function() {
            this.animating = false;
            
            if ( callback ) {
                callback();
            }
        }, this));
        
        return this;
    };
    
    /**
     * @method setTexture
     * @param {Image} image
     */
    EntityBase.prototype.setTexture = function(image) {
        this.width = 0;
        this.height = 0;
        this.halfWidth = 0;
        this.halfHeight = 0;
        
        if ( this.bitmap instanceof createjs.BitmapAnimation ) {
            var spriteSheet;
        
            spriteSheet = new createjs.SpriteSheet({
                images: [image],
                delay: 5000,
                frames: {
                    width: image.height,
                    height: image.height
                },
                animations: {loop: [0, image.width / image.height - 1, true, 4]}
            });
            this.bitmap.spriteSheet = spriteSheet;
        } else {
            this.bitmap.image = image;
        }
    };
    
    /**
     * @method setAsMainEntity
     * @param {Boolean} flag
     */
    EntityBase.prototype.setAsMainEntity = function(flag) {
        this.mainEntity = flag;
    };
    
    /**
     * @method isMainEntity
     * @return {Boolean}
     */
    EntityBase.prototype.isMainEntity = function() {
        return this.mainEntity;
    };
    
    /**
     * @method setLayerId
     * @param {Number} index
     */
    EntityBase.prototype.setLayerId = function(index) {
        this.bitmap.layerId = index;
    };

    /**
     * @method isBitmapAnimation
     * @return {Boolean}
     */
    EntityBase.prototype.isBitmapAnimation = function() {
        return this.bitmap && this.bitmap instanceof createjs.BitmapAnimation;
    };
    
    /**
     * @method addToStage
     */
    EntityBase.prototype.addToStage = function() {
        stage.add(this);
    };

    /**
     * @method show
     */
    EntityBase.prototype.show = function() {
        this.bitmap.visible = true;
    };

    /**
     * @method hide
     */
    EntityBase.prototype.hide = function() {
        this.bitmap.visible = false;
    };

    /**
     * @method destroy
     */
    EntityBase.prototype.destroy = function() {
        if ( this.bitmap && this.bitmap.getStage() ) {
            clearInterval(this.animTimer);
            this.bitmap.getStage().removeChild(this.bitmap);
            this.bitmap = null;
        }
    };

    /**
     * @method isExists
     * @return {Boolean}
     */
    EntityBase.prototype.isExists = function() {
        return this.bitmap ? true : false;
    };

    /**
     * @method isVisible
     * @return {Boolean}
     */
    EntityBase.prototype.isVisible = function() {
        return this.bitmap.visible;
    };
    
    /**
     * @method isCollidable
     * @return {Boolean}
     */
    EntityBase.prototype.isCollidable = function() {
        return this.collidable;
    };

    /**
     * @method getX
     * @return {Number}
     */
    EntityBase.prototype.getX = function() {
        return this.bitmap.x;
    };

    /**
     * @method getY
     * @return {Number}
     */
    EntityBase.prototype.getY = function() {
        return this.bitmap.y;
    };

    /**
     * @method setX
     * @param {Number} x
     * @return {EntityBase}
     */
    EntityBase.prototype.setX = function(x) {
        this.bitmap.x = x;
        
        return this;
    };

    /**
     * @method setY
     * @param {Number} y
     * @return {EntityBase}
     */
    EntityBase.prototype.setY = function(y) {
        this.bitmap.y = y;

        return this;
    };

    /**
     * @method setPos
     * @param {Number} x
     * @param {Number} y
     * @return {EntityBase}
     */
    EntityBase.prototype.setPos = function(x, y) {
        this.bitmap.x = x;
        this.bitmap.y = y;

        return this;
    };

    /**
     * @method getPos
     * @return {Object}
     */
    EntityBase.prototype.getPos = function(x, y) {
        return {
            x: this.getX(),
            y: this.getY()
        };
    };

    /**
     * @method setSpeedStep
     * @param {Number} x
     * @param {Number} y
     */
    EntityBase.prototype.setSpeedStep = function(x, y) {
        this.speedStep = {x: x, y: y};
    };

    /**
     * @method getSpeedStep
     * @return {Object}
     */
    EntityBase.prototype.getSpeedStep = function() {
        return this.speedStep;
    };

    /**
     * @method getWidth
     * @return {Number}
     */
    EntityBase.prototype.getWidth = function() {
        if ( !this.width ) {
            if ( this.bitmap instanceof createjs.Bitmap ) {
                this.width = this.bitmap.image.width;
            } else if ( this.bitmap instanceof createjs.BitmapAnimation ) {
                this.width = this.bitmap.getBounds().width;
            } else if ( this.bitmap instanceof createjs.Container ) {
                var width = 0;
                
                $.each(this.bitmap.children, function(key, child) {
                    width = width + child.image.width;
                });
                this.width = width;
            } else if ( this.bitmap instanceof createjs.Text ) {
                this.width = this.bitmap.getMeasuredWidth();
            }
        }

        return this.width;
    };

    /**
     * @method getHeight
     * @return {Number}
     */
    EntityBase.prototype.getHeight = function() {
        if ( !this.height ) {
            if ( this.bitmap instanceof createjs.Bitmap ) {
                this.height = this.bitmap.image.height;
            } else if ( this.bitmap instanceof createjs.BitmapAnimation ) {
                this.height = this.bitmap.getBounds().height;
            } else if ( this.bitmap instanceof createjs.Container ) {
                var height = 0;
                
                $.each(this.bitmap.children, function(key, child) {
                    height = height + child.image.height;
                });
                this.height = height;
            } else if ( this.bitmap instanceof createjs.Text ) {
                this.height = this.bitmap.getMeasuredHeight();
            }
        }

        return this.height;
    };

    /**
     * @method getHalfWidth
     * @return {Number}
     */
    EntityBase.prototype.getHalfWidth = function() {
        if ( !this.halfWidth ) {
            this.halfWidth = this.getWidth() / 2;
        }

        return this.halfWidth;
    };

    /**
     * @method getHalfHeight
     * @return {Number}
     */
    EntityBase.prototype.getHalfHeight = function() {
        if ( !this.halfHeight ) {
            this.halfHeight = this.getHeight() / 2;
        }

        return this.halfHeight;
    };

    /**
     * @method getCanvasWidth
     * @return {Number}
     */
    EntityBase.prototype.getCanvasWidth = function() {
        if ( !this.canvasWidth ) {
            this.canvasWidth = this.bitmap.parent.canvas.width;
        }

        return this.canvasWidth;
    };

    /**
     * @method getCanvasHeight
     * @return {Number}
     */
    EntityBase.prototype.getCanvasHeight = function() {
        if ( !this.canvasHeight ) {
            this.canvasHeight = this.bitmap.parent.canvas.height;
        }

        return this.canvasHeight;
    };
    
    EntityBase.prototype.update = function(event) {

    };
    
    return EntityBase;
});