
define('app/entity/cloud', 
[
    'app/entity/_base', 'app/preloader', 'app/game-options', 'app/episodes/_'
], 
function(EntityBase, preloader, gameOptions, episode) {

    var
        /**
         * @property _scoreOptions
         * @static
         * @private
         * @type {Object}
         */
        _cloudOptions = {};
                

    function Cloud() {
        EntityBase.call(this);
        this.id = 'cloud';
        this.life = 1;
        this.x = 0;
        this.y = 0;
        this.initX = 0;
        this.initY = 0;
        this.rotation = 0;
        this.dir = 1;
    }
    
    Cloud.prototype = Object.create(EntityBase.prototype, {
        constructor: {
            value: Cloud,
            enumerable: false
        }
    });
    
    /**
     * @method init
     * @param {Object} options
     */
    Cloud.prototype.init = function(options) {
        EntityBase.prototype.init.call(this, new createjs.Bitmap(preloader.get('c-cloud').src), options);
        this.dir = ~~(Math.random() * 2) ? 1 : -1;
        this.speed = Math.max(Math.min(Math.random() / 50, 0.25), 0.05);
        this.bitmap.alpha = 0;
        this.setLayerId(900);
        this.animate({
            alpha: 0.9
        }, 1000);
    };
    
    /**
     * @method create
     * @param {Object} options
     * @return {Cloud}
     */
    Cloud.prototype.create = function(options) {
        this.init(options);
        
        return this;
    };
    
    /**
     * @method createNew
     * @param {Object} options
     * @return {Cloud}
     */
    Cloud.prototype.createNew = function(options) {
        var cloud = new Cloud();

        cloud.init(options);
        
        return cloud;
    };
    
    /**
     * @method setPos
     * @param {Number} x
     * @param {Number} y
     */
    Cloud.prototype.setPos = function(x, y) {
        EntityBase.prototype.setPos.call(this, x, y);
        this.x = this.initX = x;
        this.y = this.initY = y;
    };

    /**
     * @method update
     * @param {Object} event
     */
    Cloud.prototype.update = function(event) {
        if ( this.life === -1 ) {
            return;
        }
        if ( this.life <= 0 ) {
            this.life = -1;
            this.animate({
                alpha: 0
            }, 1000, function() {
                this.destroy();
            });
            
            return;
        }
        this.life -= (0.001 * gameOptions.get('fps_ratio'));
        this.x = this.getX() + (this.speed * this.dir);
        
        this.bitmap.x = this.x;
        this.bitmap.y = this.y;
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Cloud();
    }
    
    return instance;
});