
define('app/core/tab', 
[
    'app/core/event-emitter'
], 
function(EventEmitter) {

    function Tab(options) {
        EventEmitter.call(this);
        this.options = {
            buttons: '',
            contents: '',
            default_tab: 0,
            active_tab_class : ''
        };
        this.initialize(options);
    }

    Tab.prototype = Object.create(EventEmitter.prototype, {
        constructor: {
            value: Tab,
            enumerable: false
        }
    });

    /**
     * @constructor
     * @class Tab
     * @param {Object} options
     */
    Tab.prototype.initialize = function(options) {
        this.options = $.extend(this.options, options || {});
        this.buttons = this.options.buttons;
        this.contents = this.options.contents;
        this.initEvents();
        this.setDefaultTab();
    };

    /**
     * Show tab by number
     * 
     * @method show
     * @param {Number} num
     */
    Tab.prototype.show = function(num) {
        this.buttons[num].show();
    };

    /**
     * Hide tab by number
     * 
     * @method hide
     * @param {Number} num
     */
    Tab.prototype.hide = function(num) {
        var l = this.buttons.length;

        if ( l <= 1 ) {
            return;
        }
        this.changeTab(num > 0 ? 0 : 1);
        this.buttons[num].hide();
        this.contents[num].hide();
    };

    /**
     * Init events
     * 
     * @method initEvents
     */
    Tab.prototype.initEvents = function() {
        this.buttons.each(function(index, element) {
            element = $(element);
            
            if ( element.tagName == 'SELECT' ) {
                element.bind('change', $.proxy(function(event) {
                    this.changeTab(element.selectedIndex);
                }, this));
            } else {
                element.bind('click', $.proxy(function(event) {
                    this.changeTab(index);
                    event.preventDefault();
                }, this));
            }
        }.bind(this));
    };

    /**
     * Change tab (with content) by number
     * 
     * @method changeTab
     * @param {Number} tabIndex
     */
    Tab.prototype.changeTab = function(tabIndex) {
        this.buttons.each($.proxy(function(index, element) {
            element = $(element);
            
            if ( tabIndex == index ) {
                element.addClass(this.options.active_tab_class);
            } else {
                element.removeClass(this.options.active_tab_class);
            }
        }, this));
        this.contents.each($.proxy(function(index, element) {
            element = $(element);
            element[tabIndex == index ? 'show' : 'hide']();
        }, this));
        this.emit('change', [tabIndex]);
    };

    /**
     * Set default tab
     * 
     * @method setDefaultTab
     */
    Tab.prototype.setDefaultTab = function() {
        this.changeTab(this.options.default_tab);
    };
    
    return Tab;
});