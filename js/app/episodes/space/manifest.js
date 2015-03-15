
define('app/episodes/space/manifest', 
[
    'app/i18/_', 'app/core/_'
], 
function(i18, core) {
    return function() {
        var r = core.helperApp.pixelRatio();
        
        return {
            splashscreen: true,
            ball: {
                tail: true,
                explosion: true
            },
            paddle: {
                bullet_rate_timeout: 250,
                left_barrel_rel_pos: {
                    x: -6,
                    y: -5
                },
                right_barrel_rel_pos: {
                    x: 6,
                    y: -5
                },
                left_bullet_rel_pos: {
                    x: r >= 2 ? 24 : 9,
                    y: 0
                },
                right_bullet_rel_pos: {
                    x: r >= 2 ? 1 : 3,
                    y: 0
                },
                sizes: {
                    shrink: 3,
                    normal: 8,
                    grow: 18
                }
            },
            grid: {
                width: 21,
                height: 19
            },
            cell: {
                width: 38,
                height: 21
            },
            bonus: {
                animation: 'random_direction',
                rotate_speed: 0
            },
            bonus_catch_label: {
                animation: 'up',
                font: (20 * r) +  'px \'Orion-Pax\', sans-serif',
                color: '#ffd700'
            },
            facade: {
                background_alpha: 0.6,
                background_color: '#000',
                background_src: null,
                text_style: (37 * r) +  'px \'Quantico\', sans-serif',
                text_color: '#e0e396',
                shadow_color: '#fff'
            },
            dashboard: {
                width: 417,
                height: 214,
                buttons: [
                    {type: 'Bitmap', x: 12 * r, y: 113 * r, args: 'c-btn-user', event: 'clickUser'},
                    {type: 'Bitmap', x: 21 * r, y: 144 * r, args: 'c-btn-play', event: 'clickPlay'},
                    {type: 'Bitmap', x: 45 * r, y: 169 * r, args: 'c-btn-options', event: 'clickOptions'},
                    {type: 'Bitmap', x: 73 * r, y: 184 * r, args: 'c-btn-help', event: 'clickHelp'},
                    {type: 'Text', x: 223 * r, y: core.helperBrowser.name == 'firefox' ? (core.helperBrowser.platform.name == 'win' ? 42 : 48) : (46 * r), 
                        args: [i18._('round') + ':', (15 * r) +  'px \'Orion-Pax\', sans-serif', '#ccc'], textAlign: 'left'}
                ],
                auth: {
                    x: 99 * r,
                    y: 338 * r,
                    textAlign: 'center'
                },
                lives: {
                    type: 'bitmap',
                    x: 370 * r,
                    y: 21 * r,
                    alpha: 0.8
                },
                round: {
                    textPattern: '{current}/{max}',
                    x: 373 * r,
                    y: core.helperBrowser.name == 'firefox' ? (core.helperBrowser.platform.name == 'win' ? 42 : 48) : (46 * r),
                    textAlign: 'right',
                    font: (15 * r) +  'px \'Orion-Pax\', sans-serif',
                    color: '#ccc'
                },
                score: {
                    x: 115 * r,
                    y: core.helperBrowser.name == 'firefox' ? (core.helperBrowser.platform.name == 'win' ? 85 : 93) : (91 * r),
                    textAlign: 'center',
                    font: (20 * r) +  'px \'Orion-Pax\', sans-serif',
                    color: '#51f2f1'
                },
                speed: {
                    type: 'rotate',
                    x: 108 * r,
                    y: 40 * r
                },
                time: {
                    textPattern: '{h} : {m} : {s}',
                    x: 383 * r,
                    y: core.helperBrowser.name == 'firefox' ? (core.helperBrowser.platform.name == 'win' ? 91 : 84) : (92 * r),
                    textAlign: 'right',
                    font: (29 * r) +  'px \'segmentled\', sans-serif',
                    color: '#51f2f1'
                }
            }
        };
    };
});