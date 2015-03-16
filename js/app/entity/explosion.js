
define('app/entity/explosion', 
[
    'app/entity/_base', 'app/stage', 'app/game-options', 'app/core/_'
], 
function(EntityBase, stage, gameOptions, core) {

    function Explosion() {
        EntityBase.call(this);
        this.id = 'explosion';
        this.width = 16;
        this.height = 16;
        this.centerX = 0;
        this.centerY = 0;
        this.life = 0;
        this.options = {
            particles: 20,
            colors: ['#eeeeee']
        };
        this.entities = [];
        this.parent = true;
        this.exploding = false;
    }
    
    Explosion.prototype = Object.create(EntityBase.prototype, {
        constructor: {
            value: Explosion,
            enumerable: false
        }
    });

    /**
     * @method init
     * @param {Object} options
     * @param {Boolean} child
     */
    Explosion.prototype.init = function(options, child) {
        var i = 0, j = 0;
        
        this.options = $.merge(this.options, options || {});
        
        if ( child ) {
            for ( j = 0; j < this.options.particles; j++ ) {
                var particle, shape;

                shape = new createjs.Shape();
                shape.graphics.beginFill('#eeeeee').drawCircle(0, 0, Math.random() * 4 * core.helperApp.pixelRatio());
                particle = new EntityBase();
                particle.init(shape);
                particle.setLayerId(599);
                particle.setPos(-100, -100);
                this.childs.push(particle);
                this.parent = false;
            }
        } else {
            for ( i = 0; i < 10; i++ ) {
                var explosion = new Explosion();
                
                explosion.init(options, true);
                this.entities.push(explosion);
            }
        }
        stage.add(this);
    };
    
    /**
     * @method create
     * @param {Object} options
     * @param {Boolean} child
     * @return {Explosion}
     */
    Explosion.prototype.create = function(options, child) {
        this.init(options, child);
        
        return this;
    };
    
    /**
     * @method createNew
     * @param {Object} options
     * @param {Boolean} child
     * @return {Explosion}
     */
    Explosion.prototype.createNew = function(options, child) {
        var explosion = new Explosion();
        
        explosion.init(options, child);
        
        return explosion;
    };

    /**
     * @method destroy
     */
    Explosion.prototype.destroy = function() {
        if ( this.parent ) {
            $.each(this.entities, function(i, entity) {
                entity.destroy();
            });
            this.entities = [];
        } else {
            $.each(this.childs, function(i, child) {
                child.destroy();
            });
            this.childs = [];
        }
    };

    /**
     * @method setColors
     * @param {Array} colors
     * @return {Explosion}
     */
    Explosion.prototype.setColors = function(colors) {
        this.options.colors = colors;

        return this;
    };

    /**
     * @method explode
     * @param {Number} x
     * @param {Number} y
     * @return {Boolean}
     */
    Explosion.prototype.explode = function(x, y) {
        var i = 0, len;

        if ( this.parent ) {
            len = this.entities.length;

            for ( i = 0; i < len; i++ ) {
                if ( !this.entities.hasOwnProperty(i) ) {
                    continue;
                }
                if ( this.entities[i].explode(x, y) ) {
                    break;
                }
            }

            return true;
        }
        if ( this.exploding ) {
            return false;
        }
        len = this.options.particles;

        var speed,
            particle;

        for ( i = 0; i < len; i++ ) {
            if ( !this.childs.hasOwnProperty(i) ) {
                continue;
            }
            particle = this.childs[i];
            speed = this._getRandomSpeed();
            particle.setSpeedStep(speed.x, speed.y);
            particle.setPos(x, y);
        }
        this.life = 1;
        this.exploding = true;

        return true;
    };

    /**
     * @method update
     * @param {Object} event
     */
    Explosion.prototype.update = function(event) {
        var i = 0, len;

        if ( this.parent ) {
            len = this.entities.length;

            for ( i = 0; i < len; i++ ) {
                if ( !this.entities.hasOwnProperty(i) ) {
                    continue;
                }
                this.entities[i].update(event);
            }

            return;
        }
        if ( this.life <= 0 ) {
            this.exploding = false;

            return;
        }
        len = this.options.particles;

        var particle,
            delta = event.delta * (createjs.Ticker.getFPS() / 1000);

        this.life -= (delta / (gameOptions.get('fps') / 2));

        for ( i = 0; i < len; i++ ) {
            if ( !this.childs.hasOwnProperty(i) ) {
                continue;
            }
            particle = this.childs[i];

            particle.setPos(particle.getSpeedStep().x * delta * gameOptions.get('fps_ratio') + particle.getX(), 
                    particle.getSpeedStep().y * delta * gameOptions.get('fps_ratio') + particle.getY());
            particle.bitmap.alpha = this.life;
            particle.bitmap.scaleX = this.life;
            particle.bitmap.scaleY = this.life;
        }
    };

    /**
     * @method _getRandomSpeed
     * @return {Number}
     */
    Explosion.prototype._getRandomSpeed = function() {
        var angle = (Math.random() * 360) * Math.PI / 180;

        return {
            x: (Math.random() * 5 * core.helperApp.pixelRatio() + 0.1) * Math.cos(angle), 
            y: - (Math.random() * 5 * core.helperApp.pixelRatio() + 0.1) * Math.sin(angle)
        };
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Explosion();
    }
    
    return instance;
});