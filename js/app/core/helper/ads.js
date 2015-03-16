
define('app/core/helper/ads', 
[
    
], 
function() {
    return {
        /**
         * @method getScreenClass
         * @returns {String}
         */
        getScreenClass: function() {
            var w = $(window);
            
            return w.width() >= 960 && w.height() >= 650 && 1/*!Browser.isMobile*/ ? 'big' : 'small';
        },
        
        /**
         * @method getAdsSize
         * @returns {Object}
         */
        getAdsSize: function() {
            var sc = this.getScreenClass();

            return {
                width: sc == 'big' ? 728 : 468,
                height: sc == 'big' ? 90 : 60
            };
        },
        
        /**
         * @method isOn
         * @returns {Boolean}
         */
        isOn: function() {
            var w = $(window);

            return false;
            //return w.width() >= 560;
        }
    };
});