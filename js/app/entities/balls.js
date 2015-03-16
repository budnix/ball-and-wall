
define('app/entities/balls', 
[
    'app/entities/_base', 'app/stage', 'app/input/_', 'app/dashboard', 'app/core/_', 'app/sound'
], 
function(EntitiesBase, stage, input, dashboard, core, sound) {
    
    function Balls() {
        EntitiesBase.call(this);
        this.id = 'balls';
        this.isStageClick = false;
        this.listeningStageClick = false;
        this.initialize();
    }
    
    Balls.prototype = Object.create(EntitiesBase.prototype, {
        constructor: {
            value: Balls,
            enumerable: false
        }
    });
       
    /**
     * @method initialize
     */
    Balls.prototype.initialize = function() {
        var _this = this,
            stageClickListener = $.proxy(this.onStageClick, this);
        
        core.mediator.addListener('game:game-start', (function() {
            _this.listeningStageClick = true;
            $('#' + stage.stage.canvas.id).bind('click', stageClickListener);
        }));
        core.mediator.addListener('game:game-over', (function() {
            _this.listeningStageClick = false;
            _this.isStageClick = false;
            $('#' + stage.stage.canvas.id).unbind('click', stageClickListener);
        }));
        core.mediator.addListener('game:stage-clear', (function() {
            _this.listeningStageClick = false;
            _this.isStageClick = false;
        }));
        core.mediator.addListener('game:level-start', (function() {
            _this.listeningStageClick = true;
        }));
    };
    
    /**
     * @method hide
     */
    Balls.prototype.hide = function() {
        $.each(this.childs, function(i, child) {
            child.hide();
        });
    };
    
    /**
     * @method create
     */
    Balls.prototype.create = function() {
        return EntitiesBase.prototype.create.call(this, require('app/entity/ball').createNew());
    };

    /**
     * @method update
     * @param {Object} event
     */
    Balls.prototype.update = function(event) {
        var i = this.length, isAliveBefore,
            ball, paddle;
    
        if ( i > 1 ) {
            while ( i-- ) {
                if ( this.childs[i] ) {
                    this.childs[i].update(event);
                    this.childs[i].setAsMainEntity(i ? false : true);
                    
                    if ( !this.childs[i].isAlive() ) {
                        this.childs[i].destroy();
                        this.removeChildByIndex(i);
                    }
                }
            }
            if ( !this.length ) {
                dashboard.getLives().decr();
                stage.earthquake(10, 10, 200, false);

                if ( !dashboard.getLives().get() ) {
                    core.mediator.emit('game:game-over');
                }   
            }
        } else {
            ball = this.reset().current();

            if ( !ball ) {
                return;
            }
            isAliveBefore = ball.isAlive();
            paddle = stage.getPaddle();
            ball.setAsMainEntity(true);
            ball.update(event);
            
            if ( isAliveBefore && !ball.isAlive() ) {
                dashboard.getLives().decr();
                stage.earthquake(10, 10, 200, false);

                if ( !dashboard.getLives().get() ) {
                    core.mediator.emit('game:game-over');
                }                    
            }
            if ( !isAliveBefore && !ball.isAlive() ) {
                ball.setPos(
                    stage.getPaddle().getX() + stage.getPaddle().getHalfWidth() - ball.getHalfWidth() >> 0, 
                    stage.getPaddle().getY() - ball.getHeight() >> 0
                );
                paddle.reset();
                dashboard.getSpeed().reset();
            }
            if ( (this.isStageClick || input.keyboard.isPressed('space|enter|up')) && dashboard.getLives().get() ) {
                if ( !ball.isAlive() ) {
                    sound.play('paddle-hit');
                }
                ball.setAlive(true);
                this.isStageClick = false;
            }
        }
    };
    
    /**
     * @method onStageClick
     * @param {Object} event
     */
    Balls.prototype.onStageClick = function(event) {
        if ( this.listeningStageClick ) {
            this.isStageClick = true;
        }
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Balls();
    }
    
    return instance;
});