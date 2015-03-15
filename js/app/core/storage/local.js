
define('app/core/storage/local', 
[
    'q', 'app/core/helper/app'
], 
function(q, appHelper) {

    function Local() {
        this._ns = 'baw-storage';
        this.storage = null;
        this.initialize('');
    }
    
    /**
     * @method initialize
     * @param {String} ns
     */
    Local.prototype.initialize = function(ns) {
        if ( ns ) {
            this._ns += ':' + ns;
        }
        if ( appHelper.platform() != 'chrome' ) {
            this._test();
        }
    };

    /**
     * @method get
     * @return {Q}
     */
    Local.prototype.get = function() {
        var defer = q.defer();
        
        if ( appHelper.platform() == 'chrome' ) {
            chrome.storage.local.get(this._ns, $.proxy(function(res) {
                defer.resolve(JSON.stringify(res[this._ns]));
            }, this));
        } else {
            defer.resolve(this.storage.getItem(this._ns));
        }
        
        return defer.promise;
    };

    /**
     * @method set
     * @param {Mixed} value
     * @return {StorageLocal}
     */
    Local.prototype.set = function(value) {
        var tmp = {};
        
        if ( appHelper.platform() == 'chrome' ) {
            tmp[this._ns] = JSON.parse(value);
            chrome.storage.local.set(tmp);
        } else {
            this.storage.setItem(this._ns, value);
        }

        return this;
    };

    /**
     * @method clear
     * @param {String} key
     */
    Local.prototype.clear = function(key) {
//        if ( appHelper.platform() == 'chrome' ) {
//            chrome.storage.local.clear();
//        } else {
//            this.storage.removeItem(this._ns);
//        }

        return this;
    };

    Local.prototype._test = function() {
        try {
            localStorage.setItem(this._ns + ':test', 'ok');
            
            if ( localStorage.getItem(this._ns + ':test') == 'ok' ) {
                this.storage = localStorage;
            } else {
                throw "Error detecting local storage";
            }
        } catch (ex) {}
    };

    return Local;
});