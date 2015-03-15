
define('app/episodes/pegasus/blocks', 
[
    
], 
function() {

    return function() {
        return [
            { // 0
                texture: 'grass-both-side', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 1
                texture: 'grass-corner-top-left', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 2
                texture: 'grass-corner-top-right', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 3
                texture: 'grass-left', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 4
                texture: 'grass-left-right', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 5
                texture: 'grass-left-side', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 6
                texture: 'grass-left-small', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 7
                texture: 'grass-right', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 8
                texture: 'grass-right-side', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 9
                texture: 'grass-right-small', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 10
                texture: 'grass-top', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 11
                texture: 'ground', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 12
                texture: 'box', 
                color: '#000000', 
                collidable: true,
                destroyable: false
            },
            { // 13
                texture: 'coin', 
                animation: {
                    delay: 1000,
                    frames: {
                        width: 38,
                        height: 38,
                        count: 5
                    },
                    animations: {loop: [0, 4, false, 8]}
                },
                sound: 'coin-hit',
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 0,
                bonusable: false,
                primary: false,
                score: 50,
                animateScore: true
            },
            { // 14
                entity: 'black-hole/spinning', 
                color: '#000', 
                collidable: false,
                hardness: 0,
                bonusable: false,
                primary: false,
                availability: 15
            },
            { // 15
                entity: 'black-hole/unstable', 
                color: '#000', 
                collidable: false,
                hardness: 0,
                bonusable: false,
                primary: false,
                availability: 10
            },
            { // 16
                entity: 'trampoline', 
                color: '#000', 
                collidable: true,
                destroyable: false,
                availability: 20
            }
        ];
    };
});