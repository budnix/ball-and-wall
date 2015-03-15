
define('app/core/utils/number', [], function() {
    
    var number =  {
        /**
         * @method toTime
         * @param {Number} number
         * @return {Object}
         */
        toTime: function(number) {
            var min, sec, hour;

            sec = number % 60;
            sec = sec < 10 ? '0' + sec : sec;
            min = Math.floor(number / 60) % 60;
            min = min < 10 ? '0' + min : min;
            hour = Math.floor(number / 3600);
            hour = hour < 10 ? '0' + hour : hour;

            return {sec: sec, min: min, hour: hour};
        },

        /**
         * @method date
         * @param {Number} number
         * @param {String} format
         * @return String
         */
        date: function(number, format) {
            if ( !format ) {
                format = 'H:i:s';
            }
            var time = this.toTime(number);

            return format.replace(/H/g, time.hour)
                .replace(/i/g, time.min)
                .replace(/s/g, time.sec);
        }
    };
    
    return number;
});