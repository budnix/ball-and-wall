
define('app/_', [
    'app/dashboard',
    'app/facade',
    'app/game-options',
    'app/game',
    'app/indicator',
    'app/levels-editor',
    'app/levels',
    'app/player',
    'app/preloader',
    'app/sound',
    'app/stage'
], 
function(dashboard, facade, gameOptions, Game, indicator, LevelsEditor, levels, player, preloader, sound, stage) {

    return {
        dashboard: dashboard,
        facade: facade,
        gameOptions: gameOptions,
        Game: Game,
        indicator: indicator,
        LevelsEditor: LevelsEditor,
        levels: levels,
        player: player,
        preloader: preloader,
        sound: sound,
        stage: stage
    };
});