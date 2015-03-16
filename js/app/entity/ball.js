
define('app/entity/ball', 
[
    'app/entity/_base', 'app/entity/tail', 'app/entity/explosion', 'app/sound', 'app/game-options', 
    'app/stage', 'app/preloader', 'app/core/_', 'app/input/_', 'app/episodes/_', 'app/dashboard'
], 
function(EntityBase, tail, explosion, sound, gameOptions, stage, preloader, core, input, episode, dashboard) {
        
    function Ball() {
        EntityBase.call(this);
        this.id = 'ball';
        this.speedDefs = {
            slow: 2 * core.helperApp.pixelRatio(),
            normal: 2 * core.helperApp.pixelRatio(), // 2
            fast: 4 * core.helperApp.pixelRatio()
        };
        this.timeouts = {
            steel: 10000,
            turbulent: 10000
        };
        this.timers = {};
        this.speedX = 0;
        this.speedY = 0;
        this.isStageClick = false;
        this.speedStep = 2 * core.helperApp.pixelRatio();
        this.maxSpeed = 6.5 * core.helperApp.pixelRatio();
        this.bounceAngle = 1;
        this.allowBounceBottom = false;
        this.width = 0;
        this.height = 0;
        this.glueBallX = null;
        this.alive = false;
        this.steelMode = false;
        this.turbulentMode = false;
    }
    
    Ball.prototype = Object.create(EntityBase.prototype, {
        constructor: {
            value: Ball,
            enumerable: false
        }
    });

    /**
     * @method init
     */
    Ball.prototype.init = function() {
        var ballNormal = preloader.get('c-ball-normal');
        
        if ( ballNormal.width === ballNormal.height ) {
            EntityBase.prototype.init.call(this, new createjs.Bitmap(ballNormal.src));
        } else {
            var spriteSheet = new createjs.SpriteSheet({
                images: [ballNormal],
                frames: {
                    width: ballNormal.height,
                    height: ballNormal.height
                },
                animations: {loop: [0, ballNormal.width / ballNormal.height - 1, 'loop', 4]}
            });
            EntityBase.prototype.init.call(this, new createjs.BitmapAnimation(spriteSheet));
        }
        this.setLayerId(600);
        this.bitmap.x = 500;
        this.bitmap.y = 300;
        this.alive = false;
        this.steelMode = false;
        this.turbulentMode = false;
        this.isStageClick = false;
        this.glueBallX = null;
        this.tail = episode.getManifest().ball.tail ? tail.createNew() : null;
        this.explosion = episode.getManifest().ball.explosion ? explosion.createNew() : null;
        this.reset();
        stage.add(this);

        this._onStageClick = $.proxy(this.onStageClick, this);
        $('#' + stage.stage.canvas.id).bind('click', this._onStageClick);
    };
    
    /**
     * @method create
     * @return {Ball}
     */
    Ball.prototype.create = function() {
        this.init();
        
        return this;
    };

    /**
     * @method createNew
     * @return {Ball}
     */
    Ball.prototype.createNew = function() {
        var ball = new Ball();
        
        ball.init();
        
        return ball;
    };

    /**
     * @method initDefaults
     */
    Ball.prototype.initDefaults = function() {
        this.setPos(this.getCanvasWidth() / 2, this.getCanvasHeight() / 2);
    };
    
    /**
     * @method setTailTexture
     * @param {Image} image
     */
    Ball.prototype.setTailTexture = function(image) {
        if ( this.tail ) {
            this.tail.setTexture(image);
        }
    };
    
    /**
     * @method setSize
     * @param {String} sizeName
     * @return {Ball}
     */
    Ball.prototype.setSize = function(sizeName) {
        this.steel(false);
        this.setTexture(preloader.get('c-ball-' + sizeName));
        
        if ( this.tail ) {
            this.tail.setSize(sizeName);
        }
        
        return this;
    };
    
    /**
     * @method steal
     * @param {Boolean} isSteel
     * @return {Ball}
     */
    Ball.prototype.steel = function(isSteel) {
        var _this = this;
        
        isSteel = isSteel === undefined || isSteel ? true : false;
        
        if ( isSteel ) {
            this.setTexture(preloader.get('c-ball-steel'));
        } else {
            this.setTexture(preloader.get('c-ball-normal'));
        }
        if ( this.tail ) {
            this.tail.steel(isSteel);
            
            if ( !isSteel ) {
                this.tail.setSize('normal');
            }
        }
        this.steelMode = isSteel;

        if ( this.timers.steel ) {
            clearTimeout(this.timers.steel);
        }
        if ( isSteel ) {
            this.timers.steel = setTimeout(function() {
                _this.steel(false);
            }, this.timeouts.steel);
        }
    };
    
    /**
     * @method turbulent
     * @param {Boolean} isTurbulent
     */
    Ball.prototype.turbulent = function(isTurbulent) {
        var _this = this;
        
        isTurbulent = isTurbulent === undefined || isTurbulent ? true : false;
        this.turbulentMode = isTurbulent;

        if ( this.timers.turbulent ) {
            clearTimeout(this.timers.turbulent);
        }
        if ( isTurbulent ) {
            this.timers.turbulent = setTimeout(function() {
                _this.turbulent(false);
            }, this.timeouts.turbulent);
        }
    };

    /**
     * @method destroy
     */
    Ball.prototype.destroy = function() {
        EntityBase.prototype.destroy.call(this);
        
        if ( this.explosion ) {
            this.explosion.destroy();
            this.explosion = null;
        }
        if ( this.tail ) {
            this.tail.destroy();
            this.tail = null;
        }
//        stage.stage.removeEventListener('click', this._onStageClick);
        $('#' + stage.stage.canvas.id).bind('click', this._onStageClick);
    };

    /**
     * @method bounceBottom
     * @param {Boolean} flag
     * @return {Ball}
     */
    Ball.prototype.bounceBottom = function(flag) {
        this.allowBounceBottom = flag;

        return this;
    };

    /**
     * @method bounce
     * @param {EntityBase} entity
     * @param {String} dir
     * @return {Boolean}
     */
    Ball.prototype.bounce = function(entity, dir) {
        if ( !entity.isVisible() || !entity.isCollidable() ) {
            return false;
        }
        
        var speedX = this.speedX, 
            speedY = this.speedY;

        if ( entity.id == 'paddle' ) {
            var normX = (1 - 2 * ((this.getX() + this.getHalfWidth()) - entity.getX()) / entity.getWidth()) * 
                    this.bounceAngle;

            if ( entity.getY() - this.getY() > 0 ) {
                speedX = -(this.speedStep * Math.sin(normX) * 1.5);
                speedY = -(this.speedStep * Math.cos(normX) * 1.5);
            } else {
                speedX = - this.speedX;
            }
            if ( this.explosion && !entity.hasGlue() ) {
                this.explosion.explode(this.getX() + this.getHalfWidth(), this.getY() + this.getHeight());
            }
            this.speedX = speedX;
            this.speedY = speedY;
            
        } else if ( entity.id == 'block' && !this.steelMode && entity.getHardness() || entity.id == 'block' && !entity.isDestroyable() ) {
            var bx, by;

            bx = this.getX();
            by = this.getY();
            
            switch (dir) {
                case 'left':
                case 'right':
                    speedX = - this.speedX;
                    break;

                case 'top':
                case 'bottom':
                    speedY = - this.speedY;
                    break;
            }
            if ( this.explosion ) {
                this.explosion.explode(bx + this.getHalfWidth(), by + this.getHalfHeight());
            }
            this.speedX = speedX;
            this.speedY = speedY;
            
        } else if ( entity.id == 'ball' ) {
            switch (dir) {
                case 'left':
                case 'right':
                    speedX = - this.speedX;
                    break;

                case 'top':
                case 'bottom':
                    speedY = - this.speedY;
                    break;
            }
            this.speedX = speedX;
            this.speedY = speedY;
            
        } else if ( entity.bounce ) {
            entity.bounce(this, dir);
        }
        if ( !(entity.id == 'paddle' && entity.hasGlue()) ) {
            this.increaseSpeed();
        }

        return true;
    };

    /**
     * @method setPos
     * @param {Number} x
     * @param {Number} y
     * @return {Ball}
     */
    Ball.prototype.setPos = function(x, y) {
        EntityBase.prototype.setPos.call(this, x, y);
        
        if ( this.tail ) {
            this.tail.addHeadPos(x, y);
            this.tail.update();
        }

        return this;
    };

    /**
     * @method increaseSpeed
     * @param {Number} by
     */
    Ball.prototype.increaseSpeed = function(by) {
        by = by || (0.05 * core.helperApp.pixelRatio());

        if ( this.steelMode ) {
            by = by + (0.05 * core.helperApp.pixelRatio());
        }
        this.setSpeed(Math.min(this.speedStep + by, this.maxSpeed));
    };

    /**
     * @method decreaseSpeed
     * @param {Number} by
     */
    Ball.prototype.decreaseSpeed = function(by) {
        by = by || (0.05 * core.helperApp.pixelRatio());
        this.setSpeed(this.speedStep - by);
    };

    /**
     * @method setSpeed
     * @param {Number|String} speed
     * @param {Number} angle Angle in radians
     *           
     *         | 270
     *         |
     *  180 ---X--- 0
     *         |
     *         | 90
     */
    Ball.prototype.setSpeed = function(speed, angle) {
        var sx, sy;
        
        if ( !$.isNumeric(speed) ) {
            speed = this.speedDefs[speed];
        }
        if ( speed <= this.maxSpeed ) {
            this.speedStep = speed;
            
            if ( angle === undefined || angle === null ) {
                angle = Math.atan2(this.speedY, this.speedX);
            }
            sx = speed * Math.cos(angle) * 1.5;
            sy = speed * Math.sin(angle) * 1.5;
            this.speedX = parseFloat(sx.toFixed(3), 10);
            this.speedY = parseFloat(sy.toFixed(3), 10);
        }
        if ( this.isMainEntity() ) {
            dashboard.getSpeed().set(this.getSpeed());
        }
        
        return this;
    };
    
    /**
     * @method setAngle
     * @param {Number} angle Angle in radians
     * @return {Ball}
     */
    Ball.prototype.setAngle = function(angle) {
        var sx, sy;
        
        sx = this.speedStep * Math.cos(angle) * 1.5;
        sy = this.speedStep * Math.sin(angle) * 1.5;
        this.speedX = parseFloat(sx.toFixed(3), 10);
        this.speedY = parseFloat(sy.toFixed(3), 10);
        
        return this;
    };
    
    /**
     * @method getAngle
     * @return {Number}
     */
    Ball.prototype.getAngle = function() {
        return Math.atan2(this.speedY, this.speedX);
    };

    /**
     * @method getSpeed
     * @return {Number}
     */
    Ball.prototype.getSpeed = function() {
        return this.speedStep;
    };

    /**
     * @method isCollision
     * @param {EntityBase} entity
     * @return {Boolean}
     */
    Ball.prototype.isCollision = function(entity) {
        if ( !entity.isVisible() || !entity.isCollidable() ) {
            return false;
        }
        
        var bx, by, bw, bh, 
            ex, ey, ew, eh;

        bx = this.getX();
        by = this.getY();
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
     * @method isAlive
     * @return {Boolean}
     */
    Ball.prototype.isAlive = function() {
        return this.alive;
    };

    /**
     * @method setAlive
     * @param {Boolean} flag
     * @return {Ball}
     */
    Ball.prototype.setAlive = function(flag) {
        this.alive = flag;

        return this;
    };
    
    /**
     * @method reset
     * @return {Ball}
     */
    Ball.prototype.reset = function() {
        this.setSize('normal');
        this.setSpeed('normal', 4.71 + (Math.random() - 0.5) / 4);
        this.turbulent(false);

        return this;
    };
    
    /**
     * @method hide
     * @return {Ball}
     */
    Ball.prototype.hide = function() {
        EntityBase.prototype.hide.call(this);
        
        if ( this.tail ) {
            this.tail.hide();
        }
        
        return this;
    };
    
    /**
     * @method animate
     * @param {Object} params
     * @param {Number} duration
     * @param {Function} callback
     * @return {Ball}
     */
    Ball.prototype.animate = function(params, duration, callback) {
        EntityBase.prototype.animate.call(this, params, duration, callback);
        
        //if ( this.tail ) {
//            this.tail.animate(params, duration);
//        }
        
        return this;
    };

    /**
     * @method update
     * @param {Object} event
     */
    Ball.prototype.update = function(event) {
        var x, y, cw, ch, delta, paddle;

        paddle = stage.getPaddles().reset().current();
        delta = event.delta * (createjs.Ticker.getFPS() / 1000) * gameOptions.get('fps_ratio');
        x = this.getX();
        y = this.getY();
        cw = this.getCanvasWidth();
        ch = this.getCanvasHeight();
        
        if ( !paddle.hasGlue() ) {
            this.glueBallX = null;
        }

        if ( this.isAlive() && (this.glueBallX === null || this.isStageClick || input.keyboard.isPressed('space|enter|up')) ) {
            this.glueBallX = null;
            
            if ( (x + this.getWidth() >= cw) && this.speedX >= 0 ) {
                this.speedX = - this.speedX;
                this.increaseSpeed();
                sound.play('wall-hit');
            }
            if ( x <= 0 ) {
                this.speedX = this.speedX > 0 ? this.speedX : - this.speedX;
                this.increaseSpeed();
                sound.play('wall-hit');
            }
            if ( y >= ch && this.speedY >= 0 ) {
                if ( this.allowBounceBottom ) {
                    this.speedY = - this.speedY;
                    this.increaseSpeed();
                    sound.play('wall-hit');
                } else {
                    sound.play('lost-ball');
                    this.setAlive(false);
                    this.reset();
                }
            }
            if ( y <= 0 ) {
                this.speedY = this.speedY > 0 ? this.speedY : - this.speedY;
                this.increaseSpeed();
                sound.play('wall-hit');
            }
        } else {
            if ( this.isAlive() ) {
                x = this.glueBallX + paddle.getX();
                y = paddle.getY() - this.getHeight();

                this.setPos(x, y);
            }
            if ( this.explosion ) {
                this.explosion.update(event);
            }
            
            return;
        }
        if ( !this.updateEntities(stage.getBlocks(), event) 
                && !this.updateEntities(stage.getBalls(), event) 
                && !this.updateEntities(stage.getPaddles(), event) ) {
            x += this.speedX * delta;
            y += this.speedY * delta;

            if ( this.turbulentMode ) {
                this.setAngle(this.getAngle() + (Math.random() - 0.5) / 4);
            }
            this.setPos(x, y);
            
            if ( this.explosion ) {
                this.explosion.update(event);
            }
        }
        this.isStageClick = false;
    };
    
    /**
     * @method updateEntities
     * @param {BaseEntities} entities
     * @param {Object} event
     */
    Ball.prototype.updateEntities = function(entities, event) {
        var x, y, delta, entity, nextPoint,
            magnitudeCurrent, magnitudeClosest = Infinity,
            closestEntity = [], udt;

        if ( !this.isExists() ) {
            return false;
        }
        x = this.getX();
        y = this.getY();
        delta = event.delta * (createjs.Ticker.getFPS() / 1000) * gameOptions.get('fps_ratio');
        nextPoint = core.math.move(x, y, this.speedX, this.speedY, delta);
        entity = entities.reset().current();
        
        while ( entity ) {
            var point;
            
            if ( entity == this || !entity.isCollidable() ) {
                entity = entities.next().current();
                
                continue;
            }
            if ( entity.id == 'paddle' ) {
                point = core.math.entityIntersect(this, entity, nextPoint.nx, nextPoint.ny);
            } else {
                point = core.math.entityIntercept(this, entity, nextPoint.nx, nextPoint.ny);
            }

            if ( point ) {
                magnitudeCurrent = core.math.pointMagnitude(point.x - x, point.y - y);
                
                if ( magnitudeCurrent <= magnitudeClosest ) {
                    if ( magnitudeCurrent < magnitudeClosest ) {
                        closestEntity = [];
                    }
                    closestEntity.push({
                        entity: entity,
                        entityIndex: entities.getIndex(),
                        point: point
                    });
                    magnitudeClosest = magnitudeCurrent;
                }
            }
            entity = entities.next().current();
        }
        
        if ( !closestEntity.length ) {
            return false;
        }
        if ( entities.id == 'blocks' ) {
            this.setPos(closestEntity[0].point.x, closestEntity[0].point.y);
            
            for (var i = 0, l = closestEntity.length; i < l; i++ ) {
                entities.updateEntity(closestEntity[i].entity, event);
                
                if ( closestEntity[i].entity.isDestroyed() && closestEntity[i].entity.isExists() ) {
                    if ( closestEntity[i].entity.isBonusable() ) {
                        stage.getBonuses().randomCreate(closestEntity[i].entity);
                    }
                    dashboard.getScore().incr(closestEntity[i].entity.getScore());

                    if ( closestEntity[i].entity.isAnimateScore() ) {
                        stage.getEntities().scores.create(closestEntity[i].entity.getScore(), {animationType: 'scale-down'})
                                .setPos(closestEntity[i].entity.getX() + 3, closestEntity[i].entity.getY() + 7);
                    }
                }
            }
            if ( closestEntity[0].entity.isDestroyable() ) {
                sound.play(closestEntity[0].entity.getHitSound() ? closestEntity[0].entity.getHitSound() : 'block-hit');
            } else {
                sound.play('block-indestructible-hit');
            }
            this.bounce(closestEntity[0].entity, closestEntity[0].point.dir);
            this.setTailTexture(closestEntity[0].entity.getTexture());

            if ( entities.isCleared() ) {
                core.mediator.emit('game:stage-clear');
                stage.getBonuses().destroy();
            }

        } else if ( entities.id == 'balls' ) {
            this.setPos(closestEntity[0].point.x, closestEntity[0].point.y);
            this.bounce(closestEntity[0].entity, closestEntity[0].point.dir);
            sound.play('block-hit');
            
        } else if ( entities.id == 'paddles' ) {
            this.setPos(closestEntity[0].point.x, closestEntity[0].point.y);
            this.bounce(closestEntity[0].entity, closestEntity[0].point.dir);

            if ( closestEntity[0].entity.hasGlue() && !this.isStageClick ) {
                if ( this.glueBallX === null ) {
                    this.glueBallX = this.getX() - closestEntity[0].entity.getX();
                }
            } else {
                this.glueBallX = null;
            }
            sound.play('paddle-hit');
        }
        udt = delta * (magnitudeClosest / core.math.pointMagnitude(nextPoint.nx, nextPoint.ny));
        udt = delta - udt;

        this.updateEntities(entities, {delta: udt});
        
        return true;
    };
    
    /**
     * @method onStageClick
     */
    Ball.prototype.onStageClick = function() {
        this.isStageClick = true;
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Ball();
    }
    
    return instance;
});
