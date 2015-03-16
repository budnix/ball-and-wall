
define('app/entity/_', [
    'app/entity/_base',
    'app/entity/ball',
    'app/entity/block/block',
    'app/entity/block/black-hole/_base',
    'app/entity/block/black-hole/spinning',
    'app/entity/block/black-hole/unstable',
    'app/entity/block/trampoline',
    'app/entity/bonus',
    'app/entity/bullet',
    'app/entity/cloud',
    'app/entity/explosion',
    'app/entity/paddle',
    'app/entity/particle',
    'app/entity/score',
    'app/entity/tail'
], 
function(Base, ball, block, BlackHole, blackHoleSpinning, blackHoleUnstable, trampoline, bonus, bullet, cloud, explosion, paddle, 
         particle, score, tail) {

    return {
        Base: Base,
        ball: ball,
        block: block,
        BlackHole: BlackHole,
        blackHoleSpinning: blackHoleSpinning,
        blackHoleUnstable: blackHoleUnstable,
        trampoline: trampoline,
        bonus: bonus,
        bullet: bullet,
        cloud: cloud,
        explosion: explosion,
        paddle: paddle,
        particle: particle,
        score: score,
        tail: tail
    };
});