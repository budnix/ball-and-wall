
define('app/episodes/space/blocks', 
[
    'app/core/helper/app'
], 
function(helperApp) {
    return function () {
        var r = helperApp.pixelRatio();
        
        return [
            { // 0
                texture: '100-black', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 1
                texture: '101-gray', 
                animation: {
                    delay: 6500,
                    frames: {
                        width: 38 * r,
                        height: 21 * r,
                        count: 21
                    },
                    animations: {loop: [0, 16, false, 4]}
                },
                color: '#000000', 
                collidable: true,
                destroyable: false,
                hardness: 1,
                bonusable: true,
                primary: false,
                score: 0
            },
            { // 2
                texture: '103-light-gray', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 3
                texture: '104-white', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 4
                texture: '200-yellow', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 5
                texture: '201-dark-yellow', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 6
                texture: '202-spring-orange', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 7
                texture: '203-orange', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 8
                texture: '205-red', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 9
                texture: '206-carmin', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 10
                texture: '300-light-yellow', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 11
                texture: '301-crazy-green', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 12
                texture: '302-yellow-mint', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 13
                texture: '303-mint', 
                color: '#000000',
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 14
                texture: '304-green', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 15
                texture: '305-dark-green', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 16
                texture: '306-black-green', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 17
                texture: '400-light-blue', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 18
                texture: '401-light-blue', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 3,
                bonusable: true,
                primary: true,
                score: 30
            },
            { // 19
                texture: '402-blue', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 2,
                bonusable: true,
                primary: true,
                score: 20
            },
            { // 20
                texture: '403-dos', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 21
                texture: '404-dark-dos', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 22
                texture: '500-apink', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 23
                texture: '501-light-pink', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 24
                texture: '502-pink', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 25
                texture: '503-violet', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 26
                texture: '504-dark-violet', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 27
                texture: '600-red-blood', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 28
                texture: '601-light-brown', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 29
                texture: '602-brown', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 30
                texture: '603-dark-brown', 
                color: '#000000', 
                collidable: true,
                destroyable: true,
                hardness: 1,
                bonusable: true,
                primary: true,
                score: 10
            },
            { // 31
                entity: 'black-hole/spinning', 
                color: '#fff', 
                collidable: false,
                hardness: 0,
                bonusable: false,
                primary: false,
                availability: 15
            },
            { // 32
                entity: 'black-hole/unstable', 
                color: '#fff', 
                collidable: false,
                hardness: 0,
                bonusable: false,
                primary: false,
                availability: 10
            }
        ];
    };
});