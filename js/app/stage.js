
define('app/stage', 
[
    'app/preloader', 'app/input/_', 'app/sound', 'app/episodes/_', 'app/core/_'
], 
function(preloader, input, sound, episode, core) {
    
    function Stage() {
        this.element = $('#a-game-canvas');
        this.stage = new createjs.Stage('a-game-canvas');
        this.bgFrontWidthHalfWidth = null;
        this.bgBackWidthHalfWidth = null;
        this.backgroundFront = null;
        this.backgroundBack = null;
        this.earthquakeParams = null;
        this.states = {};
        this.timers = {};
        this.initEvents();
        
        this.element.attr('width', 798 * core.helperApp.pixelRatio());
        this.element.attr('height', 462 * core.helperApp.pixelRatio());
        
        if ( core.helperApp.pixelRatio() >= 2 ) {
            this.element.css('width', '798px');
            this.element.css('height', '462px');
        }
    }
    
    /**
     * @method initEvents
     */
    Stage.prototype.initEvents = function() {
//        this.stage.canvas.bind('click', $.proxy(this.onCanvasClick, this));
    };
    
    /**
     * @method getWidth
     * @return {Number}
     */
    Stage.prototype.getWidth = function() {
        return this.stage.canvas.width;
    };
    
    /**
     * @method getHeight
     * @return {Number}
     */
    Stage.prototype.getHeight = function() {
        return this.stage.canvas.height;
    };
    
    /**
     * @method getScale
     * @return {Number}
     */
    Stage.prototype.getScale = function() {
        return $(this.stage.canvas).width() / this.getWidth();
    };
    
    /**
     * @method add
     * @param {EntityBase} entity
     */
    Stage.prototype.add = function(entity) {
        if ( entity.id > 0 ) {
                this.stage.addChild(entity);
            } else {
                this.stage.addChild(entity.bitmap);
            $.each(entity.childs || [], function(index, child) {
                this.add(child);
            }.bind(this));
            
            if ( entity.initDefaults ) {
                entity.initDefaults();
            }
        }
        // TODO To consider thinks about sorting layers
        if ( episode.getName() == 'pegasus' ) {
            this.sortChildrenByLayer();
        }
    };
    
    /**
     * @method remove
     * @param {EntityBase} entity
     */
    Stage.prototype.remove = function(entity) {
        if ( !entity || entity.id > 0 ) {
            this.stage.removeChild(entity);
        } else {
            this.stage.removeChild(entity.bitmap);
        }
    };
    
    /**
     * @method clear
     */
    Stage.prototype.clear = function() {
        this.stage.clear();
        this.stage.removeAllChildren();
        
        this.backgroundBack = new createjs.Bitmap(preloader.get('c-canvas-bg-back').src);
        this.backgroundBack.layerId = 1;
        this.stage.addChild(this.backgroundBack);
        this.bgBackWidthHalfWidth = (preloader.get('c-canvas-bg-back').width - this.getWidth()) / 2;

        this.backgroundMid = new createjs.Bitmap(preloader.get('c-canvas-bg-mid').src);
        this.backgroundMid.layerId = 2;
        this.stage.addChild(this.backgroundMid);
        this.bgMidWidthHalfWidth = (preloader.get('c-canvas-bg-mid').width - this.getWidth()) / 2;
        
        this.backgroundFront = new createjs.Bitmap(preloader.get('c-canvas-bg-front').src);
        this.backgroundFront.layerId = 3;
        this.stage.addChild(this.backgroundFront);
        this.bgFrontWidthHalfWidth = (preloader.get('c-canvas-bg-front').width - this.getWidth()) / 2;
    };
    
    /**
     * @method update
     * @param {Object} event
     */
    Stage.prototype.update = function(event) {
        var x;
        
        if ( this.earthquakeParams ) {
            this.stage.x = (Math.random() * this.earthquakeParams.x) - this.earthquakeParams.x / 2;
            this.stage.y = (Math.random() * this.earthquakeParams.y) - this.earthquakeParams.y / 2;
        } else {
            this.stage.x = 0;
            this.stage.y = 0;
        }
        
        this.stage.update(event);
        
        if ( this.bgFrontWidthHalfWidth ) {
            x = (this.getWidth() - input.pointer.x) / 15;
            this.backgroundFront.x = - ((this.getWidth() / 30) - x) - this.bgFrontWidthHalfWidth;
        }
        if ( this.bgMidWidthHalfWidth ) {
            x = (this.getWidth() - input.pointer.x) / 50;
            this.backgroundMid.x = - ((this.getWidth() / 100) - x) - this.bgMidWidthHalfWidth;
        }
        if ( this.bgBackWidthHalfWidth ) {
            x = (this.getWidth() - input.pointer.x) / 120;
            this.backgroundBack.x = - ((this.getWidth() / 240) - x) - this.bgBackWidthHalfWidth;
        }
    };
    
    /**
     * @method sortChildrenByLayer
     * @return {Stage}
     */
    Stage.prototype.sortChildrenByLayer = function() {
        this.stage.sortChildren(function(object1, object2) {
            object1.layerId = object1.layerId || 1;
            object2.layerId = object2.layerId || 1;

            if ( object1.layerId > object2.layerId ) {
                return 1;
            } else if ( object1.layerId < object2.layerId ) {
                return -1;
            } else if ( object1.id > object2.id ) {
                return 1;
            } else if ( object1.id < object2.id ) {
                return -1;
            }

            return 0;
        });  
    };
    
    /**
     * @method earthquake
     * @param {Number} x
     * @param {Number} y
     * @param {Number} duration
     * @param {Boolean} playSound
     * @return {Stage}
     */
    Stage.prototype.earthquake = function(x, y, duration, playSound) {
        var _this = this;
        
        this.earthquakeParams = {
            x: x * core.helperApp.pixelRatio(),
            y: y * core.helperApp.pixelRatio()
        };
        if ( this.timers.earthquake ) {
            clearTimeout(this.timers.earthquake);
        }
        if ( playSound === undefined || playSound === true ) {
            sound.stop('earthquake');
            sound.play('earthquake');
        }
        
        this.timers.earthquake = setTimeout(function() {
            _this.earthquakeParams = null;
            _this.timers.earthquake = null;
            
            if ( playSound === undefined || playSound === true ) {
                sound.stop('earthquake');
            }
        }, duration);
        
        return this;
    };
    
    /**
     * @method getPaddle
     * @return {EntityPaddle}
     */
    Stage.prototype.getPaddle = function() {
        return this.getPaddles().reset().current();
    };
    
    /**
     * @method getPaddles
     * @return {Paddles}
     */
    Stage.prototype.getPaddles = function() {
        return this.getEntities().paddles;
    };
    
    /**
     * @method getBall
     * @return {Ball}
     */
    Stage.prototype.getBall = function() {
        return this.getBalls().reset().current();
    };
    
    /**
     * @method getBalls
     * @return {Balls}
     */
    Stage.prototype.getBalls = function() {
        return this.getEntities().balls;
    };
    
    /**
     * @method getBlocks
     * @return {Blocks}
     */
    Stage.prototype.getBlocks = function() {
        return require('app/levels').getBlocks();
    };
    
    /**
     * @method getBonuses
     * @return {Bonuses}
     */
    Stage.prototype.getBonuses = function() {
        return require('app/levels').getBonuses();
    };
    
    /**
     * @method getEntities
     * @return {Object}
     */
    Stage.prototype.getEntities = function() {
        return require('app/entities/_');
    };
    
    /**
     * @method onCanvasClick
     * @param {Object} event
     */
//    Stage.prototype.onCanvasClick = function(event) {
//        this.emit('click', event);
//    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Stage();
    }
    
    return instance;
});