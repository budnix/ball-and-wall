
define('app/window/_base', 
[
    'app/core/_'
], 
function(core) {
    
    function Base() {
        core.EventEmitter.call(this);
        this.name = '';
        this.className = '';
        this.showOverlay = false;
        this.showMinimizeButton = false;
        this.showCloseButton = true;
        this.options = {};
        this.closeTimer = null;
    }
    
    Base.prototype = Object.create(core.EventEmitter.prototype, {
        constructor: {
            value: Base,
            enumerable: false
        }
    });
    
    /**
     * @method initialize
     * @param {Object} options
     */
    Base.prototype.initialize = function(options) {
        this.options = $.extend(this.options, options || {});
        this.builder = new core.Builder();
        this.workingHeader = this.header();
        this.workingModel = this.model();
    };
    
    /**
     * @method open
     * @param {Object} options
     */
    Base.prototype.open = function(options) {
        clearTimeout(this._closeTimer);
        this.options = $.extend(this.options, options || {});

        if ( this.isMinimized() ) {
            this.content.show();
            
            if ( this.overlay ) {
                this.overlay.show();
            }
        } else {
            this.workingHeader = this.header();
            this.workingModel = this.model();
            this._buildHtml();
            this.content.addClass('lbx-showed');
            this.emit('open');
        }
        document.onmousedown = function() { return true; };
        core.mediator.emit('windowOpen', this.isMinimized());
    };
    
    /**
     * @method close
     */
    Base.prototype.close = function() {
        if ( !this.content ) {
            return;
        }
        this.content.removeClass('lbx-showed');
        this._closeTimer = setTimeout($.proxy(function() {
            this.content.remove();
            this.content = null;
            
            if ( this.overlay ) {
                this.overlay.remove();
                this.overlay = null;
            }
            window.scrollTo(0, 0);
            this.emit('close');
            
            if ( !$('.lbx-window').length ) {
                document.onmousedown = function() { return false; };
            }
            core.mediator.emit('windowClose');
        }, this), 400);
    };
    
    /**
     * @method minimize
     */
    Base.prototype.minimize = function() {
        this.content.hide();
        
        if ( this.overlay ) {
            this.overlay.hide();
        }
        this.fireEvent('minimize');
    };
    
    /**
     * @method toggle
     * @param {Object} options
     */
    Base.prototype.toggle = function(options) {
        this[this.isOpened() && !this.isMinimized() ? 'close' : 'open'](options);
    };
    
    /**
     * @method isOpened
     * @return {Boolean}
     */
    Base.prototype.isOpened = function() {
        return this.content && this.content.hasClass('lbx-showed') ? true : false;
    };
    
    /**
     * @method isMinimized
     * @return {Boolean}
     */
    Base.prototype.isMinimized = function() {
        return this.content && this.content.css('display') == 'none';
    };
    
    /**
     * @method setTitle
     * @param {String} title
     */
    Base.prototype.setTitle = function(title) {
        if ( this.isOpened() ) {
            this.content.find('.lbx-header').html(title);
        }
    };
    
    /**
     * @method setScrollableContent
     * @param {String} selector
     */
    Base.prototype.setScrollableContent = function(selector) {
        var needStopPropagation = false;
        
        $('body').on('touchstart', selector, function(event) {
            var target = event.currentTarget;
            
            needStopPropagation = target.scrollHeight > target.offsetHeight;
            
            if ( target.scrollTop <= 2 ) {
                target.scrollTop = 2;
            } else if ( target.scrollHeight >= target.scrollTop + target.offsetHeight - 2 ) {
                target.scrollTop -= 2;
            }
        });
        $('body').on('touchmove', selector, function(event) {
            if ( needStopPropagation ) {
                event.stopPropagation();
            }
        });
    };
    
    /**
     * @method _buildHtml
     */
    Base.prototype._buildHtml = function() {
        var content, overlay, contentClass;
        
        if ( this.content ) {
            return this;
        }
        overlay = {tag: 'div', className: 'lbx-overlay lbx-overlay-' + this.className.replace('lbx-', '')};
        
        if ( this.showOverlay ) {
            this.overlay = this.builder.buildDomModel(document.body, overlay);
        }
        contentClass = 'lbx-window ' + (core.helperAds.isOn() ? 'has-ads' : 'no-ads') + ' ' + (this.className || '');
        content = {tag: 'div', className: contentClass, styles: {visibility: 'hidden'},
            childs: [
                this.showCloseButton ? {tag: 'a', id: 'exit', events: [{click: this.close.bind(this)}]} : {},
                this.showMinimizeButton ? {tag: 'a', id: 'minimize', events: [{click: this.minimize}]} : {},
                {tag: 'span', className: 'lbx-header', html: this.workingHeader},
                {tag: 'div', className: 'lbx-content',
                    childs: [/** Wypelniane html-em lub modelem **/]
                },
                {tag: 'span', className: 'lbx-footer'}
            ]
        };
        if ( $.isPlainObject(this.workingModel) ) {
            content.childs[3].childs[0] = this.workingModel;
        } else {
            content.childs[3].childs.push({tag: 'p', className: 'simple-text', html: this.workingModel});
        }

        this.content = this.builder.buildDomModel(document.body, content);
        this.content.css(this._center());
        this.content.css('visibility', 'visible');

        return this;
    };
    
    /**
     * @method _center
     */
    Base.prototype._center = function() {
        var pos = {top: 0, left: 0},
            w = $(window);

        pos.left = (w.width() / 2) - (this.content.width() / 2);
        pos.top = w.scrollTop() + (w.height() / 2) - (this.content.height() / 2);
        pos.left = pos.left > 0 ? pos.left : 0;
        pos.top = pos.top > 0 ? pos.top : 0;

        return pos;
    };
    
    return Base;
});