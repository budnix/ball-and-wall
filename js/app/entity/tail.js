
define('app/entity/tail', 
[
    'app/entity/_base', 'app/preloader', 'app/game-options', 'app/stage', 'app/core/_'
], 
function(EntityBase, preloader, gameOptions, stage, core) {

    function Tail() {
        EntityBase.call(this);
        this.id = 'tail';
        this.width = 22;
        this.height = 22;
        this.coords = [];
        this.texture = 'default';
        this.size = 'normal';
        this.options = {
            particles: 20
        };
    }
    
    Tail.prototype = Object.create(EntityBase.prototype, {
        constructor: {
            value: Tail,
            enumerable: false
        }
    });
    
    /**
     * @method init
     * @param {Object} options
     */
    Tail.prototype.init = function(options) {
        this.options = $.merge(this.options, options || {});
        this.options.particles = (this.options.particles / gameOptions.get('fps_ratio')) >> 0;
        
        var alphaStep = 0.025 * gameOptions.get('fps_ratio');

        for ( var i = 0, e; i < this.options.particles; i++ ) {
            e = new EntityBase();
            e.init(new createjs.Bitmap(preloader.get('c-particle-' + this.size + '-' + this.texture).src));
            e.bitmap.alpha = i * alphaStep;
            e.setLayerId(599);
            this.childs.push(e);
        }
        stage.add(this);
    };
    
    /**
     * @method hide
     * @return {Tail}
     */
    Tail.prototype.hide = function() {
        $.each(this.childs, function(i, child) {
            child.hide();
        });
        
        return this;
    };
    
    /**
     * @method show
     * @return {Tail}
     */
    Tail.prototype.show = function() {
        $.each(this.childs, function(i, child) {
            child.show();
        });
        
        return this;
    };
    
    /**
     * @method create
     * @param {Object} options
     * @return {Tail}
     */
    Tail.prototype.create = function(options) {
        this.init(options);
        
        return this;
    };
    
    /**
     * @method createNew
     * @param {Object} options
     * @return {Tail}
     */
    Tail.prototype.createNew = function(options) {
        var tail = new Tail();
        
        tail.init(options);
        
        return tail;
    };

    /**
     * @method destroy
     */
    Tail.prototype.destroy = function() {
        EntityBase.prototype.destroy.call(this);
        $.each(this.childs, function(i, child) {
            child.destroy();
        });
        this.childs = [];
    };
    
    /**
     * @method setSize
     * @param {String} sizeName
     * @return {Tail}
     */
    Tail.prototype.setSize = function(sizeName) {
        this.size = sizeName;
        this._updateTexture();
        
        return this;
    };
    
    /**
     * @method setTexture
     * @param {Image} image
     * @return {Tail}
     */
    Tail.prototype.setTexture = function(image) {
        this.texture = image;
        this._updateTexture();
        
        return this;
    };
    
    /**
     * @method _updateTexture
     */
    Tail.prototype._updateTexture = function() {
        if ( this.steelMode ) {
            return;
        }
        var l = this.childs.length;
        
        while ( --l ) {
            this.childs[l].setTexture(preloader.get('c-particle-' + (this.size ? this.size + '-' : '') + this.texture));
        }
    };
    
    /**
     * @method steel
     * @param {Boolean} isSteel
     */
    Tail.prototype.steel = function(isSteel) {
        var l = this.childs.length;
        
        this.steelMode = isSteel;
        
        if ( this.steelMode ) {
            while ( --l ) {
                this.childs[l].setTexture(preloader.get('c-particle-big-steel'));
            }
        } else {
            this._updateTexture();
        }
    };
    
    /**
     * @method animate
     * @return {Tail}
     */
    Tail.prototype.animate = function(params, duration, callback) {
        var l = this.childs.length;
        
        while ( --l ) {
            this.childs[l].animate(params, duration, callback);
        }
        
        return this;
    };

    /**
     * @method addHeadPos
     * @param {Number} x
     * @param {Number} y
     */
    Tail.prototype.addHeadPos = function(x, y) {
        this.coords.push({x: x, y: y});
        
        if ( this.coords.length >= this.options.particles ) {
            this.coords = this.coords.slice(this.coords.length - this.options.particles, this.coords.length);
        }
    };

    /**
     * @method update
     * @param {Object} event
     */
    Tail.prototype.update = function(event) {
        var i = 0,
            len = this.options.particles,
//            alphaStep = 0.025 * gameOptions.get('fps_ratio'),
            particle,
            diff;

        diff = 2 * core.helperApp.pixelRatio();

        for ( i = 0; i < len; i++ ) {
            if ( !this.coords[i] ) {
                continue;
            }
            particle = this.childs[i];
//            particle.bitmap.alpha = i * alphaStep;
            particle.setPos(this.coords[i].x - diff, this.coords[i].y - diff);
        }
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Tail();
    }
    
    return instance;
});