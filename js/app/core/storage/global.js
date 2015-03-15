
define('app/core/storage/global', [], function() {
    
    var data = {}, _get, _set, StorageGlobal;

    _get = function(key, subdata) {
        var result = null, i;

        if ( subdata === undefined ) {
            subdata = data;
        }
        /* jshint forin: false */
        for ( i in subdata ) {
            if ( subdata.hasOwnProperty(i) && key[0] == i ) {
                if ( key.length <= 1 ) {
                    result = subdata[i];
                    break;
                }
                subdata = subdata[i];
                
                if ( subdata === null || subdata === undefined ) {
                    result = null;
                    break;
                }
                key = key.erase(i);

                if ( key.length == 1 ) {
                    result = subdata[key] === undefined ? null : subdata[key];
                } else {
                    result = _get(key, subdata);
                }
                break;
            }
        }

        return result;  
    };
    _set = function(key, value) {
        var subdata = {}, i, len;

        key = key.reverse();
        len = key.length;
        
        for ( i = 0; i < len; i++ ) {
            if ( i === 0 ) {
                subdata[key[0]] = value;
            } else {
                var clone = {};
                
                /* jshint forin: false */
                for ( var subkey in subdata ) {
                    if ( !subdata.hasOwnProperty(subkey) ) {
                        continue;
                    }
                    clone[subkey] = subdata[subkey];
                }
                
                subdata[key[i]] = clone;
                delete subdata[key[i - 1]];
            }
        }
        data = $.merge(data, subdata);
    };
    
    StorageGlobal = {
        get: function(key, defaultValue) {
            var value = _get(key.split('.'));

            return value !== null ? value : (defaultValue === undefined ? null : defaultValue);
        },

        set: function(key, value) {
            _set(key.split('.'), value);

            return this;
        },

        erase: function(key) {
            _set(key.split('.'), null);

            return this;
        },

        fromJSON: function(json) {
            data = $.extend(data, JSON.parse(json) || {});

            return this;
        }
    };

    return StorageGlobal;
});