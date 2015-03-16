
define('app/levels', 
[
    'app/entities/_', 'app/stage', 'app/episodes/_', 'app/core/_'
], 
function(entities, stage, episode, core) {

    function Levels() {
        this.blocks = null;
        this.isCustomLevel = false;
        this.currentLevelIndex = 0;
        this.initialize();
    }

    /**
     * @method initialize
     */
    Levels.prototype.initialize = function() {
        
    };

    /**
     * @method destroy
     */
    Levels.prototype.destroy = function() {
        entities.blocks.destroy();
    };

    /**
     * @method getBlocks
     * @return {EntitiesBlocks}
     */
    Levels.prototype.getBlocks = function() {
        return entities.blocks;
    };

    /**
     * @method getBonuses
     * @return {EntitiesBonuses}
     */
    Levels.prototype.getBonuses = function() {
        return entities.bonuses;
    };
    
    /**
     * @method loadLevel
     * @param {Number|String} level
     * @return {Levels}
     */
    Levels.prototype.loadLevel = function(level) {
        var levels = episode.getLevels();
        
        if ( level === '' || !$.isNumeric(level) && !(level + '').split(':')[1] ) {
            return this;
        }
        if ( $.isNumeric(level) ) {
            this.isCustomLevel = false;
            this.currentLevelIndex = level;
            this._generateBlocks(levels[level]);
        } else {
            this.isCustomLevel = true;
            this.currentLevelIndex = 0;
            this._generateBlocks(level);
        }
        
        return this;
    };
    
    /**
     * @method loadSplashScreen
     * @param {String} type
     * @return {Levels}
     */
    Levels.prototype.loadSplashScreen = function(type) {
        if ( episode.getSplashScreen(type) ) {
            this._generateBlocks(episode.getSplashScreen(type));
        }
        
        return this;
    };
    
    /**
     * @method getLevelsLength
     * @return {Number}
     */
    Levels.prototype.getLevelsLength = function() {
        if ( this.isCustom() ) {
            return 1;
        }
        
        return episode.getLevels().length;
    };
    
    /**
     * @method getLevelNames
     * @return {Array}
     */
    Levels.prototype.getLevelNames = function() {
        if ( this.isCustom() ) {
            return ['custom', 'custom'];
        }
        return $.map(episode.getLevels(), function(l) {
            return l.split(':')[0];
        });
    };
    
    /**
     * @method getCurrentLevelIndex
     * @return {Number}
     */
    Levels.prototype.getCurrentLevelIndex = function() {
        return this.currentLevelIndex;
    };
    
    /**
     * @method getCurrentLevelName
     * @return {String}
     */
    Levels.prototype.getCurrentLevelName = function() {
        return this.getLevelNames()[this.currentLevelIndex];
    };
    
    /**
     * @method isCustom
     * @return {Boolean}
     */
    Levels.prototype.isCustom = function() {
        return this.isCustomLevel;
    };
    
    /**
     * @method build
     */
    Levels.prototype.build = function() {
        $.each(this.getBlocks().getChilds(), function(i, block) {
            stage.add(block);
        }.bind(this));
    };

    /**
     * @method _generateBlocks
     * @param {Number} level
     */
    Levels.prototype._generateBlocks = function(level) {
        var block = level.split(':')[1].split(';');

        $.each(block, function(index, item) {
            var coords = item.split(',');

            entities.blocks.create(coords[2] >> 0)
                    .setPos((coords[0] >> 0) * core.helperApp.pixelRatio(), (coords[1] >> 0) * core.helperApp.pixelRatio());
        }.bind(this));
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Levels();
    }
    
    return instance;
});