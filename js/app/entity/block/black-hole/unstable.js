
define('app/entity/block/black-hole/unstable', 
[
    'app/entity/block/black-hole/_base', 'app/core/_', 'app/stage', 'app/episodes/_'
], 
function(BaseBlock, core, stage, episode) {

    function BlackHoleUnstable() {
        BaseBlock.call(this);
        this.id = 'black-hole/unstable';
        this.switchingMode = false;
        this.mode = 'addictive';
    }
    
    BlackHoleUnstable.prototype = Object.create(BaseBlock.prototype, {
        constructor: {
            value: BlackHoleUnstable,
            enumerable: false
        }
    });

    /**
     * @method createNew
     * @param {Object} options
     * @return {BlackHoleUnstable}
     */
    BlackHoleUnstable.prototype.createNew = function(options) {
        var blackHole = new BlackHoleUnstable();
        
        blackHole.init(options);
        blackHole.setMode('addictive');
        
        return blackHole;
    };
    
    /**
     * @methos setMode
     * @param {String} mode addictive|repulsive
     */
    BlackHoleUnstable.prototype.setMode = function(mode) {
        this.mode = mode;
        this.animateRocks(['distance' + (mode == 'addictive' ? '-' : '+')]);
    };
    
    /**
     * @method updateBalls
     * @param {Number} entityX
     * @param {Number} entityY
     */
    BlackHoleUnstable.prototype.updateBalls = function(entityX, entityY) {
        var balls, ball, force;

        if ( this.mode == 'repulsive' ) {
            force = Math.random() / 4;
        } else if ( this.mode == 'addictive' ) {
//            force = 0.1;
            force = Math.max(Math.min(Math.random() / 50, 0.15), 0.05);
        }
        balls = stage.getBalls().reset();
        ball = balls.current();
        
        while ( ball ) {
            if ( !ball.isVisible() ) {
                ball = balls.next().current();
                
                continue;
            }
            var ballCenterX = ball.getX() + ball.getHalfWidth(),
                ballCenterY = ball.getY() + ball.getHalfHeight(),
                m = core.math.vectorMagnitude(entityX, entityY, ballCenterX, ballCenterY),
                ballAngle,
                ballSpeed,
                blackHoleCenter;
            
            if ( m >= 50 ) {
                ball = balls.next().current();
                
                continue;
            }
            ballAngle = ball.getAngle();
            blackHoleCenter = Math.atan2(entityY - ballCenterY, entityX - ballCenterX);
            
//            if ( this.mode == 'addictive' ) {
//                ballAngle = blackHoleCenter;
//            } else {
            if ( blackHoleCenter > ballAngle || blackHoleCenter < ballAngle - Math.PI ) {
                ballAngle = this.mode == 'addictive' ? ballAngle + force : ballAngle - force;
            } else {
                ballAngle = this.mode == 'addictive' ? ballAngle - force : ballAngle + force;
            }
//            }
            ball.setAngle(ballAngle);
            
            if ( m < 10 && this.mode == 'addictive' && !this.switchingMode ) {
                ballSpeed = m / 2;
                
                if ( ballSpeed < ball.getSpeed() ) {
                    ball.setSpeed(ballSpeed);
                }
                if ( m <= 1 ) {
                    this.animateToRepulsiveMode(ball);
                }
            }
            ball = balls.next().current();
        }
    };
    
    /**
     * @method animateToRepulsiveMode
     * @param {Ball} ball
     */
    BlackHoleUnstable.prototype.animateToRepulsiveMode = function(ball) {
        var _this = this, 
            duration = 1000, 
            callback;
        
        this.switchingMode = true;
        
        callback = (function(ball) {
            return function() {
                var pos = _this.getRandomPos(),
                    cellHW = episode.getManifest().cell.width / 2,
                    cellHH = episode.getManifest().cell.height / 2;

                if ( pos && pos.block ) {
                    stage.getBlocks().removeChild(pos.block);
                    pos.block.destroy();
                }
                if ( pos ) {
                    _this.setPos(pos.x - cellHW, pos.y - ((_this.getHeight() - episode.getManifest().cell.height) / 2));
                }
                _this.setMode('repulsive');
                _this.show();
                _this.animate({
                    scaleX: 1, 
                    scaleY: 1
                }, duration);
                $.each(_this.childs, function(i, child) {
                    child.animate({
                        scaleX: 1, 
                        scaleY: 1
                    }, duration);
                });

                if ( pos ) {
                    ball.setPos(pos.x + cellHW, pos.y + cellHH);
                }
                ball.animate({
                    scaleX: 1, 
                    scaleY: 1,
                    x: ball.getX() - ball.getHalfWidth(), 
                    y: ball.getY() - ball.getHalfHeight()
                }, duration, function() {
                    if ( ball.tail ) {
                        ball.tail.show();
                    }
                    ball.setSpeed('normal', Math.random() * 6.28);
                });
            };
        }(ball));
        this.animate({
            scaleX: 0, 
            scaleY: 0
        }, duration, callback);
        $.each(this.childs, function(i, child) {
            child.animate({
                scaleX: 0, 
                scaleY: 0
            }, duration);
        });
        
        if ( ball.tail ) {
            ball.tail.hide();
        }
        ball.animate({
            scaleX: 0, 
            scaleY: 0,
            x: ball.getX() + ball.getHalfWidth(), 
            y: ball.getY() + ball.getHalfHeight()
        }, duration);
    };
    
    /**
     * @method getRandomPos
     * @return {Object|null}
     */
    BlackHoleUnstable.prototype.getRandomPos = function() {
        var result = [],
            cellHW = episode.getManifest().cell.width / 2,
            cellHH = episode.getManifest().cell.height / 2,
            blocks, block, grid;
        
        grid = episode.getGrid();
        blocks = stage.getBlocks().reset();
        block = blocks.current();
        
        $.each(grid, function(index, cell) {
            var excludeCell = stage.getBlocks().getChilds().filter(function(block) {
                if ( /^black\-hole/.test(block.id) && cell.x === block.getX() - cellHW && cell.y === block.getY() - cellHH ) {
                    return true;
                } else if ( cell.x === block.getX() && cell.y === block.getY() ) {
                    return true;
                }
                
                return false;
            });
            
            if ( !excludeCell.length || excludeCell[0].isDestroyable() ) {
                result.push({
                    x: cell.x,
                    y: cell.y,
                    block: excludeCell[0]
                });
            }
        });
        
        return result.length ? result[Math.max((Math.random() * (result.length - 1)) >> 0, 0)] : null;
    };

    var instance = null;
    
    if ( instance === null ) {
        instance = new BlackHoleUnstable();
    }
    
    return instance;
});