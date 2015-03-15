
define('app/entity/bonus', 
[
    'app/entity/_base', 'app/sound', 'app/core/_', 'app/episodes/_', 'app/preloader', 'app/game-options', 'app/stage', 'app/dashboard'
], 
function(EntityBase, sound, core, episode, preloader, gameOptions, stage, dashboard) {
    
    var 
        /**
         * @property _incidence
         * @static
         * @private
         * @type {Object}
         */
        _incidence = {},

        /**
         * @property _bonusOptions
         * @static
         * @private
         * @type {Object}
         */
        _bonusOptions = {},
        
        /**
         * @property _getBonusType
         * @static
         * @private
         * @type {Function}
         */
        _getBonusType;
    
                
    _getBonusType = function _getBonusType(typeId) {
        var bonusTypes = episode.getBonuses();
        
        typeId = typeId === undefined ? ~~(Math.random() * (bonusTypes.length)) : typeId;
        
        if ( !bonusTypes[typeId] ) {
            return null;
        }
        
        return bonusTypes[typeId];
    };
    
    core.mediator.addListener('game:level-start', function() {
        _incidence = {}; 
    });
    
        
    function Bonus() {
        EntityBase.call(this);
        this.id = 'bonus';
        this.collidable = false;
        this.speedStep = 4;
        this.speedX = 0;
        this.speedY = 0;
        this.x = 0;
        this.y = 0;
        this.initX = 0;
        this.initY = 0;
        this.angle = 180;
        this.rotate = 0;
        this.dir = 1;
        this.alive = true;
        this.type = {};
    }
    
    Bonus.prototype = Object.create(EntityBase.prototype, {
        constructor: {
            value: Bonus,
            enumerable: false
        }
    });

    /**
     * @method init
     * @param {Object} type
     */
    Bonus.prototype.init = function(type) {
        _bonusOptions = episode.getManifest().bonus;
        this.type = type;
        EntityBase.prototype.init.call(this, new createjs.Bitmap(preloader.get('c-bonus-' + this.type.name).src));
        this.setLayerId(650);
        this.rotate = this.angle = Math.random() * 180;
        this.dir = ~~(Math.random() * 2) ? 1 : -1;
    };
    
    /**
     * @method create
     * @param {Number} typeId
     * @return {Bonus}
     */
    Bonus.prototype.create = function(typeId) {
        this.init(_getBonusType(typeId));
        
        return this;
    };
    
    /**
     * @method createNew
     * @param {Number} typeId
     * @return {Bonus}
     */    
    Bonus.prototype.createNew = function(typeId) {
        var type = _getBonusType(typeId), bonus = null;
        
        if ( !type ) {
            return null;
        }
        if ( ~~(Math.random() * type.create_rate) ) {
            return null;
        }
        if ( type.max_incidence && _incidence[type.name] >= type.max_incidence ) {
            return null;
        }
        if ( type.max_incidence ) {
            if ( !_incidence[type.name] ) {
                _incidence[type.name] = 0;
            }
            _incidence[type.name] ++;
        }
        
        bonus = new Bonus();
        bonus.init(type);
        
        return bonus;
    };
    
    /**
     * @method getName
     * @return {String}
     */
    Bonus.prototype.getName = function() {
        return this.type.name;
    };

    /**
     * @method getScore
     * @return {Number}
     */
    Bonus.prototype.getScore = function() {
        return this.type.score;
    };

    /**
     * @method isCollision
     * @param {Entity} entity
     * @return {Boolean}
     */
    Bonus.prototype.isCollision = function(entity) {
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
    Bonus.prototype.setPos = function(x, y) {
        EntityBase.prototype.setPos.call(this, x, y);
        this.x = this.initX = x;
        this.y = this.initY = y;
    };

    /**
     * @method update
     * @param {Object} event
     */
    Bonus.prototype.update = function(event) {
        var x, y, cw, ch, delta, normAngle, destroy = false;

        delta = event.delta * (createjs.Ticker.getFPS() / 1000) * gameOptions.get('fps_ratio');
        x = this.getX();
        y = this.getY();
        cw = this.getCanvasWidth();
        ch = this.getCanvasHeight();
        normAngle = (this.angle - 90) / 180;
        
        this.angle -= Math.sin(normAngle);
        this.speedX = this.speedStep * Math.cos(- this.angle * Math.PI / 180) * core.helperApp.pixelRatio();
        this.speedY = - this.speedStep * Math.sin(- this.angle * Math.PI / 180) * core.helperApp.pixelRatio();

        if ( (x + this.getWidth() >= cw) && this.speedX >= 0 ) {
            this.speedX = 0;
        }
        if ( x <= 0 ) {
            this.speedX = 0;
        }
        if ( y >= ch && this.speedY >= 0 ) {
            destroy = true;
        }
        
        if ( this.isCollision(stage.getPaddle()) ) {
            destroy = true;

            var balls = stage.getBalls(),
                ball = balls.reset().current(),
                nextBall = balls.next().current(),
                paddle = stage.getPaddle(),
                score, cloud;

            if ( !nextBall ) {
                nextBall = balls.reset().current();
            }
            dashboard.getScore()[this.getScore() > 0 ? 'incr' : 'decr'](Math.abs(this.getScore()));

            // 3 balls
            if ( this.getName() == '3-balls' ) {
                var currentAngle = ball.getAngle();
                
                balls.create()
                        .setAlive(true)
                        .setPos(ball.getX(), ball.getY())
                        .setSpeed(ball.getSpeed(), currentAngle + (Math.max(Math.random() * 1.04, 0.017) - 0.52) + 2.09);
                balls.create()
                        .setAlive(true)
                        .setPos(ball.getX(), ball.getY())
                        .setSpeed(ball.getSpeed(), currentAngle + (Math.max(Math.random() * 1.04, 0.017) - 0.52) - 2.09);
            
            // big ball
            } else if ( this.getName() == 'big-ball' ) {
                nextBall.setSize('big').setSpeed('slow');
                
            // die
            } else if ( this.getName() == 'die' ) {
                balls.destroy();
                balls.create().setAlive(false);
                dashboard.getLives().decr();
                
                if ( !dashboard.getLives().get() ) {
                    core.mediator.emit('game:game-over');
                }
                stage.earthquake(Math.random() * 20, Math.random() * 20, 1000);
            
            // life up
            } else if ( this.getName() == 'extra-life' ) {
                dashboard.getLives().incr();
                score = stage.getEntities().scores.create('+1');
                score.setPos(this.getX(), paddle.getY() - score.getHeight());
                
            // glue paddle
            } else if ( this.getName() == 'glue-paddle' ) {
                paddle.glue();
                
            // grow paddle
            } else if ( this.getName() == 'grow-paddle' ) {
                paddle.growSize();
                
            // shrink paddle
            } else if ( this.getName() == 'shrink-paddle' ) {
                paddle.shrinkSize();
                
            // score
            } else if ( this.getName() == 'score' ) {
                score = stage.getEntities().scores.create(this.getScore());
                score.setPos(this.getX(), paddle.getY() - score.getHeight());
                
            // small ball
            } else if ( this.getName() == 'small-ball' ) {
                nextBall.setSize('small').setSpeed('fast');
                
            // steel ball
            } else if ( this.getName() == 'steel-ball' ) {
                nextBall.steel(true);
                
            // gun/laser
            } else if ( this.getName() == 'gun' || this.getName() == 'laser' ) {
                paddle.gun();
                
            // earthquake
            } else if ( this.getName() == 'earthquake' ) {
                stage.earthquake(Math.random() * 20, Math.random() * 20, 4000);
                
            // turbulent-ball
            } else if ( this.getName() == 'turbulent-ball' ) {
                nextBall.turbulent();
                
            // clouds
            } else if ( this.getName() == 'clouds' ) {
                for ( var i = 0; i < 20; i++ ) {
                    cloud = stage.getEntities().clouds.create();
                    cloud.setPos(Math.max(Math.random() * stage.getWidth() - cloud.getHalfWidth(), 0), Math.max(Math.random() * stage.getHeight() - 200, -50));
                }
                
            // cpu-paddle
            } else if ( this.getName() == 'cpu-paddle' ) {
                if ( stage.getPaddles().getLength() === 1 ) {
                    stage.getPaddles().create().cpu(true);
                }
            }
            sound.play('bonus-catch');
        }
        
        if ( _bonusOptions.rotate_speed ) {
            this.bitmap.regX = this.getHalfWidth();
            this.bitmap.regY = this.getHalfHeight();
            
            if ( this.dir > 0 ) {
                this.rotate = this.rotate + _bonusOptions.rotate_speed * gameOptions.get('fps_ratio');
            } else {
                this.rotate = this.rotate - _bonusOptions.rotate_speed * gameOptions.get('fps_ratio');
            }
            if ( this.rotate >= 360 ) {
                this.rotate = 0;
            }
            this.bitmap.rotation = this.rotate;
            this.x = this.initX + this.getHalfWidth();
        }
        
        if ( _bonusOptions.animation == 'stright' ) {
            this.y += this.speedY * delta;
        } else if ( _bonusOptions.animation == 'random_direction' ) {
            this.x += this.speedX * delta;
            this.y += this.speedY * delta;
        }
        
        this.bitmap.x = this.x;
        this.bitmap.y = this.y + this.getHalfHeight();
        
        if ( destroy ) {
            this.destroy();
        }
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Bonus();
    }
    
    return instance;
});