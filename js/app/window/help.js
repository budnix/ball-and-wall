
define('app/window/help', 
[
    'app/window/_base', 'app/core/_', 'app/i18/_', 'app/game-options', 'app/episodes/_'
],
function(WindowBase, core, i18, gameOptions, episode) {

    function Help() {
        WindowBase.call(this);
        this.name = 'help';
        this.className = 'lbx-' + this.name;
        this.showOverlay = true;
        this.options = {};
        this.initialize();
    }
    
    Help.prototype = Object.create(WindowBase.prototype, {
        constructor: {
            value: Help,
            enumerable: false
        }
    });
    
    /**
     * @method header
     */
    Help.prototype.header = function() {
        return 'Help';
    };

    /**
     * @method model
     */
    Help.prototype.model = function() {
        
        return {
            tag: 'div', className: 'info-content', childs: [
                {tag: 'div', className: 'tab-buttons', childs: [
                    {tag: 'a', html: i18._('help-tab-game-rules'), className: 'tab-selected'},
                    {tag: 'a', html: i18._('help-tab-contact')},
                    {tag: 'a', html: i18._('help-tab-change-log')}
                ]},
                {tag: 'div', className: 'tab-contents game-rules', styles: {display: 'block'}, childs: [
                    {tag: 'div', className: 'row', childs: [
                        {tag: 'span', className: 'light label', html: i18._('help-game-rules-target-label')},
                        {tag: 'p', className: 'edge', html: i18._('help-game-rules-target-desc:' + gameOptions.get('window-games:game'))}
                    ]},
                    {tag: 'div', className: 'row', childs: [
                        {tag: 'span', className: 'light label', html: i18._('help-game-rules-score-label')},
                        {tag: 'p', className: 'edge', html: i18._('help-game-rules-score-desc:' + gameOptions.get('window-games:game'))}
                    ]},
                    {tag: 'div', className: 'row', childs: [
                        {tag: 'span', className: 'light label', html: i18._('help-game-rules-bonus-label')},
                        {tag: 'p', html: i18._('help-game-rules-bonus-desc:' + gameOptions.get('window-games:game'))},
                        {tag: 'ul', className: 'bonus bonus-list', childs: []}
                    ]}
                ]},
                {tag: 'div', className: 'tab-contents contact', styles: {display: 'none'}, childs: [
                    {tag: 'div', className: 'row', childs: [
                        {tag: 'li', id: 'contact-info', className: 'default alert', html: i18._('help-contact-text')},
                        {tag: 'ul', className: 'eleven columns centered', childs: [
                            {tag: 'li', className: 'field centered', childs: [
                                {tag: 'textarea', id: 'contact-text', className: 'input textarea', 
                                    placeholder: i18._('help-contact-text-placeholder')}
                            ]},
                            {tag: 'li', className: 'prepend field', childs: [
                                {tag: 'span', className: 'adjoined', html: '@'},
                                {tag: 'input', id: 'contact-email', className: 'xwide text input', type: 'text', 
                                    placeholder: i18._('help-contact-email-placeholder')},
                                {tag: 'div', className: 'medium primary btn', childs: [
                                    {tag: 'a', href: '#', html: i18._('help-contact-send'), events: [
                                        {click: $.proxy(this.onSendClick, this)}
                                    ]}
                                ]}
                            ]}
                        ]}
                    ]}
                ]},
                {tag: 'div', className: 'tab-contents changelog', styles: {display: 'none'}, childs: []}
            ]
        };
    };
    
    Help.prototype.initialize = function(options) {
        WindowBase.prototype.initialize.call(this, options);
    };

    /**
     * @method open
     * @param {Object} options
     */
    Help.prototype.open = function(options) {
        WindowBase.prototype.open.call(this, options);
    };

    /**
     * @method close
     */
    Help.prototype.close = function() {
        WindowBase.prototype.close.call(this);
    };

    /**
     * @method onSendClick
     */
    Help.prototype.onSendClick = function(event) {
        var text = this.content.find('#contact-text'),
            email = this.content.find('#contact-email'),
            info = this.content.find('#contact-info'),
            w = window,
            msg = '';
        
        event.preventDefault();
        
        if ( !text.val() || text.attr('disabled') ) {
            return;
        }
        text.attr('disabled', true).css('opacity', 0.5);
        email.attr('disabled', true).css('opacity', 0.5);
        info.html(i18._('help-contact-sending'));

        msg += navigator.userAgent + '\n';
        msg += 'Game version: ' + VERSION + '\n';
        msg += 'Inner: ' + w.innerWidth + 'x' + w.innerHeight + '\n';
        msg += 'Outer: ' + w.outerWidth + 'x' + w.outerHeight + '\n';
        msg += 'Settings (window-options): ' + JSON.stringify(gameOptions.get('window-options')) + '\n';
        msg += 'Settings (window-games): ' + JSON.stringify(gameOptions.get('window-games')) + '\n';
        
        if ( email.val() ) {
            msg += 'Email: ' + email.val();
        }
        msg += '\n\n-----------------------------\n';
        msg += 'Message: ' + text.val() + '\n';
        
        $.ajax({
            dataType: 'json',
            url: API_ADDR + 'contact.html',
            data: {message: msg},
            traditional: true,
            method: 'post',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        });
        setTimeout(function() {
            info.removeClass('default').addClass('secondary').html(i18._('help-contact-sent'));
            text.val('');
            email.val('');
            text.attr('disabled', false).css('opacity', 1);
            email.attr('disabled', false).css('opacity', 1);
        }, 3000);
    };

    /**
     * @method _buildHtml
     */
    Help.prototype._buildHtml = function() {
        var preloader = require('app/preloader'),
            bonuses = [],
            changelogLang = 'en-us', 
            changelogCont;
        
        $.each(episode.getBonuses(), function(index, value) {
            if ( episode.getBonuses()[Math.max(index - 1, 0)].name === value.name ) {
                return;
            }
            var preDesc = '', model;
            
            if ( value.name != 'score' ) {
                preDesc = core.utilsString.substitute(
                        i18._('help-game-rules-bonus-' + (value.score > 0 ? 'add' : 'subtract')), {
                            score: Math.abs(value.score)
                        });
                preDesc += ' ';
            }
            model = {tag: 'li', childs: [
                {tag: 'img', className: 'preview', src: preloader.get('c-bonus-' + value.name).src},
                {tag: 'span', className: 'desc', html: preDesc 
                            + core.utilsString.substitute(i18._('help-game-rules-bonus-' + value.name), value)}
            ]};
            bonuses.push(model);
        });
        this.workingModel.childs[1].childs[2].childs[2].childs = bonuses;
        WindowBase.prototype._buildHtml.call(this);
        changelogCont = this.content.find('.changelog');
        
        if ( i18.getLanguageCode() == 'pl' ) {
            changelogLang = i18.getLanguageCode();
        }
        $.ajax({
            dataType: 'json',
            url: FULLADDR + 'changelog/' + changelogLang + '.json' + REVISION,
            method: 'get',
            crossDomain: true,
            traditional: true,
            xhrFields: {
                withCredentials: true
            }
        }).done(function(resp) {
            $.each(resp, function(date, text) {
                changelogCont.append($('<div class="row"><span class="light label">' + 
                        date + '</span><p>' + text + '</p></div>'));
            }.bind(this));
        });
        this.tab = new core.Tab({
            buttons: this.content.find('.tab-buttons a'),
            contents: this.content.find('.tab-contents'),
            active_tab_class: 'tab-selected'
        });

        return this;      
    };

    return Help;
});