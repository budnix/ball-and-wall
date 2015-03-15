
define('app/entity/particle', 
[
    'app/entity/_base'
], 
function(EntityBase) {
    
    function Particle() {
        EntityBase.call(this);
        this.id = 'particle';
        this.x = 0;
        this.y = 0;
        this.initX = 0;
        this.initY = 0;
        this.distance = 0;
        this.initDistance = 0;
        this.angle = 0;
        this.animateProps = {};
    }
    
    Particle.prototype = Object.create(EntityBase.prototype, {
        constructor: {
            value: Particle,
            enumerable: false
        }
    });

    /**
     * @method init
     */
    Particle.prototype.init = function(options) {
        var g = new createjs.Graphics();

        if ( options.color ) {
            g.beginFill(options.color);
        }
        g['draw' + options.shape.substr(0, 1).toUpperCase() + options.shape.substr(1)](options.x || 0, options.y || 0, options.radius || 0);
        
        EntityBase.prototype.init.call(this, new createjs.Shape(g));
        this.setLayerId(400);
        this.width = (options.radius || 0) * 2;
        this.height = this.width;
    };
    
    /**
     * @method create
     * @return {Particle}
     */
    Particle.prototype.create = function(options) {
        this.init(options);
        
        return this;
    };
    
    /**
     * @method createNew
     * @return {Particle}
     */    
    Particle.prototype.createNew = function(options) {
        var particle;
        
        particle = new Particle();
        particle.init(options);
        
        return particle;
    };
    
    /**
     * @method animateMode
     * @param {Array} props
     */
    Particle.prototype.animateMode = function(props) {
        var _this = this;
        
        $.each(props || [], function(i, prop) {
            _this.animateProps[prop.replace(/\+|\-/, '')] = /\+$/.test(prop) ? 1 : -1;
        });
    };
    
    /**
     * @method setDistance
     * @param {Number} distance
     */
    Particle.prototype.setDistance = function(distance) {
        this.distance = distance || 0;
        this.initDistance = this.distance;
    };
    
    /**
     * @method setAngle
     * @param {Number} angle Angle in radians
     */
    Particle.prototype.setAngle = function(angle) {
        this.angle = angle || 0;
    };

    /**
     * @method setPos
     * @param {Number} x
     * @param {Number} y
     */
    Particle.prototype.setPos = function(x, y) {
        EntityBase.prototype.setPos.call(this, x, y);
        this.x = this.initX = x;
        this.y = this.initY = y;
    };

    /**
     * @method update
     * @param {Object} event
     */
    Particle.prototype.update = function(event) {
        var x, y, diff;
        
        if ( this.animateProps.angle ) {
            diff = ((7 / this.getWidth()) / 1000) * this.animateProps.angle;
            this.angle = this.angle + diff;
        }
        if ( this.animateProps.distance ) {
            diff = ((7 / this.getWidth()) / 20) * this.animateProps.distance;
            this.distance = this.distance + diff;
            
            if ( this.animateProps.distance === 1 ) {
                if ( this.distance > this.initDistance ) {
                    this.distance = 0;
                }
            } else {
                if ( this.distance <= 0 ) {
                    this.distance = this.initDistance;
                }
            }
        }
        x = Math.sin(this.angle) * this.distance;
        y = Math.cos(this.angle) * this.distance;

        this.bitmap.x = this.initX + x;
        this.bitmap.y = this.initY + y;
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Particle();
    }
    
    return instance;
});