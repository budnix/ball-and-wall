
define('app/window/first-time', 
[
    'app/window/_base', 'app/i18/_', 'app/core/_'
],
function(WindowBase, i18, core) {
    
    var 
        /**
         * @property _slides
         * @static
         * @private
         * @type {Array}
         */
        _slides = [
            function(i) {
                return {
                    title: i18._('first-time-slide-' + i + '-title'),
                    elements: [
                        {tag: 'div', className: 'slide-desc', html: i18._('first-time-slide-' + i + '-desc')},
                        {tag: 'div', className: 'slide-body', childs: (function() {
                                var childs = [];
                                
                                $.each(i18._('first-time-slide-' + i + '-desc-list'), function(){
                                    childs.push({tag: 'p', className: 'list', html: this});
                                });
                                
                                return childs;
                            }())
                        },
                        {tag: 'div', className: 'slide-image', childs: [
                            {tag: 'img', src: SS + 'images/episodes/space/first-time/slide-1.jpg'}
                        ]}
                    ]
                };
            },
            function(i) {
                return {
                    title: i18._('first-time-slide-' + i + '-title'),
                    elements: [
                        {tag: 'div', className: 'slide-desc', html: i18._('first-time-slide-' + i + '-desc')},
                        {tag: 'div', className: 'slide-image', childs: [
                            {tag: 'img', src: SS + 'images/episodes/space/first-time/slide-2.jpg'}
                        ]},
                        {tag: 'div', className: 'slide-body', childs: (function() {
                                var childs = [];
                                
                                $.each(i18._('first-time-slide-' + i + '-desc-list'), function(){
                                    childs.push({tag: 'p', className: 'list', html: this});
                                });
                                
                                return childs;
                            }())
                        }
                    ]
                };
            },
            function(i) {
                return {
                    title: i18._('first-time-slide-' + i + '-title'),
                    elements: [
                        {tag: 'div', className: 'slide-desc', html: i18._('first-time-slide-' + i + '-desc')},
                        {tag: 'div', className: 'slide-image', childs: [
                            {tag: 'img', src: SS + 'images/episodes/space/first-time/slide-3.jpg'}
                        ]},
                        {tag: 'div', className: 'slide-body', childs: (function() {
                                var childs = [];
                                
                                $.each(i18._('first-time-slide-' + i + '-desc-list'), function(){
                                    childs.push({tag: 'p', className: 'list', html: this});
                                });
                                
                                return childs;
                            }())
                        }
                    ]
                };
            }
        ],
        
        /**
         * @property _getSlide
         * @static
         * @private
         * @type {Function}
         */
        _correctOnFirefox = null;


    _correctOnFirefox = function _correctOnFirefox(slideElement) {
        if ( core.helperBrowser.name != 'firefox' ) {
            return;
        }
        slideElement.find('.slide-body').css({
            display: 'inline-block',
            position: 'relative',
            top: -33
        });
        slideElement.find('.slide-image').css({
            display: 'inline-block'
        });
        slideElement.parent('.body-cont').css({
            paddingTop: 0
        });
    };
    
    function FirstTime() {
        WindowBase.call(this);
        this.name = 'first-time';
        this.className = 'lbx-first-time';
        this.showOverlay = true;
        this.slideIndex = 0;
        this.options = {};
        this.initialize({});
    }
    
    FirstTime.prototype = Object.create(WindowBase.prototype, {
        constructor: {
            value: FirstTime,
            enumerable: false
        }
    });
    
    /**
     * @method header
     */
    FirstTime.prototype.header = function() {
        return '';
    };
    
    /**
     * @method model
     */
    FirstTime.prototype.model = function() {
        return {
            tag: 'div', className: 'tab-contents', childs: [
                {tag: 'div', className: 'body-cont default alert', childs: [
                    {tag: 'div', className: 'slide-frame', childs: []}
                ]},
                {tag: 'div', className: 'buttons-cont', childs: [
                    {tag: 'div', className: 'medium primary btn icon-left icon-arrow-left', childs: [
                        {tag: 'a', href: '#', html: i18._('back'), events: [
                            {click: $.proxy(this.onBack, this)}
                        ]}
                    ]},
                    {tag: 'div', className: 'medium primary btn icon-right icon-arrow-right', childs: [
                        {tag: 'a', href: '#', html: i18._('next'), events: [
                            {click: $.proxy(this.onNext, this)}
                        ]}
                    ]}
                ]}
            ]
        };
    };
    
    /**
     * @method initialize
     * @param {Object} options
     */
    FirstTime.prototype.initialize = function(options) {
        WindowBase.prototype.initialize.call(this, options);
    };
    
    /**
     * @method open
     * @param {Object} options
     */
    FirstTime.prototype.open = function(options) {
        WindowBase.prototype.open.call(this, options);
        this.switchSlide();
    };
    
    /**
     * @method back
     */
    FirstTime.prototype.back = function() {
        if ( this.slideIndex <= 0 ) {
            return;
        }
        this.slideIndex --;
        this.switchSlide();
        
        if ( this.slideIndex < _slides.length - 1 ) {
            this.content.find('.buttons-cont .icon-right a').text(i18._('next'));
        }
    };
    
    /**
     * @method next
     */
    FirstTime.prototype.next = function() {
        if ( this.slideIndex >= _slides.length - 1 ) {
            this.close();
            
            return;
        }
        this.slideIndex ++;
        this.switchSlide();
        
        if ( this.slideIndex === _slides.length - 1 ) {
            this.content.find('.buttons-cont .icon-right a').text(i18._('go-to-game'));
        }
    };
    
    /**
     * @method switchSlide
     */
    FirstTime.prototype.switchSlide = function() {
        var slideFrame = this.content.find('.slide-frame'), 
            slide = _slides[this.slideIndex](this.slideIndex + 1);
    
        if ( slideFrame.children().length ) {
            slideFrame.animate({opacity: 0}, 200, $.proxy(function() {
                slideFrame.css('opacity', 0);
                slideFrame.attr('class', 'slide-frame slide-' + (this.slideIndex + 1));
                this.builder.buildDomModel(slideFrame.empty(), slide.elements);
                _correctOnFirefox(slideFrame);
                this.setTitle(slide.title);
                slideFrame.animate({opacity: 1}, 200);
            }, this));
        } else {
            slideFrame.css('opacity', 0);
            slideFrame.attr('class', 'slide-frame slide-' + (this.slideIndex + 1));
            this.builder.buildDomModel(slideFrame.empty(), slide.elements);
            _correctOnFirefox(slideFrame);
            this.setTitle(slide.title);
            slideFrame.animate({opacity: 1}, 200);
        }
    };
    
    /**
     * @method onBack
     * @param {Object} event
     */
    FirstTime.prototype.onBack = function(event) {
        event.preventDefault();
        this.back();
    };

    /**
     * @method onNext
     * @param {Object} event
     */
    FirstTime.prototype.onNext = function(event) {
        event.preventDefault();
        this.next();
    };
    
    return FirstTime;
});