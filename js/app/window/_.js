
define('app/window/_', [
    'app/window/_base',
    'app/window/alert',
    'app/window/auth',
    'app/window/confirm',
    'app/window/episode-win',
    'app/window/first-time',
    'app/window/games',
    'app/window/help',
    'app/window/options',
    'app/window/orientation-indicator',
    'app/window/preloader-indicator',
    'app/window/rounds',
    'app/window/round-win'
], 
function(Base, Alert, Auth, Confirm, EpisodeWin, FirstTime, Games, Help, Options,
         OrientationIndicator, PreloaderIndicator, Rounds, RoundWin) {

    return {
        Base: Base,
        Alert: Alert,
        Auth: Auth,
        Confirm: Confirm,
        EpisodeWin: EpisodeWin,
        FirstTime: FirstTime,
        Games: Games,
        Help: Help,
        Options: Options,
        OrientationIndicator: OrientationIndicator,
        PreloaderIndicator: PreloaderIndicator,
        Rounds: Rounds,
        RoundWin: RoundWin
    };
});