
define('app/dashboard/score', 
[
    'app/dashboard/_base', 'app/episodes/_'
], 
function(Base, episode) {

    function DashboardScore(dashboard) {
        var score = episode.getManifest().dashboard.score;
        
        Base.call(this);
        this.entity = new createjs.Text('0', score.font, score.color);
        this.entity.x = score.x;
        this.entity.y = score.y;
        this.entity.textAlign = score.textAlign;
        this.score = 0;
        this.initialize(dashboard);
    }
    
    DashboardScore.prototype = Object.create(Base.prototype, {
        constructor: {
            value: DashboardScore,
            enumerable: false
        }
    });

    /**
     * @method initialize
     * @param {Dashboard} dashboard
     */
    DashboardScore.prototype.initialize = function(dashboard) {
        Base.prototype.initialize.call(this, dashboard);
    };

    /**
     * @method get
     * @return {Number}
     */
    DashboardScore.prototype.get = function() {
        return this.score;
    };

    /**
     * @method set
     * @param {Number} score [optional]
     */
    DashboardScore.prototype.set = function(score) {
        this.score = score;
        this._updateScore();
        this.emit('change', [this.score]);
    };

    /**
     * @method incr
     * @param {Number} by
     */
    DashboardScore.prototype.incr = function(by) {
        this.score += (by || 1);
        this._updateScore();
        this.emit('change', [this.score]);
    };

    /**
     * @method decrease
     * @param {Number} by
     */
    DashboardScore.prototype.decr = function(by) {
        this.score -= (by || 1);
        this._updateScore();
        this.emit('change', [this.score]);
    };

    /**
     * @method reset
     */
    DashboardScore.prototype.reset = function() {
        if ( this.get() === 0 ) {
            return;
        }
        this.score = 0;
        this._updateScore();
        this.emit('change', [this.score]);
    };

    /**
     * @method _updateScore
     */
    DashboardScore.prototype._updateScore = function() {
        this.update(this.score);
    };

    return DashboardScore;
});