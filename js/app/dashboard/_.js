
define('app/dashboard/_', [
    'app/dashboard/_base',
    'app/dashboard/auth',
    'app/dashboard/lives',
    'app/dashboard/round',
    'app/dashboard/score',
    'app/dashboard/speed',
    'app/dashboard/time'
], 
function(Base, Auth, Lives, Round, Score, Speed, Time) {

    return {
        Base: Base,
        Auth: Auth,
        Lives: Lives,
        Round: Round,
        Score: Score,
        Speed: Speed,
        Time: Time
    };
});