
define('app/dashboard/round', 
[
    'app/dashboard/_base', 'app/episodes/_'
], 
function(Base, episode) {
    
    var format = function format(current, max) {
        return episode.getManifest().dashboard.round.textPattern
                .replace(/\{current\}/, current).replace(/\{max\}/, max);
    };
    
    function DashboardRound(dashboard) {
        var round = episode.getManifest().dashboard.round;
        
        Base.call(this);
        this.round = 1;
        this.maxRounds = 100;
        this.entity = new createjs.Text(format('?', '?'), round.font, round.color);
        this.entity.x = round.x;
        this.entity.y = round.y;
        this.entity.textAlign = round.textAlign;
        this.initialize(dashboard);
    }
    
    DashboardRound.prototype = Object.create(Base.prototype, {
        constructor: {
            value: DashboardRound,
            enumerable: false
        }
    });

    /**
     * @method initialize
     * @param {Dashboard} dashboard
     */
    DashboardRound.prototype.initialize = function(dashboard) {
        Base.prototype.initialize.call(this, dashboard);
    };

    /**
     * @method get
     * @return {Number}
     */
    DashboardRound.prototype.get = function() {
        return this.round;
    };
    
    /**
     * @method set
     * @param {Number} round
     * @return {DashboardRound}
     */
    DashboardRound.prototype.set = function(round) {
        this.round = round;
        this.update();
        
        return this;
    };
    
    /**
     * @method getMax
     * @return {Number}
     */
    DashboardRound.prototype.getMax = function() {
        return this.maxRounds;
    };
    
    /**
     * @method setMax
     * @param {Number} maxRounds
     * @return {DashboardRound}
     */
    DashboardRound.prototype.setMax = function(maxRounds) {
        this.maxRounds = maxRounds;
        this.entity.text = format(this.round, this.maxRounds);
        
        return this;
    };

    /**
     * @method incr
     */
    DashboardRound.prototype.incr = function() {
        this.round ++; 
        this.update();
        this.emit('change', [this.round]);
    };

    /**
     * @method decr
     */
    DashboardRound.prototype.decr = function() {
        this.round --; 
        this.update();
        this.emit('change', [this.round]);
    };

    /**
     * @method reset
     */
    DashboardRound.prototype.reset = function() {
        if ( this.get() === 1 ) {
            return;
        }
        this.round = 1;
        this.update();
        this.emit('change', [this.round]);
    };

    /**
     * @method update
     */
    DashboardRound.prototype.update = function() {
        Base.prototype.update.call(this, format(this.round, this.maxRounds));
    };

    return DashboardRound;
});