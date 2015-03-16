
define('app/i18/i18', 
[
    'app/i18/languages/pl',
    'app/i18/languages/en-us'
],
function() {

    var 
        _strings = {
            'lang-full-name:pl': 'Polish - Polski',
            'lang-full-name:en-us': 'English (US) - English (US)'
        },
        _code;
    
    function Lang() {
        
    }
    
    /**
     * @method _
     * @param {String} key
     * @return {String}
     */
    Lang.prototype._ = function(key) {
        return _strings[key];
    };
    
    /**
     * @method setLanguage
     * @param {String} code
     */
    Lang.prototype.setLanguage = function(code) {
        _code = code;
        
        if ( this.exists(code) ) {
            $.extend(_strings, require('app/i18/languages/' + code));
        } else {
            $.extend(_strings, require('app/i18/languages/en-us'));
        }
    };
    
    /**
     * @method getLanguageCode
     * @return {String}
     */
    Lang.prototype.getLanguageCode = function() {
        return _code;
    };
    
    /**
     * @method getLanguageName
     * @param {String} code
     * @return {String}
     */
    Lang.prototype.getLanguageName = function(code) {
        return _strings['lang-full-name:' + (code || _code)];
    };
    
    /**
     * @method exists
     * @param {String} code
     * @return {Boolean}
     */
    Lang.prototype.exists = function(code) {
        var result = false;
        
        try {
            result = require('app/i18/languages/' + code) ? true : false;
        } catch (ex) {}
        
        return result;
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Lang();
    }
    
    return instance;
});