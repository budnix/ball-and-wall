
define('app/dashboard/lives', 
[
    'app/dashboard/_base', 'app/preloader', 'app/episodes/_', 'app/core/_'
], 
function(Base, preloader, episode, core) {
    
    function DashboardLives(dashboard) {
        Base.call(this);
        this.lives = 3;
        this.entities = [];
        this.initialize(dashboard);
        this._update();
    }
    
    DashboardLives.prototype = Object.create(Base.prototype, {
        constructor: {
            value: DashboardLives,
            enumerable: false
        }
    });

    /**
     * @method initialize
     * @param {Dashboard} dashboard
     */
    DashboardLives.prototype.initialize = function(dashboard) {
        Base.prototype.initialize.call(this, dashboard);
    };

    /**
     * @method get
     * @return {Number}
     */
    DashboardLives.prototype.get = function() {
        return this.lives;
    };

    /**
     * @method incr
     */
    DashboardLives.prototype.incr = function() {
        this.lives ++; 
        this.update();
        this.emit('change', [this.lives]);
    };

    /**
     * @method decr
     */
    DashboardLives.prototype.decr = function() {
        this.lives --; 
        this.update();
        this.emit('change', [this.lives]);
    };

    /**
     * @method reset
     */
    DashboardLives.prototype.reset = function() {
        if ( this.get() === 3 ) {
            return;
        }
        this.lives = 3;
        this.update();
        this.emit('change', [this.lives]);
    };

    /**
     * @method update
     */
    DashboardLives.prototype.update = function() {
        if ( this.gameStarted && !this.dashboard.isDisabled() ) {
            this._update();
        }
    };
    
    /**
     * @method _update
     */
    DashboardLives.prototype._update = function() {
        var _that = this, i = 0, entity, lives;

        if ( this.dashboard.isDisabled() ) {
            return;
        }
        lives = episode.getManifest().dashboard.lives;
        
        if ( lives.type == 'bitmap' ) {
            $.each(this.entities, function(key, entity) {
                _that.dashboard.stage.removeChild(entity);
                entity = null;
            });
            this.entities = [];

            for ( i = 0; i < this.lives; i++ ) {
                entity = new createjs.Bitmap(preloader.get('c-ball-normal').src);
                entity.x = lives.x - (i * 20 * core.helperApp.pixelRatio());
                entity.y = lives.y;

                if ( lives.alpha !== undefined ) {
                    entity.alpha = 0.8;
                }
                this.entities.push(entity);
                this.dashboard.stage.addChild(entity);
            }
        } else if ( lives.type == 'text' ) {
            if ( this.entity ) {
                this.entity.text = this.lives;

            } else {
                this.entity = new createjs.Text(this.lives, lives.font, lives.color);
                this.entity.x = lives.x;
                this.entity.y = lives.y;
                this.entity.textAlign = lives.textAlign;
                this.dashboard.stage.addChild(this.entity);
            }
        }
        if ( this.gameStarted ) {
            this.dashboard.update();
        }
    };

    return DashboardLives;
});