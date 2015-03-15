
define('app/core/utils/string', [], function() {
    
    var string =  {
        /**
         * @method substitute
         * @param {String} string
         * @param {Object} object
         * @param {RegExp} regexp
         * @return {String}
         */
        substitute: function(string, object, regexp) {
            return string.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name) {
                if ( match.charAt(0) == '\\' ) {
                    return match.slice(1);
                }
                return (object[name] != null) ? object[name] : '';
            });
        },
        
        /**
         * @method stripTags
         * @param {String} string
         * @return {String}
         */
        stripTags: function(string) {
            return string.replace(/(<([^>]+)>)/ig, '');
        }
    };
    
    return string;
});