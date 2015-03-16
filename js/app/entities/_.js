
define('app/entities/_', [
    'app/entities/_base',
    'app/entities/balls',
    'app/entities/blocks',
    'app/entities/bonuses',
    'app/entities/bullets',
    'app/entities/clouds',
    'app/entities/paddles',
    'app/entities/scores'
], 
function(Base, balls, blocks, bonuses, bullets, clouds, paddles, scores) {

    return {
        Base: Base,
        balls: balls,
        blocks: blocks,
        bonuses: bonuses,
        bullets: bullets,
        clouds: clouds,
        paddles: paddles,
        scores: scores
    };
});