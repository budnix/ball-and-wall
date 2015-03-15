
define('app/input/pointer', 
[
    'app/core/_'
], 
function(core) {
    
    function Pointer() {
        core.EventEmitter.call(this);
        this.canvasElement = $('#a-game-canvas');
        // chrome on windows detect touch too
        this.isTouchDevice = document.ontouchstart === null && core.helperBrowser.isMobile;
        this.x = 0;
        this.y = 0;
        this.leftClick = false;
        this.rightClick = false;
        this.preventDefault = true;
        this.canvasCoords = {};
        this.initialize();
    }
    
    Pointer.prototype = Object.create(core.EventEmitter.prototype, {
        constructor: {
            value: Pointer,
            enumerable: false
        }
    });
    
    /**
     * @method initialize
     */
    Pointer.prototype.initialize = function() {
        this.onResize();
        this.initEvents();
    };
    
    /**
     * @method updateStageCoords
     */
    Pointer.prototype.updateStageCoords = function() {
        this.onResize();
    };

    /**
     * @method initEvents
     */
    Pointer.prototype.initEvents = function() {
        var _this = this, d = $(document);
        
        if ( this.isTouchDevice ) {
            d.bind('touchstart', function(event) {
                _this.onPointerDown(event);
            });
            d.bind('touchend', function(event) {
                _this.onPointerUp(event);
            });
            d.bind('touchcancel', function(event) {
                _this.onPointerUp(event);
            });
            d.bind('touchmove', function(event) {
                _this.onPointerMove(event);
            });
        } else {
            d.bind('mousedown', function(event) {
                _this.onPointerDown(event);
            });
            d.bind('mouseup', function(event) {
                _this.onPointerUp(event);
            });
            d.bind('mousemove', function(event) {
                _this.onPointerMove(event);
            });   
        }
        $(window).bind('resize', $.proxy(this.onResize, this));
        this.canvasElement.bind('click', $.proxy(this.onCanvasClick, this));
        core.mediator.addListener('windowOpen', $.proxy(this.onWindowOpen, this));
        core.mediator.addListener('windowClose', $.proxy(this.onWindowClose, this));
    };

    /**
     * @method isClick
     * @return {Boolean}
     */
    Pointer.prototype.isClick = function() {
        return this.isLeftClick();
    };
    
    /**
     * @method isLeftClick
     * @return {Boolean}
     */
    Pointer.prototype.isLeftClick = function() {
        return this.leftClick;
    };
    
    /**
     * @method isRightClick
     * @return {Boolean}
     */
    Pointer.prototype.isRightClick = function() {
        return this.rightClick;
    };
    
    /**
     * @method onCanvasClick
     */
    Pointer.prototype.onCanvasClick = function() {
//        this.fireEvent('click');
    };

    /**
     * @method onPointerDown
     */
    Pointer.prototype.onPointerDown = function(event) {
        if ( this.isTouchDevice ) {
            this.leftClick = true;
        } else {
            // left click
            if ( event.button === 0 ) {
                this.leftClick = true;
            // right click
            } else if ( event.button === 2 ) {
                this.rightClick = true;
            }
        }
    };

    /**
     * @method onPointerUp
     */
    Pointer.prototype.onPointerUp = function(event) {
        if ( this.isTouchDevice ) {
            this.leftClick = false;
            this.rightClick = false;
        } else {
            // left click
            if ( event.button === 0 ) {
                this.leftClick = false;
            // right click
            } else if ( event.button === 2 ) {
                this.rightClick = false;
            }
        }
    };

    /**
     * @method onPointerMove
     * @param {Object} event
     */
    Pointer.prototype.onPointerMove = function(event) {
        var dx, dy;

        event.preventDefault();

        if ( this.isTouchDevice ) {
            var touches = event.originalEvent.changedTouches,
                isMsPointer = window.navigator.msPointerEnabled,
                firstTouch = isMsPointer ? event.originalEvent : touches[0];

            if ( isMsPointer && !event.isPrimary ) {
                return;
            }
            if ( !isMsPointer ) {
                if ( event.originalEvent && event.originalEvent.length > 1 ) {
                    return;
                }
            }
            
            dx = firstTouch.clientX;
            dy = firstTouch.clientY;
        } else {
            dx = event.clientX;
            dy = event.clientY;
        }
        dx = dx - this.canvasCoords.left;
        dy = dy - this.canvasCoords.top;
        
        this.x = dx > 0 ? (dx < this.canvasCoords.width ? dx : this.canvasCoords.width) : 0;
        this.y = dy > 0 ? (dy < this.canvasCoords.height ? dy : this.canvasCoords.height) : 0;
    };

    /**
     * @method onResize
     */
    Pointer.prototype.onResize = function() {
        this.canvasCoords = this.canvasElement.offset();
        this.canvasCoords.width = this.canvasElement.width();
        this.canvasCoords.height = this.canvasElement.height();
    };
    
    /**
     * @method onWindowOpen
     */
    Pointer.prototype.onWindowOpen = function() {
        this.preventDefault = false;
    };
    
    /**
     * @method onWindowClose
     */
    Pointer.prototype.onWindowClose = function() {
        if ( !$('.lbx-window').length ) {
            this.preventDefault = true;
        }
    };
   
    var instance = null;
    
    if ( instance === null ) {
        instance = new Pointer();
    }
    
    return instance;
});