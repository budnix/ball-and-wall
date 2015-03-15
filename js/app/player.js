
define('app/player', 
[
    'app/core/_', 'app/i18/_', 'app/game-options', 'md5'
], 
function(core, i18, gameOptions, md5) {

    var 
        /**
         * @method _backendUrl
         * @type {String}
         * @static
         * @private
         */
        _backendUrl = API_ADDR + 'auth/',
        
        /**
         * @property _isLogged
         * @type {Boolean}
         * @static
         * @private
         */
        _isLogged = false,
        
        /**
         * @property _playerData
         * @type {Object}
         * @static
         * @private
         */
        _playerData = {};


    function Player() {
        core.EventEmitter.call(this);
        this.initialize();
    }
    
    Player.prototype = Object.create(core.EventEmitter.prototype, {
        constructor: {
            value: Player,
            enumerable: false
        }
    });
    
    /**
     * @method initialize
     */
    Player.prototype.initialize = function() {
        
    };
    
    /**
     * @method getData
     * @param {String} key
     * @return {Number|String|Object}
     */
    Player.prototype.getData = function(key) {
        if ( !key ) {
            return _playerData;
        }

        return _playerData[key];
    };
    
    /**
     * @method getId
     * @return {Number}
     */
    Player.prototype.getId = function() {
        if ( !this.getData('player_id') ) {
            _playerData.player_id = this._generateId();
        }

        return this.getData('player_id');
    };

    /**
    * @method getName
    * @return {String}
    */
    Player.prototype.getName = function() {
        if ( !this.getData('player_name') ) {
            _playerData.player_name = this._generateName();
        }

        return this.getData('player_name');
    };

    /**
     * @method silentLogin
     */
    Player.prototype.silentLogin = function() {
        this._auth('login', null, true);
    };

    /**
     * @method login
     * @param {Object} loginData
     */
    Player.prototype.login = function(loginData) {
        this._auth('login', loginData);
    };

    /**
     * @method logout
     */
    Player.prototype.logout = function() {
        _isLogged = false;
        _playerData = {};
        gameOptions.set('player', {
            ac: null,
            name: null,
            social: null,
            hash: null
        });
        this._request('logout', null, $.proxy(function(data) {
            this.emit('logout', data);
        }, this));
    };

    /**
     * @method register
     * @param {Object} registerData
     */
    Player.prototype.register = function(registerData) {
        this._auth('register', registerData);
    };

    /**
     * @method isLogged
     * @return {Boolean}
     */
    Player.prototype.isLogged = function() {
        return _isLogged;
    };

    /**
     * @method _auth
     * @param {String} action
     * @param {Object} authData
     * @param {Boolean} silentMode
     */
    Player.prototype._auth = function(action, authData, silentMode) {
        var data = {result: 'ok'}, hash,
            password, name, social, ac, post;

        authData = authData || {};
        name = authData.name;
        password = authData.password;
        social = authData.social;
        ac = authData.ac;
        
        if ( password ) {
            hash = this._getHash(password);
        }
        if ( name ) {
            gameOptions.set('player', {name: name});
        } else {
            name = gameOptions.get('player:name');
        }
        if ( hash ) {
            gameOptions.set('player', {hash: hash});
        } else {
            hash = gameOptions.get('player:hash');
        }
        if ( social ) {
            gameOptions.set('player', {social: social});
        } else {
            social = gameOptions.get('player:social');
        }
        if ( ac ) {
            gameOptions.set('player', {ac: ac});
        } else {
            ac = gameOptions.get('player:ac');
        }
        if ( !name || !hash ) {
            data.result = 'invalid';

            if ( silentMode ) {
                data.silentMode = true;
            }
            this.emit(action, data);

            return;
        }
        post = {name: name, hash: hash, social: social, ac: ac};

        this._request(action, post, $.proxy(function(data) {
            _isLogged = data.result == 'ok';
            if ( silentMode ) {
                data.silentMode = true;
            }
            if ( _isLogged ) {
                _playerData = data.response;
            } else {
                _playerData = {};
            }
            this.emit(action, data);
        }, this));
    };

    /**
     * @method _request
     * @param {String} action
     * @param {Object} post
     * @param {Function} callback
     */
    Player.prototype._request = function(action, post, callback) {
        $.ajax({
            dataType: 'json',
            url: _backendUrl + action + '.html',
            method: 'post',
            data: post || {},
            traditional: true,
            crossDomain: true
        }).done(function(resp) {
            if ( !resp ) {
                resp = {result: 'error'};
            }
            callback(resp);
        }).fail(function() {
            callback({result: 'error'});
        });
    };

    /**
     * @method _getHash
     * @param {String} password
     * @return {String}
     */
    Player.prototype._getHash = function(password) {
        return md5(password);
    };

    /**
     * @method _generateName
     * @return {String}
     */
    Player.prototype._generateName = function() {
        return i18._('guest') + '-' + parseInt(Math.random() * 9999, 10);
    };

    /**
     * @method _generateId
     * @return {Number}
     */
    Player.prototype._generateId = function() {
        return - parseInt(Math.random() * 9999999999, 10);
    };
    
    var instance = null;

    if ( instance === null ) {
        instance = new Player();
    }

    return instance;
});