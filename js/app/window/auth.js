
define('app/window/auth', 
[
    'app/window/_base', 'app/i18/_', 'app/core/_'
], 
function(WindowBase, i18, core) {

    function Auth() {
        WindowBase.call(this);
        this.name = 'auth';
        this.className = 'lbx-auth';
        this.showOverlay = true;
        this.forms = {
            REGISTER: 'register',
            LOGIN: 'login'
        };
        this.options = {};
        this.initialize();
    }
    
    Auth.prototype = Object.create(WindowBase.prototype, {
        constructor: {
            value: Auth,
            enumerable: false
        }
    });

    /**
     * @method header
     */
    Auth.prototype.header = function() {
        return '';
    };

    /**
     * @method model
     */
    Auth.prototype.model = function() {
        return {
            tag: 'div', className: 'tab-contents', childs: [
                {tag: 'div', className: 'auth-cont lbx-cont', childs: [
                    // register
                    {tag: 'div', className: 'auth-register auth-form', styles: {display: 'none'}, childs: [
                        {tag: 'form', action: '#', 'data-form': 'register', childs: [
                            {tag: 'div', className: 'row', childs: [
                                {tag: 'div', className: 'default alert', html: i18._('auth-register-info')},
                                {tag: 'ul', className: '', childs: [
                                    {tag: 'li', className: 'prepend field', childs: [
                                        {tag: 'span', className: 'adjoined', html: i18._('auth-nickname')},
                                        {tag: 'input', type: 'text', className: 'xwide text input', value: '', 
                                            name: 'name', 
                                            placeholder: i18._('auth-nickname-placeholder'), maxLength: 20,
                                            required: 'true', pattern: '.{3,20}'}  
                                    ]},
                                    {tag: 'li', className: 'prepend field', childs: [
                                        {tag: 'span', className: 'adjoined', html: i18._('auth-password')},
                                        {tag: 'input', type: 'password', className: 'xwide text input', value: '', 
                                            name: 'password', 
                                            placeholder: i18._('auth-password-placeholder'), maxLength: 20,
                                            required: 'true', pattern: '.{3,20}'}  
                                    ]}
                                ]}
                            ]},
                            {tag: 'div', className: 'row', childs: [
                                {tag: 'input', className: 'medium primary btn', value: i18._('auth-register'), type: 'submit'},
                                {tag: 'span', className: 'or', html: ' ' + i18._('or') + ' '},
                                {tag: 'div', className: 'small default auth-link', childs: [
                                    {tag: 'a', href: '#', html: i18._('auth-go-to-login'), events: [
                                        {click: $.proxy(this.onGoToLoginFormClick, this)}
                                    ]}
                                ]}
                            ]}
                        ]}
                    ]},
                    // login
                    {tag: 'div', className: 'auth-login auth-form', styles: {display: 'none'}, childs: [
                        {tag: 'form', action: '#', 'data-form': 'login', childs: [
                            {tag: 'div', className: 'row', childs: [
                                {tag: 'div', className: 'default alert', html: i18._('auth-login-info')},
                                {tag: 'ul', className: '', childs: [
                                    {tag: 'li', className: 'prepend field', childs: [
                                        {tag: 'span', className: 'adjoined', html: i18._('auth-nickname')},
                                        {tag: 'input', type: 'text', className: 'xwide text input', value: '', 
                                            name: 'name', 
                                            placeholder: i18._('auth-nickname-placeholder'), maxLength: 20,
                                            required: 'true', pattern: '.{3,20}'}  
                                    ]},
                                    {tag: 'li', className: 'prepend field', childs: [
                                        {tag: 'span', className: 'adjoined', html: i18._('auth-password')},
                                        {tag: 'input', type: 'password', className: 'xwide text input', value: '', 
                                            name: 'password', 
                                            placeholder: i18._('auth-password-placeholder'), maxLength: 20,
                                            required: 'true', pattern: '.{3,20}'}  
                                    ]}
                                ]}
                            ]},
                            {tag: 'div', className: 'row', childs: [
                                {tag: 'input', className: 'medium primary btn', value: i18._('auth-login'), 
                                    type: 'submit'},
                                {tag: 'span', className: 'or', html: ' ' + i18._('or') + ' '},
                                {tag: 'div', className: 'small default auth-link', childs: [
                                    {tag: 'a', href: '#', html: i18._('auth-go-to-register'), events: [
                                        {click: $.proxy(this.onGoToRegistryFormClick, this)}
                                    ]}
                                ]}
                            ]}
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
    Auth.prototype.initialize = function(options) {
        WindowBase.prototype.initialize.call(this, options);
    };
    
    /**
     * @method open
     * @param {String} formType
     * @param {Boolean} errorMode
     */
    Auth.prototype.open = function(formType, errorMode) {
        WindowBase.prototype.open.call(this);
        
        this.initEvents();
        this._showForm(formType, errorMode);
        
        this.content.css('height', '290px');
        this.content.find('.tab-contents').css('height', '255px');
    };

    /**
     * @method close
     */
    Auth.prototype.close = function() {
        WindowBase.prototype.close.call(this);
    };
    
    /**
     * @method initEvents
     */
    Auth.prototype.initEvents = function() {
        this.content.find('form').bind('submit', $.proxy(function(event) {
            event.preventDefault();
            
            if ( $(event.target).attr('data-form') ) {
                this._fireAction($(event.target).attr('data-form'));
                this.close();
            }
        }, this));
    };
    
    /**
     * @method onClickRegister
     * @param {Object} event
     */
    Auth.prototype.onClickRegister = function(event) {
        event.preventDefault();
        this.content.find('.auth-register form').submit();
    };
    
    /**
     * @method onClickLogin
     * @param {Object} event
     */
    Auth.prototype.onClickLogin = function(event) {
        event.preventDefault();
        this.content.find('.auth-register form').submit();
    };
    
    /**
     * @method onLogoutClick
     * @param {Object} event
     */
    Auth.prototype.onLogoutClick = function(event) {
        event.preventDefault();
        this.emit('clickLogout');
        this.close();
    };
    
    /**
     * @method onCloseClick
     */
    Auth.prototype.onCloseClick = function() {
        this.close();
    };
    
    /**
     * @method onGoToLoginFormClick
     * @param {Object} event
     */
    Auth.prototype.onGoToLoginFormClick = function(event) {
        event.preventDefault();
        this._showForm(this.forms.LOGIN);
    };

    /**
     * @method onGotToRegistryFormClick
     * @param {Object} event
     */
    Auth.prototype.onGoToRegistryFormClick = function(event) {
        event.preventDefault();
        this._showForm(this.forms.REGISTER);
    };

    /**
     * @method _showForm
     * @param {String} type
     * @param {Boolean} errorMode
     */
    Auth.prototype._showForm = function(type, errorMode) {
        var desc;
        
        this.content.find('.auth-form').hide();
        this.content.find('.auth-' + type).show();
        if ( errorMode ) {
            desc = this.content.find('.auth-' + type + ' .alert');
            desc.html(i18._('auth-' + type + '-error'));
            desc[errorMode ? 'addClass' : 'removeClass']('danger');
        }
        setTimeout($.proxy(function() {
            var input = this.content.find('.auth-' + type + ' input[type=text]');
            if ( input ) {
                input.focus();
            }
        }, this), 200);
        this.content[type == 'register' ? 'addClass' : 'removeClass']('register');
        this.content.find('.lbx-header').attr('class', 'lbx-header');
        this.content.find('.lbx-header').addClass(type);
        this.content.find('.lbx-footer').attr('class', 'lbx-footer');
        this.content.find('.lbx-footer').addClass(type);
        
        this.setTitle(i18._('auth-' + type));
    };
    
    /**
     * @method _fireEvent
     * @param {String} action
     * @param {Object} data
     */
    Auth.prototype._fireAction = function(action, data) {
        if ( !data ) {
            data = {};
            this.content.find('.auth-' + action + ' input').each(function(i, el) {
                data[el.name] = el.value;
            }.bind(this));
        }
        this.emit('click' + (action.charAt(0).toUpperCase() + action.substr(1)), data);
    };

    return Auth;
});