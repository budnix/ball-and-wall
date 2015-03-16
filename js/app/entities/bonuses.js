
define('app/entities/bonuses', 
[
    'app/entities/_base', 'app/core/_'
], 
function(EntitiesBase, core) {
    
    function Bonuses() {
        EntitiesBase.call(this);
        this.id = 'bonuses';
        this.initialize();
    }
    
    Bonuses.prototype = Object.create(EntitiesBase.prototype, {
        constructor: {
            value: Bonuses,
            enumerable: false
        }
    });
    
    /**
     * @method initialize
     */
    Bonuses.prototype.initialize = function() {
        core.mediator.addListener('game:game-start', $.proxy(this.onGameStart, this));
        core.mediator.addListener('game:game-over', $.proxy(this.onGameOver, this));
    };

    /**
     * @method randomCreate
     * @param {Entity} block
     */
    Bonuses.prototype.randomCreate = function(block) {
        if ( !this.gameStarted ) {
            return null;
        }
        var bonus = this.create();
        
        if ( !bonus ) {
            return null;
        }

        bonus.setPos(block.getX(), block.getY());
        bonus.addToStage(bonus);

        return bonus;
    };

    /**
     * @method create
     * @param {Object} options
     */
    Bonuses.prototype.create = function(options) {
        return EntitiesBase.prototype.create.call(this, require('app/entity/bonus').createNew(options));
    };

    /**
     * @method update
     * @param {Object} event
     */
    Bonuses.prototype.update = function(event) {
        this.reset();

        while ( this.current() ) {
            this.current().update(event);
            
            if ( !this.current().isExists() ) {
                this.removeChildByIndex(this.index);
            }
            this.next();
        }
    };
    
    /**
     * @method getElement
     * @return {Element}
     */
    Bonuses.prototype.onGameStart = function() {
        this.gameStarted = true;
    };
    
    /**
     * @method getElement
     * @return {Element}
     */
    Bonuses.prototype.onGameOver = function() {
        this.gameStarted = false;
    };
    
    var instance = null;
    
    if ( instance === null ) {
        instance = new Bonuses();
    }
    
    return instance;
});