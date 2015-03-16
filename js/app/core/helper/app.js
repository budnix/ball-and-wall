
define('app/core/helper/app', 
[
    
], 
function() {
    return {
        
        /**
         * @method version
         * @return {String}
         */
        version: function() {
            return '1.0.0';
        },
        
        /**
         * @method platform
         * @return {String}
         */
        platform: function() {
            var l = location;
            
            //chrome-extension://...
            if ( l.href.match(/^chrome\-extension:\/\//) ) {
                return 'chrome';
            }
            //widget://...
            if ( l.href.match(/^widget:\/\//) ) {
                return 'opera';
            }
            //resource://...
            if ( l.href.match(/^resource:\/\//) ) {
                return 'firefox';
            }
            //ios://...
            if ( l.href.match(/^ios:\/\//) ) {
                return 'ios';
            }
            //ms-appx://...
            if ( l.href.match(/^ms\-appx:\/\//) ) {
                return 'wp8';
            }
            //x-wmapp...
            if ( l.href.match(/^x\-wmapp/) ) {
                return 'wp8phone';
            }

            return 'web';
        },
        
        /**
         * @method pixelRatio
         * @return {Number}
         */
        pixelRatio: function() {
            var backingStore = window.backingStorePixelRatio ||
                    window.webkitBackingStorePixelRatio ||
                    window.mozBackingStorePixelRatio ||
                    window.msBackingStorePixelRatio ||
                    window.oBackingStorePixelRatio ||
                    window.backingStorePixelRatio || 1;

            return (window.devicePixelRatio || 1) / backingStore;
        }
    };
});