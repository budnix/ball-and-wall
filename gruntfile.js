
module.exports = function(grunt) {

    var banner = 
        '/*! \n' +
        ' * Copyright (c) Budnix. \n' +
        ' * Licensed under the MIT license. \n' +
        ' * https://github.com/budnix/ball-and-wall \n' +
        ' * \n' +
        ' * Date: <%= grunt.template.today() %> \n' +
        ' */ \n';
    
    grunt.initConfig({
        // http://jshint.com/docs
        jshint: {
            options: {
                browser: true,
                curly: true,
                forin: true,
                newcap: true,
                undef: true,
                maxdepth: 4,
                boss: true,
                debug: true,
                eqnull: true,
                evil: true,
                funcscope: true,
                laxcomma: true,
                laxbreak: true,
                multistr: true,
                shadow: true,
                validthis: true,
                jquery: true,
                globals: {
                    'VERSION': true,
                    'API_ADDR': true,
                    'FULLADDR': true,
                    'SS': true,
                    'ENV': true,
                    'REVISION': true,
                    'EPISODES': true,
                    'define': true,
                    'require': true,
                    'createjs': true,
                    'chrome': true
                }
            },
            'all': [
                'js/app/*'
            ]
        },
        concat: {
            'output': {
                src: [
                    // core
                    'js/app/core/helper/ads.js',
                    'js/app/core/helper/app.js',
                    'js/app/core/helper/browser.js',
                    'js/app/core/helper/font.js',
                    'js/app/core/helper/fullscreen.js',
                    'js/app/core/helper/share.js',
                    'js/app/core/storage/global.js',
                    'js/app/core/storage/local.js',
                    'js/app/core/utils/number.js',
                    'js/app/core/utils/string.js',
                    'js/app/core/builder.js',
                    'js/app/core/event-emitter.js',
                    'js/app/core/fast-click.js',
                    'js/app/core/math.js',
                    'js/app/core/mediator.js',
                    'js/app/core/tab.js',
                    'js/app/core/_.js',
                    // dashboard
                    'js/app/dashboard/_base.js',
                    'js/app/dashboard/auth.js',
                    'js/app/dashboard/lives.js',
                    'js/app/dashboard/round.js',
                    'js/app/dashboard/score.js',
                    'js/app/dashboard/speed.js',
                    'js/app/dashboard/time.js',
                    'js/app/dashboard/_.js',
                    // entities
                    'js/app/entities/_base.js',
                    'js/app/entities/balls.js',
                    'js/app/entities/blocks.js',
                    'js/app/entities/bonuses.js',
                    'js/app/entities/bullets.js',
                    'js/app/entities/clouds.js',
                    'js/app/entities/scores.js',
                    'js/app/entities/paddles.js',
                    'js/app/entities/_.js',
                    // entity
                    'js/app/entity/_base.js',
                    'js/app/entity/block/_base.js',
                    'js/app/entity/block/block.js',
                    'js/app/entity/block/black-hole/_base.js',
                    'js/app/entity/block/black-hole/spinning.js',
                    'js/app/entity/block/black-hole/unstable.js',
                    'js/app/entity/block/trampoline.js',
                    'js/app/entity/ball.js',
                    'js/app/entity/bonus.js',
                    'js/app/entity/bullet.js',
                    'js/app/entity/cloud.js',
                    'js/app/entity/explosion.js',
                    'js/app/entity/paddle.js',
                    'js/app/entity/particle.js',
                    'js/app/entity/score.js',
                    'js/app/entity/tail.js',
                    'js/app/entity/trampoline.js',
                    'js/app/entity/_.js',
                    // episodes
                    'js/app/episodes/episode.js',
                    'js/app/episodes/pegasus/blocks.js',
                    'js/app/episodes/pegasus/bonuses.js',
                    'js/app/episodes/pegasus/levels.js',
                    'js/app/episodes/pegasus/manifest.js',
                    'js/app/episodes/pegasus/resources.js',
                    'js/app/episodes/pegasus/splash-screen.js',
                    'js/app/episodes/space/blocks.js',
                    'js/app/episodes/space/bonuses.js',
                    'js/app/episodes/space/levels.js',
                    'js/app/episodes/space/manifest.js',
                    'js/app/episodes/space/resources.js',
                    'js/app/episodes/space/splash-screen.js',
                    'js/app/episodes/_.js',
                    // i18
                    'js/app/i18/languages/en-us.js',
                    'js/app/i18/languages/pl.js',
                    'js/app/i18/i18.js',
                    'js/app/i18/_.js',
                    // input
                    'js/app/input/keyboard.js',
                    'js/app/input/pointer.js',
                    'js/app/input/_.js',
                    // window
                    'js/app/window/_base.js',
                    'js/app/window/alert.js',
                    'js/app/window/auth.js',
                    'js/app/window/confirm.js',
                    'js/app/window/episode-win.js',
                    'js/app/window/first-time.js',
                    'js/app/window/games.js',
                    'js/app/window/help.js',
                    'js/app/window/options.js',
                    'js/app/window/orientation-indicator.js',
                    'js/app/window/preloader-indicator.js',
                    'js/app/window/round-win.js',
                    'js/app/window/rounds.js',
                    'js/app/window/_.js',
                    // game
                    'js/app/dashboard.js',
                    'js/app/facade.js',
                    'js/app/game-options.js',
                    'js/app/game.js',
                    'js/app/indicator.js',
                    'js/app/levels-editor.js',
                    'js/app/levels.js',
                    'js/app/player.js',
                    'js/app/preloader.js',
                    'js/app/sound.js',
                    'js/app/stage.js',
                    'js/app/_.js'
                ],
                dest: 'dist/output.concat.js'
            }
        },
        uglify: {
            options: {
                banner: banner
            },
            'output': {
                files: {
                    'dist/output.min.js': ['<banner>', '<%= concat.output.dest %>']
                }
            }
        },
        clean: {
            build: {
                src: [
                    "dist/output.concat.js"
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'index.html': 'index_dev.html',
                    'levels-editor.html': 'levels-editor_dev.html'
                }
          }
        },
        cssmin: {
            add_banner: {
                options: {
                    banner: banner
                },
                files: {
                    'dist/fonts.css': ['css/fonts.css'],
                    'dist/fonts-chrome.css': ['css/fonts-chrome.css'],
                    'dist/common.css': ['css/gumby.css', 'css/common.css', 'css/import.css'],
                    'dist/1280.css': ['css/1280.css'],
                    'dist/1280-wide.css': ['css/1280-wide.css'],
                    'dist/1024.css': ['css/1024.css'],
                    'dist/1024-wide.css': ['css/1024-wide.css'],
                    'dist/800.css': ['css/800.css'],
                    'dist/800-wide.css': ['css/800-wide.css'],
                    'dist/640.css': ['css/640.css'],
                    'dist/640-wide.css': ['css/640-wide.css'],
                    'dist/480.css': ['css/480.css'],
                    'dist/iphone5-landscape.css': ['css/iphone5-landscape.css'],
                    'dist/iphone5-portrait.css': ['css/iphone5-portrait.css'],
                    'dist/ipad.css': ['css/ipad.css'],
                    'dist/ipad-retina.css': ['css/ipad-retina.css'],
                    'dist/levels-editor.css': ['css/levels-editor.css']
                }
            }
        },
        processhtml: {
            dist: {
                options: {
                    process: true
                },
                files: {
                    'index.html': 'index_dev.html',
                    'levels-editor.html': 'levels-editor_dev.html'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-processhtml');


    grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'cssmin', 'processhtml', 'clean']);
};