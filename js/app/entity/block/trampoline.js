
define('app/entity/block/trampoline', 
[
    'app/entity/block/_base', 'app/entity/_base', 'app/game-options', 'app/stage', 'app/preloader', 'app/episodes/_', 'app/sound'
], 
function(BlockBase, Base, gameOptions, stage, preloader, episode, sound) {
    
    var
        /**
         * @property _paddleOptions
         * @static
         * @private
         * @type {Object}
         */
        _paddleOptions = {};
    
    
    function Trampoline() {
        BlockBase.call(this);
        this.id = 'trampoline';
        this.topBitmap = null;
        this.bottomBitmap = null;
        this.springBitmap = null;
    }
    
    Trampoline.prototype = Object.create(BlockBase.prototype, {
        constructor: {
            value: Trampoline,
            enumerable: false
        }
    });

    /**
     * @method init
     * @param {Object} options
     */
    Trampoline.prototype.init = function(options) {
        var container;
        
        this.options = options || {};
        this.type = this.options.type || {};
        this.typeId = this.type.id;
        _paddleOptions = episode.getManifest().paddle;
        
        this.topBitmap = new createjs.Bitmap(preloader.get('c-block-trampoline-top').src);
        this.bottomBitmap = new createjs.Bitmap(preloader.get('c-block-trampoline-bottom').src);
        this.springBitmap = new createjs.Bitmap(preloader.get('c-block-trampoline-spring').src);

        this.height = 38;
        this.width = 38;
        this.bottomBitmap.y = 27;
        this.springBitmap.x = 38 / 2 - 12;
        this.springBitmap.y = 18;
        this.springBitmap.scaleY = 0.6;
        
        container = new createjs.Container();
        container.addChild(this.springBitmap, this.topBitmap, this.bottomBitmap);
        Base.prototype.init.call(this, container);
        this.setLayerId(500);
        stage.add(this);
    };
    
    /**
     * @method create
     * @param {Object} options
     * @return {Trampoline}
     */
    Trampoline.prototype.create = function(options) {
        this.init(options);
        
        return this;
    };
    
    /**
     * @method createNew
     * @param {Object} options
     * @return {Trampoline}
     */
    Trampoline.prototype.createNew = function(options) {
        var trampoline = new Trampoline();
        
        trampoline.init(options);
        
        return trampoline;
    };
    
    /**
     * @method bounce
     * @param {Ball} ball
     * @param {String} dir
     */
    Trampoline.prototype.bounce = function(ball, dir) {
        switch (dir) {
            case 'left':
            case 'right':
                ball.speedX = - ball.speedX;
                break;

            case 'top':
                ball.increaseSpeed(2);
                
                if ( ball.getAngle() >= 1.57 ) {
                    ball.setAngle((Math.random() / 5) + 1.57);
                } else {
                    ball.setAngle(Math.min((Math.random() / 5) + 1.27, 1.56));
                }
                this.release();
                
                // hmmm?!
                ball.speedY = - ball.speedY;
                break;
            case 'bottom':
                ball.speedY = - ball.speedY;
                break;
        }
    };

    /**
     * @method update
     * @param {Object} event
     */
    Trampoline.prototype.update = function(event) {
        
    };
    
    /**
     * @method release
     */
    Trampoline.prototype.release = function() {
        if ( this.animating ) {
            return this;
        }
        var _this = this, d = 200;
        
        this.animating = true;
        
        createjs.Tween.get(this).to({height: 56}, d, createjs.Ease.elasticOut).call(function() {
            createjs.Tween.get(_this).wait(d * 4).to({height: 38}, d * 5, createjs.Ease.linear);
        });
        createjs.Tween.get(this.bitmap).to({y: this.getY() - 18}, d, createjs.Ease.elasticOut).call(function() {
            createjs.Tween.get(_this.bitmap).wait(d * 4).to({y: _this.getY() + 18}, d * 5, createjs.Ease.linear);
        });
        createjs.Tween.get(this.bottomBitmap).to({y: 45}, d, createjs.Ease.elasticOut).call(function() {
            createjs.Tween.get(_this.bottomBitmap).wait(d * 4).to({y: 27}, d * 5, createjs.Ease.linear);
        });
        createjs.Tween.get(this.springBitmap).to({scaleY: 1.2}, d, createjs.Ease.elasticOut).call(function() {
            createjs.Tween.get(_this.springBitmap).wait(d * 4).to({scaleY: 0.6}, d * 5, createjs.Ease.linear).call(function() {
                _this.animating = false;
            });
        });
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Trampoline();
    }
    
    return instance;
});