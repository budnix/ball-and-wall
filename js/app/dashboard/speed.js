
define('app/dashboard/speed', 
[
    'app/dashboard/_base', 'app/preloader', 'app/episodes/_', 'app/core/_'
], 
function(Base, preloader, episode, core) {

    var
        /**
         * @property getAngle
         * @type {Function}
         */
        getAngle,
        
        /**
         * @property getProgress
         * @type {Function}
         */
        getProgress;


    getAngle = function getAngle(speed) {
        return getProgress(speed) * 3.6;
    };
    
    getProgress = function getProgress(speed) {
        var s = Math.max(speed - (2 * core.helperApp.pixelRatio()), 0);
        
        // speed from ball.js (max - 2)
        s = s ? (s / ((6.5 * core.helperApp.pixelRatio()) - (2 * core.helperApp.pixelRatio())) * 100) : 0;
        
        return s;
    };

    function DashboardSpeed(dashboard) {
        var speed = episode.getManifest().dashboard.speed,
            left, center, container;
        
        Base.call(this);
        
        if ( speed.type == 'rotate' ) {
            this.entity = new createjs.Bitmap(preloader.get('c-dashboard-speed').src);

        } else if ( speed.type == 'progress' ) {
            left = new createjs.Bitmap(preloader.get('c-dashboard-speed-left').src);
            center = new createjs.Bitmap(preloader.get('c-dashboard-speed').src);
            center.x = preloader.get('c-dashboard-speed-left').width;
            container = new createjs.Container();
            container.addChild(left, center);
            this.entity = container;
        }
        this.entity.x = speed.x;
        this.entity.y = speed.y;
        this.speed = 2;
        this.initialize(dashboard);
    }
    
    DashboardSpeed.prototype = Object.create(Base.prototype, {
        constructor: {
            value: DashboardSpeed,
            enumerable: false
        }
    });

    /**
     * @method initialize
     * @param {Dashboard} dashboard
     */
    DashboardSpeed.prototype.initialize = function(dashboard) {
        Base.prototype.initialize.call(this, dashboard);
    };

    /**
     * @method get
     * @return {Number}
     */
    DashboardSpeed.prototype.get = function() {
        return this.speed;
    };
    
    /**
     * @method set
     * @param {Number} speed
     * @return {DashboardSpeed}
     */
    DashboardSpeed.prototype.set = function(speed) {
        this.speed = speed;
        this.update();
        this.emit('change', [this.speed]);
        
        return this;
    };

    /**
     * @method incr
     */
    DashboardSpeed.prototype.incr = function() {
        this.emit('change', [this.speed]);
    };

    /**
     * @method decr
     */
    DashboardSpeed.prototype.decr = function() {
        this.emit('change', [this.speed]);
    };

    /**
     * @method reset
     */
    DashboardSpeed.prototype.reset = function() {
        if ( this.get() === 2 ) {
            return;
        }
        this.speed = 2;
        this.update();
        this.emit('change', [this.speed]);
    };

    /**
     * @method update
     */
    DashboardSpeed.prototype.update = function() {
        this._update();
    };
    
    /**
     * @method _update
     */
    DashboardSpeed.prototype._update = function() {
        var speed = episode.getManifest().dashboard.speed,
            speedStep;
        
        if ( this.dashboard.isDisabled() ) {
            return;
        }
        if ( speed.type == 'rotate' ) {
            speedStep = getAngle(this.speed);
            this.entity.x = Math.cos((speedStep - 90) * Math.PI / 180) * core.helperApp.pixelRatio() * 66 + (112 * core.helperApp.pixelRatio());
            this.entity.y = Math.sin((speedStep - 90) * Math.PI / 180) * core.helperApp.pixelRatio() * 66 + (105 * core.helperApp.pixelRatio());
            this.entity.rotation = speedStep;

        } else if ( speed.type == 'progress' ) { 
            speedStep = getProgress(this.speed);
            this.entity.children[1].scaleX = (speedStep / 100) * 124;
        }
        
        if ( this.gameStarted ) {
            this.dashboard.update();
        }
    };

    return DashboardSpeed;
});