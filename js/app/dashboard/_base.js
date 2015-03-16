
define('app/dashboard/_base', 
[
    'app/core/_'
], 
function(core) {

    function DashboardBase() {
        core.EventEmitter.call(this);
        this.entity = null;
        this.dashboard = null;
        core.mediator.addListener('game:game-start', $.proxy(this.onGameStart, this));
        core.mediator.addListener('game:game-over', $.proxy(this.onGameOver, this));
    }
    
    DashboardBase.prototype = Object.create(core.EventEmitter.prototype, {
        constructor: {
            value: DashboardBase,
            enumerable: false
        }
    });

    /**
     * @constructor
     * @param {Dashboard} dashboard
     */
    DashboardBase.prototype.initialize = function(dashboard) {
        this.dashboard = dashboard;
    };

    /**
     * @method update
     * @param {String} text
     */
    DashboardBase.prototype.update = function(text) {
        if ( this.gameStarted && !this.dashboard.isDisabled() ) {
            this.entity.text = text;
            this.dashboard.update();
        }
    };

    /**
     * @method reset
     */
    DashboardBase.prototype.reset = function() {
        this.update('');
    };

    /**
     * @method getEntity
     * @return {Element}
     */
    DashboardBase.prototype.getEntity = function() {
        return this.entity;
    };
    
    /**
     * @method getElement
     * @return {Element}
     */
    DashboardBase.prototype.onGameStart = function() {
        this.gameStarted = true;
    };
    
    /**
     * @method getElement
     * @return {Element}
     */
    DashboardBase.prototype.onGameOver = function() {
        this.gameStarted = false;
    };

    return DashboardBase;
});