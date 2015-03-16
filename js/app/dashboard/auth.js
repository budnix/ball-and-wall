
define('app/dashboard/auth', 
[
    'app/dashboard/_base', 'app/i18/_', 'app/episodes/_'
], 
function(Base, i18, episode) {

    function DashboardAuth(dashboard) {
        Base.call(this);
        this.entity = new createjs.Text(DashboardAuth.defaultText(), '16px \'Quantico\', sans-serif', '#e0e396');
        this.entity.x = episode.getManifest().dashboard.auth.x;
        this.entity.y = episode.getManifest().dashboard.auth.y;
        this.entity.textAlign = episode.getManifest().dashboard.auth.textAlign;
        this.initialize(dashboard);
    }
    
    DashboardAuth.defaultText = function() {
        return i18._('dashboard-auth-unlogged');
    };
    
    DashboardAuth.prototype = Object.create(Base.prototype, {
        constructor: {
            value: DashboardAuth,
            enumerable: false
        }
    });

    /**
     * @method initialize
     * @param {Dashboard} dashboard
     */
    DashboardAuth.prototype.initialize = function(dashboard) {
        Base.prototype.initialize.call(this, dashboard);
    };

    /**
     * @method login
     * @param {Object} playerData
     */
    DashboardAuth.prototype.login = function(playerData) {
        this.update(i18._('welcome-player') + '\n' + playerData.player_name + '!');
        
        return this;
    };
    
    /**
     * @method logout
     * @return {DashboardAuth}
     */
    DashboardAuth.prototype.logout = function() {
        this.reset();
        
        return this;
    };

    /**
    * @method reset
    */
    DashboardAuth.prototype.reset = function() {
        this.update(DashboardAuth.defaultText());
    };
    
    /**
     * @method update
     * @param {String} text
     */
    DashboardAuth.prototype.update = function(text) {
        if ( !this.dashboard.isDisabled() ) {
            this.entity.text = text;
            this.dashboard.update();
        }
    };

    return DashboardAuth;
});