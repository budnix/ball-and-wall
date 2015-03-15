
define('app/dashboard/time', 
[
    'app/dashboard/_base', 'app/core/_', 'app/episodes/_'
], 
function(Base, core, episode) {

    var format = function format(h, m, s) {
        return episode.getManifest().dashboard.time.textPattern
                .replace(/\{h\}/, h).replace(/\{m\}/, m).replace(/\{s\}/, s);
    };

    function DashboardTime(dashboard) {
        var time = episode.getManifest().dashboard.time;
        
        Base.call(this);
        this.entity = new createjs.Text(format('00', '00', '00'), time.font, time.color);
        this.entity.x = time.x;
        this.entity.y = time.y;
        this.entity.textAlign = time.textAlign;
        this.timer = null;
        this.time = 0;
        this.initialize(dashboard);
    }
    
    DashboardTime.prototype = Object.create(Base.prototype, {
        constructor: {
            value: DashboardTime,
            enumerable: false
        }
    });

    /**
     * @method initialize
     * @param {Dashboard} dashboard
     */
    DashboardTime.prototype.initialize = function(dashboard) {
        Base.prototype.initialize.call(this, dashboard);
    };

    /**
     * @method get
     * @return {Number}
     */
    DashboardTime.prototype.get = function() {
        return this.time;
    };

    /**
     * @method start
     * @param {Boolean} reset
     */
    DashboardTime.prototype.start = function(reset) {
        var _this = this;
        
        this.stop(reset);
        this.timer = setInterval(function() {
            var time;
            
            _this.time ++;
            
            if ( _this.time > 3600 ) {
                return;
            }
            time = core.utilsNumber.toTime(_this.time);
            _this.update(format(time.hour, time.min, time.sec));
            _this.emit('tick', [_this.time]);
        }, 1000);
    };

    /**
     * @method stop
     * @param {Boolean} reset
     */
    DashboardTime.prototype.stop = function(reset) {
        if ( reset ) {
            this.reset();
        }
        clearInterval(this.timer);
        this.timer = null;
    };

    /**
     * @method reset
     */
    DashboardTime.prototype.reset = function() {
        if ( this.get() === 0 ) {
            return;
        }
        this.time = 0;
        this.update(format('00', '00', '00'));
    };

    return DashboardTime;
});