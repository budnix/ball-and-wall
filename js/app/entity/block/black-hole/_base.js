
define('app/entity/block/black-hole/_base', 
[
    'app/entity/block/_base', 'app/entity/_base', 'app/entity/particle', 'app/stage', 'app/game-options', 'app/preloader', 'app/core/_'
], 
function(BlockBase, EntityBase, particle, stage, gameOptions, preloader, core) {

    function BlackHoleBase() {
        BlockBase.call(this);
        this.id = 'black-hole-base';
        this.options = {
            particles: 50
        };
        this.angle = 0;
        this.angleSpeed = 0;
        this.dir = -1;
    }
    
    BlackHoleBase.prototype = Object.create(BlockBase.prototype, {
        constructor: {
            value: BlackHoleBase,
            enumerable: false
        }
    });

    /**
     * @method init
     * @param {Object} options
     */
    BlackHoleBase.prototype.init = function(options) {
        var j = 0, len, p;
        
        this.options = $.extend(this.options, options || {});
        this.type = this.options.type || {};
        this.typeId = this.type.id;
        this.angleSpeed = Math.random() * 2.5 + 0.5;
        EntityBase.prototype.init.call(this, new createjs.Bitmap(preloader.get('c-block-' + this.id).src));
        this.setLayerId(395);
        len = this.options.particles;
        
        if ( core.helperBrowser.isMobile ) {
            len = 0;
        }
        for ( j = 0; j < len; j++ ) {
            var distance = Math.random() * 40 * core.helperApp.pixelRatio() + (17 * core.helperApp.pixelRatio());

            p = new particle.createNew({
                shape: 'circle',
                radius: Math.random() * core.helperApp.pixelRatio() + 0.1,
                color: options.type.color
            });
            p.setLayerId(396);
            p.bitmap.alpha = Math.random();
//            p.animate(options.type.particle_animation);
            p.setDistance(distance);
            p.setAngle(Math.random() * Math.PI * 2);
            this.childs.push(p);
        }
    };
    
    /**
     * @method create
     * @param {Object} options
     * @return {BlackHoleBase}
     */
    BlackHoleBase.prototype.create = function(options) {
        this.init(options);
        
        return this;
    };
    
    /**
     * @method createNew
     * @param {Object} options
     * @return {BlackHoleBase}
     */
    BlackHoleBase.prototype.createNew = function(options) {
        var blackHole = new BlackHoleBase();
        
        blackHole.init(options);
        
        return blackHole;
    };
    
    /**
     * @method setPos
     * @param {Number} x
     * @param {Number} y
     */
    BlackHoleBase.prototype.setPos = function(x, y) {
        var _this = this;
        
        EntityBase.prototype.setPos.call(this, x, y);
        this.x = this.initX = x;
        this.y = this.initY = y;
        
        $.each(this.childs, function(i, child) {
            var d = child.distance,
                childX = x + (_this.getHalfWidth() || 38),
                childY = y + (_this.getHalfHeight() || 38);
            
            child.setPos(childX, childY);
            child.setX(childX + Math.sin(Math.random() * 6) * d);
            child.setY(childY + Math.cos(Math.random() * 6) * d);
        });
    };

    /**
     * @method destroy
     */
    BlackHoleBase.prototype.destroy = function() {
        $.each(this.childs, function(i, child) {
            child.destroy();
        });
        this.childs = [];
        EntityBase.prototype.destroy.call(this);
    };
    
    /**
     * @method animateRocks
     * @param {String} mode
     */
    BlackHoleBase.prototype.animateRocks = function(mode) {
        $.each(this.childs, function(i, child) {
            child.animateMode(mode);
        });
    };

    /**
     * @method update
     * @param {Object} event
     */
    BlackHoleBase.prototype.update = function(event) {
        var i = 0, len;

        len = this.options.particles;

        for ( i = 0; i < len; i++ ) {
            if ( !this.childs.hasOwnProperty(i) ) {
                continue;
            }
            this.childs[i].update(event);
        }
        
        this.bitmap.regX = this.getHalfWidth();
        this.bitmap.regY = this.getHalfHeight();

        if ( this.dir > 0 ) {
            this.angle = this.angle + this.angleSpeed * gameOptions.get('fps_ratio');
        } else {
            this.angle = this.angle - this.angleSpeed * gameOptions.get('fps_ratio');
        }
        if ( this.angle >= 360 ) {
            this.angle = 0;
        }
        this.bitmap.rotation = this.angle;
        this.bitmap.x = this.initX + this.bitmap.regX;
        this.bitmap.y = this.initY + this.bitmap.regY;
        
        this.updateBalls(this.bitmap.x, this.bitmap.y);
    };
    
    /**
     * @method updateBalls
     */
    BlackHoleBase.prototype.updateBalls = function(entityX, entityY) {};

    return BlackHoleBase;
});