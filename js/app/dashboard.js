
define('app/dashboard', 
[
    'app/core/_', 'app/dashboard/_', 'app/preloader', 'app/episodes/_'
], 
function(core, dashboard, preloader, episode) {
    
    function Dashboard() {
        core.EventEmitter.call(this);
        this.canvas = $('#a-game-dashboard');
        this._disabled = false;
        
        if ( this.canvas.attr('id') ) {
            this.stage = new createjs.Stage(this.canvas.attr('id'));
        }
        this.initEvents();
    }
    
    Dashboard.prototype = Object.create(core.EventEmitter.prototype, {
        constructor: {
            value: Dashboard,
            enumerable: false
        }
    });
    
    /**
     * @method initEvents
     */
    Dashboard.prototype.initEvents = function() {
        preloader.addListener('complete', $.proxy(this.onPreloaderComplete, this));
    };
    
    /**
     * @method show
     */
    Dashboard.prototype.show = function() {
        this.canvas.show();
    };
    
    /**
     * @method hide
     */
    Dashboard.prototype.hide = function() {
        this.canvas.hide();
    };
    
    /**
     * @method isDisabled
     * @return {Boolean}
     */
    Dashboard.prototype.isDisabled = function() {
        return this._disabled;
    };
    
    /**
     * @method disabled
     * @param {Boolean} disabled
     */
    Dashboard.prototype.disabled = function(disabled) {
        this._disabled = disabled;
    };
    
    /**
     * @method getTime
     * @return {DashboardTime}
     */
    Dashboard.prototype.getTime = function() {
        return this.time;
    };

    /**
     * @method getScore
     * @return {DashboardScore}
     */
    Dashboard.prototype.getScore = function() {
        return this.score;
    };
    
    /**
     * @method getSpeed
     * @return {DashboardSpeed}
     */
    Dashboard.prototype.getSpeed = function() {
        return this.speed;
    };
    
    /**
     * @method getLives
     * @return {DashboardLives}
     */
    Dashboard.prototype.getLives = function() {
        return this.lives;
    };
    
    /**
     * @method getRound
     * @return {DashboardRound}
     */
    Dashboard.prototype.getRound = function() {
        return this.round;
    };

    /**
     * @method getAuth
     * @return {DashboardAuth}
     */
    Dashboard.prototype.getAuth = function() {
        return this.auth;
    };

    /**
     * @method update
     */
    Dashboard.prototype.update = function() {
        if ( this.stage ) {
            this.stage.update();
        }
    };

    /**
     * @method onPreloaderComplete
     */
    Dashboard.prototype.onPreloaderComplete = function() {
        // temp fix / level-editor
        if ( this.stage ) {
            this.stage.clear();
            this.stage.removeAllChildren();
        }
        this.canvas.attr('width', episode.getManifest().dashboard.width * core.helperApp.pixelRatio());
        this.canvas.attr('height', episode.getManifest().dashboard.height * core.helperApp.pixelRatio());
        
        if ( core.helperApp.pixelRatio() >= 2 ) {
            this.canvas.css('width', episode.getManifest().dashboard.width + 'px');
            this.canvas.css('height', episode.getManifest().dashboard.height + 'px');
        }
        this.show();
        this._build();
    };  
    
    /**
     * @method _build
     */
    Dashboard.prototype._build = function() {
        this.time = new dashboard.Time(this);
        this.score = new dashboard.Score(this);
        this.speed = new dashboard.Speed(this);
        this.lives = new dashboard.Lives(this);
        this.round = new dashboard.Round(this);
        this.auth = new dashboard.Auth(this);

        if ( !this.stage ) {
            return;
        }
        var _this = this, 
            bg = new createjs.Bitmap(preloader.get('c-dashboard-bg').src);

        this.stage.addChild(bg);
        this.stage.addChild(this.time.entity);
        this.stage.addChild(this.score.entity);
        this.stage.addChild(this.speed.entity);
        this.stage.addChild(this.round.entity);
        this.stage.addChild(this.auth.entity);

        $.each(episode.getManifest().dashboard.buttons, function(i, obj) {
            var o = new createjs[obj.type]();
            
            if ( obj.type == 'Bitmap' ) {
                obj.args = preloader.get(obj.args).src;
            }
            createjs[obj.type].apply(o, $.isArray(obj.args) ? obj.args : [obj.args]);
            $.each(obj, function(key, value) {
                if ( key == 'event' ) {
                    o.addEventListener('click', function() {
                        _this.emit(value);
                    });
                }
                if ( key == 'args' || key == 'type' ) {
                    return;
                }
                o[key] = value;
            });
            _this.stage.addChild(o);
        });
        
        // @todo
        if ( this.lives.entity ) {
            this.stage.addChild(this.lives.entity);
        }
        setTimeout(function() {
            _this.stage.update();
        }, 1000);
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Dashboard();
    }
    
    return instance;
});