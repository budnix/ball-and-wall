
define('app/window/alert', 
[
    'app/window/_base', 'app/i18/_'
],
function(WindowBase, i18) {
    
    function Alert() {
        WindowBase.call(this);
        this.name = 'alert';
        this.className = 'lbx-alert';
        this.showOverlay = false;
        this.options = {};
        this.initialize();
    }
    
    Alert.prototype = Object.create(WindowBase.prototype, {
        constructor: {
            value: Alert,
            enumerable: false
        }
    });
    
    /**
     * @method header
     */
    Alert.prototype.header = function() {
        return this.options.alertTitle || i18._('alert-title');
    };
    
    /**
     * @method model
     */
    Alert.prototype.model = function() {
        var onConfirm = $.proxy(function(event) {
                event.preventDefault();
                this.emit('change', ['ok']);
            }, this);
            
        return {
            tag: 'div', className: 'tab-contents', childs: [
                {tag: 'div', className: 'body-cont default alert', html: this.options.alertText},
                {tag: 'div', className: 'buttons-cont', childs: [
                    {tag: 'div', className: 'medium primary btn', childs: [
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
    Alert.prototype.initialize = function(options) {
        WindowBase.prototype.initialize.call(this, options);
    };
    
    /**
     * @method open
     * @param {String} title
     * @param {String} text
     */
    Alert.prototype.open = function(title, text) {
        WindowBase.prototype.open.call(this, {
            alertTitle: title,
            alertText: text
        });
    };

    return Alert;
});