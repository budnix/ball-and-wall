
define('app/game', 
[
    'app/stage', 
    'app/entities/_', 'app/entity/_',
    'app/dashboard', 'app/player', 'app/core/_', 'app/indicator', 'app/preloader', 'app/i18/_', 'app/sound',
    'app/levels', 'app/input/_', 'app/facade',
    'app/window/_',
    'app/game-options', 'app/episodes/_'
], 
function(stage, 
        entities, entity,
        dashboard, player, core, indicator, preloader, i18, sound, 
        levels, input, facade, _window, gameOptions, episode) {
            
    var 
        /**
         * @property _options
         * @static
         * @private
         * @type {Object}
         */
        _options = {
            splashscreen: false,
            customLevel: null
        };
            

    function Game(options) {
        // na mobile off
        document.onmousedown = function() { return false; };
        
        core.helperFont.injectDefault();
        this.options = options || _options;
        this.isGameStarted = false;
        this.isGameLoaded = false;
        this.episodeLevel = 0;
        
        if ( this.options.splashscreen ) {
            dashboard.disabled(true);
        }
        if ( this.options.customLevel ) {
            episode.use(this.options.customLevel.split(':')[0]).lock(true);
        }
        this.applyI18();
        preloader.load();
        
        this.windowAuth = new _window.Auth();
        this.windowFirstTime = new _window.FirstTime();
        this.windowGames = new _window.Games();
        this.windowHelp = new _window.Help();
        this.windowOptions = new _window.Options();
        this.windowOrientationIndicator = new _window.OrientationIndicator();
        this.windowRounds = new _window.Rounds();
        this.windowRoundWin = new _window.RoundWin();
        
        this.onWindowResize();
        this.onWindowOrientationChange();
        this.initEvents();
    }
    
    /**
     * @method initEvents
     */
    Game.prototype.initEvents = function() {
        var w = $(window), d = $(document);
        
        w.bind('resize', $.proxy(this.onWindowResize, this));
        w.bind('orientationchange', $.proxy(this.onWindowOrientationChange, this));
        
        if ( window === window.top && core.helperApp.platform() != 'wp8' ) {
            w.bind('focus', $.proxy(this.onWindowFocus, this));
            w.bind('blur', $.proxy(this.onWindowBlur, this));
            d.bind('webkitvisibilitychange', $.proxy(this.onWindowVisibilityChange, this));
            d.bind('webkitvisibilitychange', $.proxy(this.onWindowVisibilityChange, this));
        }
        $('#' + stage.stage.canvas.id).bind('click', $.proxy(this.onStageClick, this));
        $('#a-auth').bind('click', $.proxy(this.onBtnUserClick, this));
        this.windowAuth.addListener('clickLogin', $.proxy(this.onWindowAuthClickLogin, this));
        this.windowAuth.addListener('clickRegister', $.proxy(this.onWindowAuthClickRegister, this));
        this.windowFirstTime.addListener('close', $.proxy(this.onWindowFirstTimeClose, this));
        this.windowGames.addListener('selectEpisode', $.proxy(this.onWindowGamesSelectEpisode, this));
        this.windowRounds.addListener('back', $.proxy(this.onWindowRoundsBack, this));
        this.windowRounds.addListener('play', $.proxy(this.onWindowRoundsPlayGame, this));
        this.windowRoundWin.addListener('goToEpisodes', $.proxy(this.onWindowStatsGoToEpisodes, this));
        this.windowRoundWin.addListener('goToRounds', $.proxy(this.onWindowGamesSelectEpisode, this));
        this.windowRoundWin.addListener('nextRound', $.proxy(this.onWindowRoundWinNextRound, this));
        this.windowRoundWin.addListener('retryRound', $.proxy(this.onWindowRoundWinRetryRound, this));
        core.mediator.addListener('game:game-over', $.proxy(this.onGameOver, this));
        core.mediator.addListener('game:stage-clear', $.proxy(this.onGameClearStage, this));
        dashboard.addListener('clickHelp', $.proxy(this.onBtnHelpClick, this));
        dashboard.addListener('clickOptions', $.proxy(this.onBtnOptionsClick, this));
        dashboard.addListener('clickPlay', $.proxy(this.onBtnStartGameClick, this));
        dashboard.addListener('clickUser', $.proxy(this.onBtnUserClick, this));
        gameOptions.addListener('change:window-games', $.proxy(this.onEpisodeChange, this));
        player.addListener('login', $.proxy(this.onPlayerLogin, this));
        player.addListener('logout', $.proxy(this.onPlayerLogout, this));
        player.addListener('register', $.proxy(this.onPlayerRegister, this));
        preloader.addListener('complete', $.proxy(this.onPreloaderComplete, this));
    };
    
    /**
     * @method applyI18
     */
    Game.prototype.applyI18 = function() {
        $('#a-level-editor').text(i18._('le-header'));
    };
    
    /**
     * @method update
     * @param {Object} event
     */
    Game.prototype.update = function(event) {
        if ( event.paused ) {
            return;
        }
        if ( !this.isGameStarted ) {
            entities.paddles.hide();
        }
        entities.paddles.update(event);
        levels.getBonuses().update(event);
        entities.balls.update(event);
        entities.scores.update(event);
        entities.clouds.update(event);
        entities.blocks.update(event);
        stage.update(event);
    };
    
    /**
     * @method startGame
     * @param {String} episode
     * @param {Number} level
     */
    Game.prototype.startNewGame = function(episode, level) {
        sound.resetSettings();
        $('#a-game-canvas').addClass('a-playing');
        this.clearStage();
        levels.loadLevel(level).build();
        entities.balls.create().setAlive(false);
        entities.paddles.create();

        this.isGameStarted = true;
        core.mediator.emit('game:game-start');
        dashboard.getTime().reset();
        dashboard.getScore().reset();
        dashboard.getSpeed().reset();
        dashboard.getLives().reset();
        
        if ( levels.isCustom() ) {
            dashboard.getRound().setMax(1).set(1);
        } else {
            dashboard.getRound().setMax(levels.getLevelsLength()).set(levels.getCurrentLevelIndex() + 1);
            facade.clear().show(i18._('round') + ' ' + (levels.getCurrentLevelIndex() + 1) 
                    + '\n(' + levels.getCurrentLevelName() + ')');
        }
        dashboard.getTime().start();
        sound.stopMusic();
    };
    
    /**
     * @method startLevelGame
     * @param {Number} level
     */
    Game.prototype.startLevelGame = function(level) {
        this.clearStage();
        levels.loadLevel(level).build();
        entities.balls.create();
        entities.paddles.create();
        dashboard.getTime().reset();
        dashboard.getScore().reset();
        dashboard.getSpeed().reset();
        dashboard.getRound().set(levels.getCurrentLevelIndex() + 1);
        dashboard.getTime().start();
        this.windowRounds.unlockLevel(episode.getName(), levels.getCurrentLevelIndex());
        
        if ( !levels.isCustom() ) {
            facade.clear().show(i18._('round') + ' ' + (levels.getCurrentLevelIndex() + 1)
                    + '\n(' + levels.getCurrentLevelName() + ')');
        }
        core.mediator.emit('game:level-start', levels.getCurrentLevelIndex() + 1);
        sound.stopMusic();
    };
        
    /**
     * @method gameOver
     */
    Game.prototype.gameOver = function() {
        if ( !this.isGameLoaded ) {
            return;
        }
        $('#a-game-canvas').removeClass('a-playing');
        this.isGameStarted = false;
        dashboard.getTime().stop();
        entities.balls.destroy();
        facade.clear().show(i18._('game-over'), {autohide: false});
        sound.playMusic();
    };
        
    /**
     * @method splashScreen
     */
    Game.prototype.splashScreen = function() {
        sound.disableSounds(true);
        this.clearStage();
        levels.loadSplashScreen(this.options.splashscreen).build();
        entities.balls.create().setAlive(true).setSpeed(core.helperApp.pixelRatio(), Math.random() * Math.PI / 2 + Math.PI).bounceBottom(true);
        entities.balls.create().setAlive(true).setSpeed(core.helperApp.pixelRatio(), Math.random() * Math.PI).bounceBottom(true);
        entities.paddles.create();
        
        if ( !this.options.splashscreen ) {
            facade.clear().show(i18._('splash-screen-welcome-text'), {autohide: false});
        }
    };
        
    /**
     * @method clearStage
     */
    Game.prototype.clearStage = function() {
        entities.balls.destroy();
        entities.paddles.destroy();
        levels.destroy();
        facade.clear();
        stage.clear();
    };

    /**
     * @method onGameOver
     */
    Game.prototype.onGameOver = function() {
        this.gameOver();
    };

    /**
     * @method onGameClearStage
     */
    Game.prototype.onGameClearStage = function() {
        if ( this.options.splashscreen ) {
            return;
        }
        if ( !dashboard.getTime().timer ) {
            return;
        }
        dashboard.getTime().stop();
        facade.clear().show(i18._('round-well-done'), {autohide: false});
        
        setTimeout(function() {
            entities.balls.destroy();
            entities.paddles.destroy();
        }, 0);
        setTimeout($.proxy(function() {
            if ( this.windowRoundWin.isOpened() ) {
                return;
            }
            this.windowRoundWin.open({
                isCustom: levels.isCustom(),
                episode: episode.getName(),
                round: levels.getCurrentLevelIndex() + 1,
                maxRound: levels.getLevelsLength(),
                time: dashboard.getTime().get(), 
                lives: dashboard.getLives().get(),
                score: dashboard.getScore().get()
            });
            sound.play('win');
        }, this), 2000);
    };
    
    /**
     * @method onStageClick
     * @param {Object} event
     */
    Game.prototype.onStageClick = function(event) {
        if ( this.isGameStarted || this.options.splashscreen || this.options.customLevel ) {
            return;
        }
        this.windowRounds.open({
            game: episode.getName(),
            levels: levels.getLevelNames()
        });
    };
    
    /**
     * @method onEpisodeChange
     * @param {Object} currentOptions
     * @param {Object} prevOptions
     */
    Game.prototype.onEpisodeChange = function(currentOptions, prevOptions) {
        if ( currentOptions.game != prevOptions.game ) {
            sound.stopMusic(true);
            dashboard.hide();
            preloader.load();
        }
    };
        
    /**
     * @method onPlayerLogin
     * @param {Object} event
     */
    Game.prototype.onPlayerLogin = function(event) {
        // Support for logged players
        if ( event.result == 'ok' ) {
            dashboard.getAuth().login(event.response);

            if ( !event.silentMode ) {
                this.windowAuthDashboard.open();
            }
            indicator.hide();
        } else {
            dashboard.getAuth().logout();

            if ( event.silentMode ) {
                indicator.hide();
            } else {
                setTimeout($.proxy(function() {
                    this.windowAuth.open('login', true);
                    indicator.hide();
                }, this), 1000);
            }
        }
    };
    
    /**
     * @method onPlayerLogout
     */
    Game.prototype.onPlayerLogout = function() {
        indicator.hide();
    };
    
    /**
     * @method onPlayerRegister
     * @param {Object} event
     */
    Game.prototype.onPlayerRegister = function(event) {
        // Support for register players
        if ( event.result == 'ok' ) {
            dashboard.getAuth().login(event.response);
            this.windowAuthDashboard.open();
            indicator.hide();
        } else {
            dashboard.getAuth().logout();

            if ( event.silentMode ) {
                indicator.hide();
            } else {
                setTimeout($.proxy(function() {
                    this.windowAuth.open('register', true);
                    indicator.hide();
                }, this), 1000);
            }
        }
    };
    
    /**
     * @method onBtnStartGameClick
     * @param {event} event
     */
    Game.prototype.onBtnStartGameClick = function(event) {
        if ( event ) {
            event.preventDefault();
        }
        if ( this.options.customLevel ) {
            this.windowGames.open({
                isCustom: true,
                game: episode.getName()
            });
        } else {
            this.windowRounds.open({
                game: episode.getName(),
                levels: levels.getLevelNames()
            });   
        }
    };

    /**
     * @method onBtnOptionsClick
     * @param {event} event
     */
    Game.prototype.onBtnOptionsClick = function(event) {
        if ( event ) {
            event.preventDefault();
        }
        this.windowOptions.open();
    };

    /**
     * @method onBtnHelpClick
     * @param {event} event
     */
    Game.prototype.onBtnHelpClick = function(event) {
        if ( event ) {
            event.preventDefault();
        }
        this.windowHelp.open();
    };

    /**
     * @method onBtnUserClick
     * @param {event} event
     */
    Game.prototype.onBtnUserClick = function(event) {
        if ( event ) {
            event.preventDefault();
        }
        if ( !player.isLogged() ) {
            this.windowAuth.open('login');
        }
    };
    
    // WindowStatsWin
    /**
     * @method onWindowRoundWinRetryRound
     */
    Game.prototype.onWindowRoundWinRetryRound = function() {
        if ( this.options.customLevel ) {
            this.startLevelGame('custom:' + this.options.customLevel.split(':')[1]);
        } else {
            this.startLevelGame(levels.getCurrentLevelIndex());
        }
    };
    
    /**
     * @method onWindowRoundWinNextRound
     */
    Game.prototype.onWindowRoundWinNextRound = function() {
        this.startLevelGame(levels.getCurrentLevelIndex() + 1);
    };
    
    /**
     * @method onWindowRoundWinNextRound
     */
    Game.prototype.onWindowStatsGoToEpisodes = function() {
        if ( this.options.customLevel ) {
            this.windowGames.open({
                isCustom: true,
                game: episode.getName()
            });
        } else {
            this.windowGames.open();   
        }
    };
    
    // WindowRounds
    /**
     * @method onWindowRoundsBack
     */
    Game.prototype.onWindowRoundsBack = function() {
        this.windowGames.open();
    };
    
    /**
     * @method onWindowRoundsPlayGame
     * @param {Object} event
     */
    Game.prototype.onWindowRoundsPlayGame = function(event) {
        this.startNewGame(event.episode, event.level);
    };

    // WindowGames
    /**
     * @method onWindowGamesSelectEpisode
     */
    Game.prototype.onWindowGamesSelectEpisode = function() {
        this.windowRounds.open({
            game: episode.getName(),
            levels: levels.getLevelNames()
        });
    };

    // WindowAuth
    /**
     * @method onWindowAuthClickLogin
     * @param {Object} loginData
     */
    Game.prototype.onWindowAuthClickLogin = function(loginData) {
        indicator.show();
        player.login(loginData);
    };

    /**
     * @method onWindowAuthClickRegister
     * @param {Object} registerData
     */
    Game.prototype.onWindowAuthClickRegister = function(registerData) {
        indicator.show();
        player.register(registerData);
    };

    // WindowFirstTime

    /**
     * @method onWindowFirstTimeClose
     */
    Game.prototype.onWindowFirstTimeClose = function() {
        this.windowRounds.open({
            game: episode.getName(),
            levels: levels.getLevelNames()
        });
    };
    
    /**
     * @method onPreloaderComplete
     */
    Game.prototype.onPreloaderComplete = function() {
        $('#a-container').css('visibility', 'visible');
        $(document.body).css('backgroundImage', 'url("' + preloader.get('h-bg').src + '")')
                .attr('id', gameOptions.get('window-games:game'));
        $(document.body)
                .addClass('platform-' + core.helperBrowser.platform.name)
                .addClass('browser-' + core.helperBrowser.name)
                .addClass('app-' + core.helperApp.platform());
        facade.setOptions(episode.getManifest().facade);
        core.mediator.emit('game:game-over');
        this.clearStage();

        // TODO: For now we can only support episode 'space' for retina devices (like ipad, iphone and MacbookPro Retina)
        if ( core.helperApp.pixelRatio() >= 2 ) {
            EPISODES = ['space'];
        }
        // TODO: tmp
        if ( gameOptions.get('window-games:game') == 'space' ) {
            $('#a-game-bottom-line').css('backgroundImage', 'url("' + preloader.get('h-bottom-line').src + '")');
        }
        if ( this.options.splashscreen ) {
            createjs.Ticker.setFPS(gameOptions.get('fps'));
            this.splashScreen();

        } else if ( this.options.customLevel ) {
            if ( !this.isGameLoaded ) {
                player.silentLogin();
                createjs.Ticker.setFPS(gameOptions.get('fps'));
            }
            this.startNewGame(this.options.customLevel.split(':')[0], 'custom:' + this.options.customLevel.split(':')[1]);

        } else {
            if ( location.hash == '#contact' ) {
                location.hash = '';
                this.windowHelp.open();
                this.windowHelp.tab.changeTab(1);

            } else if ( gameOptions.get('window-games:game') == 'space' && gameOptions.get('window-first-time:needToShow') 
                    && $(window).width() >= 560 ) {
                this.windowFirstTime.open();
                gameOptions.set('window-first-time', {needToShow: false});

            } else if ( gameOptions.get('window-games').showOnStartup && !this.isGameLoaded && EPISODES.length > 1 ) {
                this.windowGames.open();

            } else if ( this.isGameLoaded ) {
                if ( this.windowGames.isOpened() ) {
                    this.windowGames.close();
                    this.windowRounds.open({
                        game: episode.getName(),
                        levels: levels.getLevelNames()
                    });
                }
            }
            if ( !this.isGameLoaded ) {
                player.silentLogin();
                createjs.Ticker.setFPS(gameOptions.get('fps'));
            }
            if ( episode.getManifest().splashscreen && !core.helperBrowser.isMobile ) {
                this.splashScreen();

            } else {
                entities.paddles.create();
                facade.clear().show(i18._('splash-screen-welcome-text'), {autohide: false});                        
            }
            dashboard.getRound().setMax(levels.getLevelsLength());
            sound.playMusic();
        }
        if ( !createjs.Ticker.hasEventListener('tick') ) {
            var _this = this;
            
            createjs.Ticker.addEventListener('tick', function(event) {
                _this.update(event);
            });
        }
        this.isGameLoaded = true;
    };
    
    /**
     * @method onWindowFocus
     */
    Game.prototype.onWindowFocus = function() {
        createjs.Ticker.setPaused(false);
        
        if ( !this.isGameStarted ) {
            sound.playMusic();
        }
    };
    
    /**
     * @method onWindowBlur
     */
    Game.prototype.onWindowBlur = function() {
        createjs.Ticker.setPaused(true);
        sound.stopMusic(true);
    };
    
    /**
     * @method onWindowVisibilityChange
     */
    Game.prototype.onWindowVisibilityChange = function() {
        if ( document.webkitHidden ) {
            createjs.Ticker.setPaused(true);
            sound.stopMusic(true);
        } else {
            createjs.Ticker.setPaused(false);
            
            if ( !this.isGameStarted ) {
                sound.playMusic();
            }
        }
    };
    
    /**
     * @method onWindowResize
     */
    Game.prototype.onWindowResize = function() {
        $(document.body).css('height', window.innerHeight + 'px');
        $(document.body).css('width', window.innerWidth + 'px');
        input.pointer.updateStageCoords();
        window.scrollTo(0, 0);
    };
    
    /**
     * @method onWindowOrientationChange
     */
    Game.prototype.onWindowOrientationChange = function() {
        if ( !core.helperBrowser.isMobile ) {
            return;
        }
        var isDeviceSupportPortrait = ['iphone', 'ipod'].indexOf(core.helperBrowser.platform.iosDevice) !== -1,
            isPortraitMode = window.innerWidth < window.innerHeight;
        
        if ( (isDeviceSupportPortrait && !isPortraitMode) || (!isDeviceSupportPortrait && isPortraitMode) ) {
            this.windowOrientationIndicator.open();
        } else {
            if ( this.windowOrientationIndicator.isOpened() ) {
                this.windowOrientationIndicator.close();
            }
        }
    };
    
    return Game;
});