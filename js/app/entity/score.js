
define('app/entity/score', 
[
    'app/entity/_base', 'app/game-options', 'app/episodes/_', 'app/core/_'
], 
function(EntityBase, gameOptions, episode, core) {

    var
        /**
         * @property _scoreOptions
         * @static
         * @private
         * @type {Object}
         */
        _scoreOptions = {};
                

    function Score() {
        EntityBase.call(this);
        this.options = {
            animationType: null
        };
        this.id = 'score';
        this.life = 1;
        this.x = 0;
        this.y = 0;
        this.initX = 0;
        this.initY = 0;
        this.rotate = 0;
        this.dir = 1;
    }
    
    Score.prototype = Object.create(EntityBase.prototype, {
        constructor: {
            value: Score,
            enumerable: false
        }
    });
    
    /**
     * @method init
     * @param {String} value
     * @param {Object} options
     */
    Score.prototype.init = function(value, options) {
        var text;
        
        _scoreOptions = episode.getManifest().bonus_catch_label;
        text = new createjs.Text(value || '', _scoreOptions.font, _scoreOptions.color);
        EntityBase.prototype.init.call(this, text, options);
        this.setLayerId(540);
        this.dir = ~~(Math.random() * 2) ? 1 : -1;
        
        if ( !this.options.animationType ) {
            this.options.animationType = _scoreOptions.animation;
        }
    };
    
    /**
     * @method create
     * @param {String} value
     * @param {Object} options
     * @return {Score}
     */
    Score.prototype.create = function(value, options) {
        this.init(value, options);
        
        return this;
    };
    
    /**
     * @method createNew
     * @param {String} value
     * @param {Object} options
     * @return {Score}
     */
    Score.prototype.createNew = function(value, options) {
        var score = new Score();
        score.init(value, options);
        
        return score;
    };
    
    /**
     * @method setPos
     * @param {Number} x
     * @param {Number} y
     */
    Score.prototype.setPos = function(x, y) {
        EntityBase.prototype.setPos.call(this, x, y);
        this.x = this.initX = x;
        this.y = this.initY = y;
    };

    /**
     * @method update
     * @param {Object} event
     */
    Score.prototype.update = function(event) {
        if ( this.life <= 0 ) {
            this.destroy();
            
            return;
        }
        
        if ( this.options.animationType == 'up' ) {
            this.life -= (0.01 * gameOptions.get('fps_ratio') * core.helperApp.pixelRatio());
            this.y = this.getY() - (0.5 * core.helperApp.pixelRatio());
            this.bitmap.alpha = this.life;
            
        } else if ( this.options.animationType == 'rotated' || this.options.animationType == 'up-rotated' ) {
            this.life -= (0.01 * gameOptions.get('fps_ratio') * core.helperApp.pixelRatio());
            
            if ( this.options.animationType == 'up-rotated' ) {
                this.y = this.getY() - (0.8 * core.helperApp.pixelRatio());
            }
            this.bitmap.alpha = this.life;
            
            this.bitmap.regX = this.getHalfWidth();
            this.bitmap.regY = this.getHalfHeight();
            
            if ( this.dir > 0 ) {
                this.rotate = this.rotate + (gameOptions.get('fps_ratio') * core.helperApp.pixelRatio());
            } else {
                this.rotate = this.rotate - (gameOptions.get('fps_ratio') * core.helperApp.pixelRatio());
            }
            if ( this.rotate >= 360 ) {
                this.rotate = 0;
            }
            this.bitmap.rotation = this.rotate;
            this.x = this.initX + this.getHalfWidth();
            
        } else if ( this.options.animationType == 'scale-down' ) {
            this.life -= (0.01 * gameOptions.get('fps_ratio') * core.helperApp.pixelRatio());
            this.bitmap.alpha = Math.min((1 * core.helperApp.pixelRatio()) - this.life, 0.8 * core.helperApp.pixelRatio());
            this.bitmap.scaleX = this.life;
            this.bitmap.scaleY = this.life;
            
            this.x = this.initX + (this.getHalfWidth() - (this.getWidth() * this.bitmap.scaleX) / (2 * core.helperApp.pixelRatio()));
            this.y = this.initY + (this.getHalfHeight() - (this.getHeight() * this.bitmap.scaleY) / (2 * core.helperApp.pixelRatio()));
        }
        
        this.bitmap.x = this.x;
        this.bitmap.y = this.y;
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Score();
    }
    
    return instance;
});