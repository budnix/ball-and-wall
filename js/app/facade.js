
define('app/facade', 
[
    'app/stage', 'app/sound', 'app/preloader'
], 
function(stage, sound, preloader) {
    
    function Facade() {
        this.background = null;
        this.text = [];
        this.animStep = null;
        this.lastPosX = null;
        this.builded = null;
        this.currentDelay = null;
        this.options = {
            overlay_duration: 300,
            text_duration: 900,
            autohide: true,
            background_alpha: 0.6,
            background_color: '#000',
            background_src: null,
            text_style: '37px \'Quantico\', sans-serif',
            text_color: '#e0e396',
            shadow_color: '#fff'
        };
    }
    
    /**
     * @method setOptions
     * @param {Object} options
     */
    Facade.prototype.setOptions = function(options) {
        this.options = $.extend(this.options, options || {});
    };
    
    /**
     * @method clear
     * @return {Facade}
     */
    Facade.prototype.clear = function() {
        if ( this.currentDelay === null ) {
            stage.remove(this.background);
            $.each(this.text, function(i, text) {
                stage.remove(text);
            });
            this.background = null;
            this.text = [];
            this.builded = false;
            this.animStep = 0;
        } else {
            setTimeout($.proxy(function() {
                this.clear();
            }, this), this.currentDelay);
            this.currentDelay = null;
        }

        return this;
    };
    
    /**
     * @method show
     * @param {String} text
     * @param {Object} options
     */
    Facade.prototype.show = function(text, options) {
        if ( this.currentDelay === null ) {
            options = $.extend({}, this.options, options || {});
            this._buildBackground(options);
            this._buildText(text, options);

        } else {
            setTimeout($.proxy(function() {
                this.show(text, options);
            }, this), this.currentDelay);
            this.currentDelay = null;
        }

        return this;
    };
    
    /**
     * @method wait
     * @param {Number} delay
     */
    Facade.prototype.wait = function(delay) {
        this.currentDelay = delay;

        return this;
    };
    
    /**
     * @method _buildBackground
     * @param {Object} options
     */
    Facade.prototype._buildBackground = function(options) {
        if ( this.background ) {
            return;
        }
        if ( options.background_src ) {
            this.background = new createjs.Bitmap(preloader.get(options.background_src).src);

        } else {
            this.background = new createjs.Shape();
            this.background.graphics.beginFill(options.background_color)
                    .drawRect(0, 0, stage.getWidth(), stage.getWidth());            
        }
        this.background.layerId = 999;
        stage.add(this.background);
        
        createjs.Tween.get(this.background).to({alpha: 0}, 10)
                .to({alpha: options.background_alpha}, options.overlay_duration);
    };
    
    /**
     * @method _buildText
     * @param {String} title
     * @param {Object} options
     */
    Facade.prototype._buildText = function(title, options) {
        var text = new createjs.Text(title, options.text_style, options.text_color),
            out;
        
        text.x = - text.getMeasuredWidth();
        text.y = stage.getHeight() / 2 - text.getMeasuredHeight() / 2;
        text.shadow = new createjs.Shadow(options.shadow_color, 0, 0, 20);
        text.textAlign = 'center';
        text.layerId = 1000;
        
        stage.add(text);
        this.text.push(text);
        
        out = $.proxy(function() {
            createjs.Tween.get(text).to({
                x: stage.getWidth() + text.getMeasuredWidth()
            }, options.text_duration, createjs.Ease.cubicInOut).call($.proxy(function() {
                var index = this.text.indexOf(text);
                
                if ( index !== -1 ) {
                    this.text.splice(index, 1);
                    if ( !this.text.length ) {
                        this.clear();
                    }
                }
            }, this));
            
            if ( this.text.length === 1 ) {
                createjs.Tween.get(this.background).to({alpha: 0}, options.overlay_duration);
            }
        }, this);
        
        createjs.Tween.get(text).to({
            x: stage.getWidth() / 2
        }, options.text_duration, createjs.Ease.cubicInOut).call($.proxy(function() {
            if ( options.autohide ) {
                setTimeout(out, 1000);
            }
        }, this));
        
        return text;
    };

    var instance = null;
    
    if ( instance === null ) {
        instance = new Facade();
    }
    
    return instance;
});