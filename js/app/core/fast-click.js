
define('app/core/fast-click', 
[
    'app/core/helper/browser'
], 
function(helperBrowser) {

    var 
        simulateClickEvent = true, 
        simulatedClickTime, 
        simulatedDblClickTimeout = 300,
        isMsPointer = window.navigator.msPointerEnabled;


    function FastClick() {
        var _this = this, d = document;
        
//        if ( helperBrowser.name == 'ie' ) {
            d.addEventListener("touchstart", function(event) {
                _this.onTouch(event);
            }, true);
            d.addEventListener("touchmove", function(event) {
                _this.onTouch(event);
            }, true);
            d.addEventListener("touchend", function(event) {
                _this.onTouch(event);
            }, true);
            d.addEventListener("touchcancel", function(event) {
                _this.onTouch(event);
            }, true);
//        }
//        } else if ( Solitaire.PLATFORM == 'wp8phone' || Solitaire.PLATFORM == 'wp8' ) {
//            d.addEventListener("MSPointerDown", function(event) {
//                _this.onTouch(event);
//            }, true);
//            d.addEventListener("MSPointerMove", function(event) {
//                _this.onTouch(event);
//            }, true);
//            d.addEventListener("MSPointerUp", function(event) {
//                _this.onTouch(event);
//            }, true);
//            d.addEventListener("MSPointerCancel", function(event) {
//                _this.onTouch(event);
//            }, true);
//        }
    }
    
    FastClick.prototype.simulateClickEvent = function(flag, delay) {
        setTimeout(function() {
            simulateClickEvent = flag;
        }, delay || 10);
    };
    
    FastClick.prototype.onTouch = function(event) {
        var excludeTags = ['INPUT', 'TEXTAREA', 'CANVAS'],
            touches = event.changedTouches,
            firstTouch = isMsPointer ? event : touches[0],
            eventType = event.type, simulatedEvent, clickEvent;

        if ( isMsPointer && !event.isPrimary ) {
            return;
        }
        if ( !isMsPointer ) {
            if ( event.touches && event.touches.length > 1 ) {
                return;
            }
        }

        switch (event.type) {
            case 'touchend': case 'MSPointerUp': eventType = 'mouseup'; break;
            case 'touchcancel': case 'MSPointerCancel': eventType = 'mouseup'; break;
            default: return;
        }
        if ( eventType == 'mouseup' && simulateClickEvent ) {
//            if ( helperBrowser.platform.name == 'android' && helperBrowser.name != 'chrome' 
//                    && helperBrowser.platform.version.major >= 4 
//                    && helperBrowser.platform.version.minor >= 1 ) {
//                return;
//            }

            // @TODO temp solution
            if ( excludeTags.indexOf(firstTouch.target.tagName) === -1 ) {
                event.preventDefault();
            }
            clickEvent = 'click';
            
            if ( new Date().getTime() - simulatedClickTime < simulatedDblClickTimeout ) {
                clickEvent = 'dblclick';
            }
            simulatedClickTime = new Date().getTime();
            simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(clickEvent, true, false, window, 0, 
                firstTouch.screenX, firstTouch.screenY, 
                firstTouch.clientX, firstTouch.clientY, false, 
                false, false, false, 0, null);
            firstTouch.target.dispatchEvent(simulatedEvent);
        }
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new FastClick();
    }
    
    return instance;
});