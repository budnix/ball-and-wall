
define('app/episodes/pegasus/manifest', 
[
    'app/core/_'
], 
function(core) {

    return function() {
        return {
            splashscreen: false,
            ball: {
                tail: false,
                explosion: false
            },
            paddle: {
                bullet_rate_timeout: 250,
                left_barrel_rel_pos: {
                    x: 4,
                    y: -5
                },
                right_barrel_rel_pos: {
                    x: -4,
                    y: -5
                },
                left_bullet_rel_pos: {
                    x: 10,
                    y: -2
                },
                right_bullet_rel_pos: {
                    x: -4,
                    y: -2
                },
                sizes: {
                    shrink: 2.2,
                    normal: 4.2,
                    grow: 12.2
                }
            },
            grid: {
                width: 21,
                height: 11
            },
            cell: {
                width: 38,
                height: 38
            },
            bonus: {
                animation: 'stright',
                rotate_speed: 1
            },
            bonus_catch_label: {
                animation: 'up-rotated',
                font: '20px \'Orion-Pax\', sans-serif',
                color: '#3c1e00'
            },
            facade: {
                background_alpha: 0.99,
                background_color: '#fff',
                background_src: 'c-facade-bg',
                text_style: '37px \'Quantico\', sans-serif',
                text_color: '#582c00',
                shadow_color: '#3c1e00'
            },
            dashboard: {
                width: 798,
                height: 55,
                buttons: [
                    {type: 'Bitmap', x: 5, y: 5, args: 'c-btn-user', event: 'clickUser'},
                    {type: 'Bitmap', x: 52, y: 5, args: 'c-btn-play', event: 'clickPlay'},
                    {type: 'Bitmap', x: 99, y: 5, args: 'c-btn-options', event: 'clickOptions'},
                    {type: 'Bitmap', x: 146, y: 5, args: 'c-btn-help', event: 'clickHelp'},
                    {type: 'Bitmap', x: 386, y: 5, args: 'c-dashboard-speed-icon'}
                ],
                auth: {
                    x: 99,
                    y: 338,
                    textAlign: 'center'
                },
                lives: {
                    type: 'text',
                    x: 616,
                    y: core.helperBrowser.name == 'firefox' ? 19 : 13,
                    textAlign: 'center',
                    font: '20px \'Quantico\', sans-serif',
                    color: '#ffcc00'
                },
                round: {
                    textPattern: '{current}/{max}',
                    x: 0,
                    y: 200,
                    textAlign: 'right',
                    font: '20px \'Quantico\', sans-serif',
                    color: '#ffcc00'
                },
                score: {
                    x: 728,
                    y: core.helperBrowser.name == 'firefox' ? 19 : 13,
                    textAlign: 'center',
                    font: '20px \'Quantico\', sans-serif',
                    color: '#ffcc00'
                },
                speed: {
                    type: 'progress',
                    x: 288,
                    y: 14
                },
                time: {
                    textPattern: '{h}:{m}:{s}',
                    x: 490,
                    y: core.helperBrowser.name == 'firefox' ? 19 : 13,
                    textAlign: 'center',
                    font: '20px \'Quantico\', sans-serif',
                    color: '#ffcc00'
                }
            }
        };
    };
});