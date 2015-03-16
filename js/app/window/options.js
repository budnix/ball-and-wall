
define('app/window/options', 
[
    'app/window/_base', 'app/window/confirm', 'app/core/_', 'app/game-options', 'app/i18/_'
],
function(WindowBase, WindowConfirm, core, gameOptions, i18) {
    
    function Options() {
        WindowBase.call(this);
        this.name = 'options';
        this.className = 'lbx-options';
        this.showOverlay = true;
        this.options = $.extend({
            music: 'on',
            sound: 'on',
            lang: 'en-us'
        }, gameOptions.get('window-' + this.name) || {});
        this.options.cookieInfo = true;
        this.fps = this.options.fps;
        this.initialize();
    }
    
    Options.prototype = Object.create(WindowBase.prototype, {
        constructor: {
            value: Options,
            enumerable: false
        }
    });
    
    /**
     * @method header
     */
    Options.prototype.header = function() {
        return i18._('options-header');
    };
    
    /**
     * @method model
     */
    Options.prototype.model = function() {
        return {
            tag: 'div', className: 'options-window', childs: [
                {tag: 'div', className: 'tab-buttons', childs: [
                        core.helperApp.platform() == 'wp8' ? {} : {tag: 'a', href: '#', html: i18._('options-settings'), className: 'tab-selected'},
                        {tag: 'a', href: '#', html: i18._('options-languages')}
                    ]
                },
                core.helperApp.platform() == 'wp8' ? {} : {tag: 'div', className: 'tab-contents', styles: {display: 'block'},
                    childs: [/** **/]
                },
                {tag: 'div', className: 'tab-contents', styles: {display: 'none'},
                    childs: [/** **/]
                }
            ]
        };
    };
    
    /**
     * @property main
     * @type {Array}
     */
    Options.prototype.main = (function() {
        var list = [
            {type: 'label', value: function() {
                    var text = i18._('options-music');

                    if ( !document.createElement('audio').canPlayType ) {
                        text += ' (' + i18._('not-supported') + ')';
                    }

                    return text;
                }
            },
            {type: 'radio', id: 'music', items: [
                {name: function() {return i18._('on');}, value: 'on'},
                {name: function() {return i18._('off');}, value: 'off'}]
            },
            {type: 'label', value: function() {
                    var text = i18._('options-sounds');

                    if ( !document.createElement('audio').canPlayType ) {
                        text += ' (' + i18._('not-supported') + ')';
                    }

                    return text;
                }
            },
            {type: 'radio', id: 'sound', items: [
                {name: function() {return i18._('on');}, value: 'on'},
                {name: function() {return i18._('off');}, value: 'off'}]
            }
        ];
        
//        if ( core.helperApp.platform() != 'chrome' ) {
//            list.push({type: 'label', value: function() {return i18._('options-fps');}});
//            list.push({type: 'radio', id: 'fps', items: [
//                {name: function() {return '30FPS';}, value: 30},
//                {name: function() {return '60FPS';}, value: 60}]
//            });
//        }
        
        return list;
    }());
    
    /**
     * @property languages
     * @type {Array}
     */
    Options.prototype.languages = [
        {type: 'radio', id: 'lang', items: [
                {name: function() {return i18._('lang-full-name:en-us');}, value: 'en-us'},
                {name: function() {return i18._('lang-full-name:pl');}, value: 'pl'}
            ]
        }
    ];
    
    Options.prototype.initialize = function(options) {
        WindowBase.prototype.initialize.call(this, options);
        this.addListener('change', $.proxy(function(key, value) {
            this.options[key] = value;
            gameOptions.set('window-' + this.name, this.options);
        }, this));
        this.setScrollableContent('.tab-contents');
    };
    
    /**
     * @method open
     * @param {Object} options
     */
    Options.prototype.open = function(options) {
        WindowBase.prototype.open.call(this, options);
    };
    
    /**
     * @method close
     * @param {Object} options
     */
    Options.prototype.close = function(options) {
        WindowBase.prototype.close.call(this, options);
    };
    
    /**
     * @method onOptionClick
     * @param {DOMEvent} event
     */
    Options.prototype.onOptionClick = function(event) {
        var clicked, item, value, action, confirmBody;

        clicked = $(event.target);
        
        if ( !clicked.hasClass('option-item') ) {
            item = clicked.parent('.option-item');
        }
        if ( !clicked.hasClass('option-item-entry') ) {
            clicked = clicked.parent('.option-item-entry');
        }
        event.preventDefault();

        if ( item.hasClass('radio') ) {
            item.children().each($.proxy(function(i, element) {
                element = $(element);
                element.removeClass('selected');
                
                if ( element.context == clicked.context ) {
                    element.addClass('selected');
                    value = clicked.attr('data-item').split('|')[1];
                }
            }, this));
        }
        if ( item.hasClass('checkbox') ) {
            if ( clicked.hasClass('selected') ) {
                clicked.removeClass('selected');
                value = 0;
            } else {
                clicked.addClass('selected');
                value = 1;
            }
        }

        action = clicked.attr('data-item').split('|')[0];
        this.emit('change', [action, value]);

        if ( (action == 'lang' && i18.getLanguageCode() != value) || 
                (action == 'fps' && this.fps != value) ) {
            
            if ( action == 'lang' ) {
                confirmBody = i18._('confirm-change-language').replace('{lang}', i18._('lang-full-name:' + value));
            } else {
                confirmBody = i18._('confirm-change-fps').replace('{fps}', value.toUpperCase());
            }

            if ( core.helperBrowser.isMobile ) {
                if ( window.confirm(core.utilsString.stripTags(confirmBody)) ) {
                    location.reload();
                }
            } else {
                var confirm = new WindowConfirm();

                confirm.open(null, confirmBody);
                confirm.addListener('change', function(status) {
                    if ( status == 'ok' ) {
                        if ( core.helperApp.platform() == 'chrome' ) {
                            chrome.runtime.reload();                            
                        } else {
                            location.reload();
                        }
                    } else {
                        this.close();
                    }
                });   
            }
        }
    };
    
    /**
     * @method _buildHtml
     */
    Options.prototype._buildHtml = function() {
        var model, className;

        // main options
        if ( core.helperApp.platform() != 'wp8' ) {
            $.each(this.main, $.proxy(function(i, type) {
                model = {tag: 'div', className: 'option-item ' + type.type, childs: []};

                if ( type.type == 'label' ) {
                    model.childs.push({tag: 'div', className: 'header-label', html: type.value()});
                } else {
                    $.each(type.items, $.proxy(function(j, item) {
                        item.value = item.value ? item.value : '';

                        if ( type.type == 'checkbox' ) {
                            className = this.options[type.id] ? 'selected' : '';
                        } else {
                            className = this.options[type.id] == item.value ? 'selected' : '';
                        }

                        var subM = {tag: 'a', 'data-item': type.id + '|' + item.value,
                            className: 'option-item-entry ' + className, html: item.name(), 
                            events: [{click: $.proxy(this.onOptionClick, this)}]};

                        model.childs.push(subM);
                    }, this));

                    if ( type.label ) {
                        model.childs.push({tag: 'div', className: 'label', html: type.label()});
                    }
                }
                this.workingModel.childs[1].childs.push(model);
            }, this));
        }

        // languages
        $.each(this.languages, $.proxy(function(i, type) {
            model = {tag: 'div', className: 'option-item ' + type.type, childs: []};

            if ( type.type == 'label' ) {
                model.childs.push({tag: 'div', className: 'header-label', html: type.value()});
            } else {
                $.each(type.items, $.proxy(function(j, item) {
                    item.value = item.value ? item.value : '';
                    
                    if ( type.type == 'checkbox' ) {
                        className = this.options[type.id] ? 'selected' : '';
                    } else {
                        className = this.options[type.id] == item.value ? 'selected' : '';
                    }

                    var subM = {tag: 'a', 'data-item': type.id + '|' + item.value,
                        className: 'option-item-entry ' + className, html: item.name(), 
                        events: [{click: $.proxy(this.onOptionClick, this)}]};

                    model.childs.push(subM);
                }, this));

                if ( type.label ) {
                    model.childs.push({tag: 'div', className: 'label', html: type.label()});
                }
            }
            this.workingModel.childs[2].childs.push(model);
        }, this));

        WindowBase.prototype._buildHtml.call(this);
        
        new core.Tab({
            buttons: this.content.find('.tab-buttons a'),
            contents: this.content.find('.tab-contents'),
            active_tab_class: 'tab-selected',
            default_tab: 0
        });
    };
    
    return Options;
});