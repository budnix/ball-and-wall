
define('app/levels-editor', 
[
    'app/stage', 'app/entity/_', 'app/entities/_', 'app/levels', 'app/game-options',
    'app/preloader', 'app/dashboard', 'app/core/_', 'app/episodes/_', 'app/input/_', 'app/i18/_',
    'app/window/_', 'md5', 'fancyselect'
], 
function(stage, entity, entities, levels, gameOptions, preloader, dashboard, core, episode, input, i18, 
        _window, md5) {
    
    function LevelsEditor() {
        dashboard.disabled(true);
        createjs.Ticker.setFPS(gameOptions.get('fps'));
        this.dashboardElement = $('#dashboard');
        this.loadSaveButton = $('#btn-load-save');
        this.playButton = $('#btn-play');
        this.clearButton = $('#btn-clear');
        this.shareButton = $('#btn-share');
        this.backButton = $('#btn-back');
        this.episodesSelect = $('.episodes-select');
        this.playingLevel = false;
        this.selectedBlockId = 0;
        this.blocks = [];
        this.blocksAvailability = {};
        this.episodesSelect.fancySelect();
        this.episodesSelect.attr('disabled', true);
        core.helperFont.injectDefault();
        
        preloader.addListener('complete', $.proxy(function() {
            $('#a-container').css('visibility', 'visible');
            this.dashboardElement.css('visibility', 'visible');
            $(document.body).css('backgroundImage', 'url("' + preloader.get('h-bg').src + '")')
                    .attr('id', episode.getName());
            
            this.episodesSelect.val(episode.getName()).trigger('update.fs');
            this.applyI18();
            this.clearEditor();
            this.buildGrid();
            this.buildBlocksList('static');
            this.buildBlocksList('interactive');
            
//            levels.loadLevel(47);
//            levels.loadLevel('ufo:38,21,19;38,42,19;38,63,19;38,84,19;38,105,19;76,84,19;114,63,19;152,84,19;190,105,19;190,84,19;190,63,19;190,42,19;190,21,19;190,0,19;38,0,19;266,0,19;304,0,19;266,21,19;266,42,19;266,63,19;266,84,19;266,105,19;304,105,19;342,105,19;342,0,19;304,42,19;418,0,19;418,21,19;418,42,19;418,63,19;418,84,19;418,105,19;456,105,19;494,105,19;570,0,19;570,21,19;570,42,19;570,63,19;570,84,19;570,105,19;608,105,19;646,105,19;646,168,1;684,168,1;722,168,1;646,189,1;646,210,1;646,231,1;646,252,1;646,273,1;684,273,1;722,273,1;684,210,1;570,168,1;570,189,1;570,210,1;570,231,1;570,252,1;570,273,1;456,168,1;456,210,1;456,189,1;456,231,1;456,252,1;456,273,1;494,189,1;532,210,1;304,168,1;342,168,1;380,189,1;380,210,1;380,231,1;380,252,1;342,273,1;304,273,1;266,252,1;266,231,1;266,210,1;266,189,1;190,189,1;190,210,1;190,231,1;190,252,1;152,273,1;152,168,1;114,168,1;114,273,1;76,273,1;76,252,1;76,231,1;76,189,1;76,168,1;76,210,1');
//            $.each(levels.getBlocks().getChilds(), $.proxy(function(index, block) {
//                this.addBlock(block.getTypeId()).setPos(block.getX(), block.getY());
//            }, this));
//            levels.destroy();
            
            this.initEvents();
            this.onWindowResize();
        }, this));
        
        episode.use(gameOptions.get('level-editor:episode'));
        preloader.load();
    }
    
    /**
     * @method initEvents
     */
    LevelsEditor.prototype.initEvents = function() {
        var w = $(window), d = $(document);
        
        if ( !createjs.Ticker.hasEventListener('tick') ) {
            createjs.Ticker.addEventListener('tick', this.update.bind(this));
            w.bind('resize', $.proxy(this.onWindowResize, this));
            this.loadSaveButton.click($.proxy(this.onBtnLoadSaveLevelClick, this));
            this.playButton.click($.proxy(this.onBtnPlayLevelClick, this));
            this.clearButton.click($.proxy(this.onBtnClearLevelClick, this));
            this.shareButton.click($.proxy(this.onBtnShareLevelClick, this));
            this.backButton.click($.proxy(this.onBtnBackClick, this));
            this.dashboardElement.find('.share-holder .level-editor-btn').click($.proxy(this.onBtnShareLevelClick, this));
            this.episodesSelect.on('change.fs', $.proxy(this.onEpisodeSelectChange, this));
        }
    };
    
    /**
     * @method applyI18
     */
    LevelsEditor.prototype.applyI18 = function() {
        this.loadSaveButton.text(i18._('load-save'));
        this.playButton.text(i18._('play'));
        this.clearButton.text(i18._('clear-level'));
        this.shareButton.text(i18._('share-level'));
        this.backButton.text(i18._('back-to-main-page'));
        this.dashboardElement.find('.edit-header').text(i18._('le-header'));
        this.dashboardElement.find('.episodes-header').text(i18._('le-episodes-header'));
        this.dashboardElement.find('.static-blocks-header').text(i18._('le-static-blocks-header'));
        this.dashboardElement.find('.interactive-blocks-header').text(i18._('le-interactive-blocks-header'));
    };
        
    /**
     * @method update
     * @param {Object} event
     */
    LevelsEditor.prototype.update = function(event) {
        if ( event.paused ) {
            return;
        }
        if ( this.playingLevel ) {
            entities.paddles.update(event);
        }
        levels.getBonuses().update(event);
        entities.balls.update(event);
        entities.scores.update(event);
        entities.blocks.update(event);
        stage.update(event);
    };
    
    /**
     * @method buildGrid
     */
    LevelsEditor.prototype.buildGrid = function() {
        var _this = this;
        
        $.each(episode.getGrid(), function(index, pos) {
            stage.add(_this.getGridCell(pos));
        });
        stage.update();
    };
    
    /**
     * @method getGridCell
     * @param {Object} pos
     * @return {Base}
     */
    LevelsEditor.prototype.getGridCell = function(pos) {
        var _this = this, bitmap, block;

        bitmap = new createjs.Bitmap(preloader.get('c-block-empty').src);
        block = new entity.Base();
        block.id = 'grid';
        block.addListener('mousedown', function(event) {
            _this.onGridCellMouseAction(event);
        });
        block.addListener('mouseover', function(event) {
            _this.onGridCellMouseAction(event);
        });
        block.init(bitmap);
        block.setPos(pos.x, pos.y);
        block.setLayerId(10);
        
        return block;
    };
    
    /**
     * @method buildBlocksList
     * @param {String} blocksType
     */
    LevelsEditor.prototype.buildBlocksList = function(blocksType) {
        var _this = this, 
            select = $('#editor-' + blocksType + '-blocks');
        
        $.each(episode.getBlocks(), function(i, type) {
            var o, texture, src;
            
            if ( blocksType === 'interactive' ) {
                texture = type.entity;
            } else if ( blocksType === 'static' ) {
                texture = type.texture;
            } else {
                return;
            }
            if ( !texture ) {
                return;
            }
            src = (preloader.get('c-block-' + texture + '-preview') 
                ? preloader.get('c-block-' + texture + '-preview').src : preloader.get('c-block-' + texture).src);
            o = $('<a id="' + texture.replace('/', '-') + '" class="' + blocksType + '-block block" href="#"><img src="' 
                    + src + '" />' 
                    + (type.availability ? '<span class="availability">' + type.availability + '</span>' : '') + '</a>');
            
            if ( !i ) {
                o.addClass('selected');
            }
            o.bind('click', $.proxy(_this.onBlockPatternClick, _this));
            select.append(o);
        });
    };
    
    /**
     * @method getLevel
     * @return {String}
     */
    LevelsEditor.prototype.getLevel = function() {
        var level = [];
        
        $.each(this.blocks, function(i, entity) {
            level.push([entity.getX(), entity.getY(), entity.getTypeId()].join(','));
        });
        level = episode.getName() + ':' + level.join(';');
        
        return level;
    };
    
    /**
     * @method saveLevel
     * @param {String} level
     */
    LevelsEditor.prototype.saveLevel = function(level) {
        $.ajax({
            dataType: 'json',
            url: FULLADDR + 'level/' + md5(level) + '.html',
            method: 'post',
            data: {
                level: level
            },
            traditional: true,
            crossDomain: true
        });
    };
    
    /**
     * @method playLevel
     */
    LevelsEditor.prototype.playLevel = function() {
        stage.stage.enableMouseOver(0);
        stage.clear();
        levels.loadLevel(this.getLevel()).build();
//this.buildGrid();
        entities.balls.create().setAlive(false);
        entities.paddles.create();
        this.playingLevel = true;
        this.playButton.text(i18._('edit'));
        stage.stage.addEventListener('click', $.proxy(this.onStageClick, this));
    };
    
    /**
     * @method editLevel
     */
    LevelsEditor.prototype.editLevel = function() {
        stage.stage.enableMouseOver(50);
        this.playingLevel = false;
        entities.paddles.destroy();
        entities.balls.destroy();
        levels.destroy();
        stage.clear();
        this.buildGrid();
        $.each(this.blocks, function(i, block) {
            stage.add(block);
        });
        this.playButton.text(i18._('play'));
        stage.stage.removeAllEventListeners('click');
    };
    
    /**
     * @method clearEditor
     * @param {String} mode soft or hard
     */
    LevelsEditor.prototype.clearEditor = function(mode) {
        stage.stage.enableMouseOver(50);
        mode = mode ? mode : 'hard';
        this.playingLevel = false;
        entities.paddles.destroy();
        entities.balls.destroy();
        levels.destroy();
        $.each(this.blocks, function(i, block) {
            block.destroy();
        });
        this.blocks = null;
        this.blocks = [];
        this.blocksAvailability = {};
        this.resetUIBlockAvailability();
        stage.clear();
        this.playButton.text(i18._('play'));
        stage.stage.removeAllEventListeners('click');
        
        if ( mode == 'hard' ) {
            this.selectedBlockId = 0;
            $('#editor-static-blocks').empty();
            $('#editor-interactive-blocks').empty();
        }
    };
    
    /**
     * @method addBlock
     * @param {Number} blockId
     * @return {Block}
     */
    LevelsEditor.prototype.addBlock = function(blockId) {
        var _this = this, 
            block = entity.block.createNew(blockId);
        
        if ( block.getAvailability() && this.blocksAvailability[block.id] === undefined ) {
            this.blocksAvailability[block.id] = block.getAvailability();
        }
        if ( this.blocksAvailability[block.id] <= 0 ) {
            block.destroy();
            
            return null;
        }
        block.addListener('mousedown', function(event) {
            _this.onBlockStageMouseAction(event);
        });
        block.addListener('mouseover', function(event) {
            _this.onBlockStageMouseAction(event);
        });
        this.blocks.push(block);
        
        if ( this.blocksAvailability[block.id] !== undefined ) {
            this.blocksAvailability[block.id] --;
        }
        this.updateUIBlockAvailability();
        
        return block;
    };
    
    /**
     * @method removeBlock
     * @param {Block} block
     */
    LevelsEditor.prototype.removeBlock = function(block) {
        this.blocks.splice(this.blocks.indexOf(block), 1);
        block.destroy();
        
        if ( this.blocksAvailability[block.id] !== undefined ) {
            this.blocksAvailability[block.id] ++;
        }
        this.updateUIBlockAvailability();
    };
    
    /**
     * @method updateUIBlockAvailability
     */
    LevelsEditor.prototype.updateUIBlockAvailability = function() {
        var _this = this;
        
        $.each(this.blocksAvailability, function(key, value) {
            _this.dashboardElement.find('#' + key.replace('/', '-') + ' .availability').text(value);
        });
    };
    
    /**
     * @method resetUIBlockAvailability
     */
    LevelsEditor.prototype.resetUIBlockAvailability = function() {
        var _this = this;
        
        $.each(episode.getBlocks(), function(i, type) {
            if ( type.entity && type.availability ) {
                _this.dashboardElement.find('#' + type.entity.replace('/', '-') + ' .availability').text(type.availability);
            }
        });
    };
            
    /**
     * @method onStageClick
     * @param {Object} event
     */
    LevelsEditor.prototype.onStageClick = function(event) {
        if ( this.playingLevel && entities.balls.reset().current() ) {
            entities.balls.reset().current().setAlive(true);
        }
    };
    
    /**
     * @method onBlockPatternClick
     * @param {Object} event
     */
    LevelsEditor.prototype.onBlockPatternClick = function(event) {
        var _this = this;
        
        event.preventDefault();
        $('.block').each(function(i, el) {
            el = $(el);
            el.removeClass('selected');
            
            if ( el.context == event.delegateTarget ) {
                el.addClass('selected');
                _this.selectedBlockId = i;
            }
        });
    };
    
    /**
     * @method onGridCellMouseAction
     * @param {Object} event
     */
    LevelsEditor.prototype.onGridCellMouseAction = function(event) {
        if ( event.type == 'mousedown' && event.nativeEvent.button === 0 || input.pointer.isLeftClick() ) {
            var block, blocks, x, y;
            
            block = this.addBlock(this.selectedBlockId);
            
            if ( block ) {
                if ( block.id == 'block' || block.id == 'trampoline' ) {
                    x = event.target.getX();
                    y = event.target.getY();
                } else {
                    x = event.target.getX() - block.getHalfWidth() + event.target.getHalfWidth();
                    y = event.target.getY() - block.getHalfHeight() + event.target.getHalfHeight();
                }
                blocks = this.blocks.filter(function(block) {
                    return block.getX() === x && block.getY() === y;
                });

                if ( blocks.length === 0 ) {
                    block.setPos(x, y);
                    stage.add(block);
                } else {
                    this.removeBlock(block);
                }
            }
        }
    };
    /**
     * @method onBlockStageMouseAction
     * @param {Object} event
     */
    LevelsEditor.prototype.onBlockStageMouseAction = function(event) {
        if ( event.type == 'mousedown' && event.nativeEvent.button === 2 
                || input.pointer.isRightClick() && event.target instanceof entity.Base && event.target.id != 'grid' ) {
            this.removeBlock(event.target);
        }
    };
    
    /**
     * @method onEpisodeSelectChange
     * @param {Object} event
     */
    LevelsEditor.prototype.onEpisodeSelectChange = function(event) {
        episode.use(event.target.value);
        preloader.load();
        gameOptions.set('level-editor', {episode: event.target.value});
    };
    
    /**
     * @method onBtnLoadSaveLevelClick
     * @param {Object} event
     */
    LevelsEditor.prototype.onBtnLoadSaveLevelClick = function(event) {
        event.preventDefault();
        
    };
    
    /**
     * @method onBtnClearLevelClick
     * @param {Object} event
     */
    LevelsEditor.prototype.onBtnPlayLevelClick = function(event) {
        event.preventDefault();
        
        if ( this.playingLevel ) {
            this.editLevel();
        } else {
            this.playLevel();
        }
    };
    
    /**
     * @method onBtnClearLevelClick
     * @param {Object} event
     */
    LevelsEditor.prototype.onBtnClearLevelClick = function(event) {
        event.preventDefault();
        
        var confirm = new _window.Confirm();

        confirm.open(null, i18._('le-clear-confirm'));
        confirm.addListener('change', $.proxy(function(status) {
            if ( status == 'ok' ) {
                this.clearEditor('soft');
                this.editLevel();
            }
            confirm.close();
        }, this)); 
    };
    
    /**
     * @method onBtnShareLevelClick
     * @param {Object} event
     */
    LevelsEditor.prototype.onBtnShareLevelClick = function(event) {
        event.preventDefault();
        
        var target = $(event.target),
            type;
        
        type = target.attr('id').replace('btn-', '');
        
        if ( type == 'share' ) {
            if ( this.dashboardElement.find('.share-holder').css('marginLeft') == '-345px' ) {
                this.dashboardElement.find('.share-holder').animate({
                    marginLeft: 0
                }, 300);
                this.dashboardElement.find('.share-holder .level-editor-btn').animate({
                    width: 59
                }, 300);
            } else {
                this.dashboardElement.find('.share-holder').animate({
                    marginLeft: -345
                }, 300);
                this.dashboardElement.find('.share-holder .level-editor-btn').animate({
                    width: 111
                }, 300);
            }
        } else {
            if ( this.getLevel() ) {
                this.saveLevel(this.getLevel());
            }
            core.helperShare.open(type.replace('share-', ''), {
                url: encodeURIComponent(FULLADDR + 'level/' + md5(this.getLevel()) + '.html'),
                title: encodeURIComponent(core.utilsString.substitute(i18._('le-share-title'), {}))
            });
        }
    };
    
    /**
     * @method onBtnBackClick
     * @param {Object} event
     */
    LevelsEditor.prototype.onBtnBackClick = function(event) {
        event.preventDefault();
        
        location.href = FULLADDR;
    };
    
    /**
     * @method onWindowResize
     */
    LevelsEditor.prototype.onWindowResize = function() {
        $(document.body).css('height', window.innerHeight + 'px');
        $(document.body).css('width', window.innerWidth + 'px');
        input.pointer.updateStageCoords();
        window.scrollTo(0, 0);
    };

    return LevelsEditor;
});
