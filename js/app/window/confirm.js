
define('app/window/confirm', 
[
    'app/window/_base', 'app/i18/_'
],
function(WindowBase, i18) {
    
    function Confirm() {
        WindowBase.call(this);
        this.name = 'confirm';
        this.className = 'lbx-confirm';
        this.showOverlay = false;
        this.options = {};
        this.initialize();
    }
    
    Confirm.prototype = Object.create(WindowBase.prototype, {
        constructor: {
            value: Confirm,
            enumerable: false
        }
    });
    
    /**
     * @method header
     */
    Confirm.prototype.header = function() {
        return this.options.confirmTitle || i18._('confirm-title');
    };
    
    /**
     * @method model
     */
    Confirm.prototype.model = function() {
        var onCancel = $.proxy(function(event) {
                event.preventDefault();
                this.emit('change', ['cancel']);
            }, this),
            onConfirm = $.proxy(function(event) {
                event.preventDefault();
                this.emit('change', ['ok']);
            }, this);
            
        return {
            tag: 'div', className: 'tab-contents', childs: [
                {tag: 'div', className: 'body-cont default alert', html: this.options.confirmText},
                {tag: 'div', className: 'buttons-cont', childs: [
                    {tag: 'div', className: 'medium danger btn', childs: [
                        {tag: 'a', href: '#', html: i18._('cancel'), events: [{click: onCancel}]}
                    ]},
                    {tag: 'div', className: 'medium success btn', childs: [
                        {tag: 'a', href: '#', html: i18._('ok'), events: [{click: onConfirm}]}
                    ]}
                ]}
            ]
        };
    };
    
    /**
     * @method initialize
     * @param {Object} options
     */
    Confirm.prototype.initialize = function(options) {
        WindowBase.prototype.initialize.call(this, options);
    };
    
    /**
     * @method open
     * @param {String} title
     * @param {String} text
     */
    Confirm.prototype.open = function(title, text) {
        WindowBase.prototype.open.call(this, {
            confirmTitle: title,
            confirmText: text
        });
    };

    return Confirm;
});