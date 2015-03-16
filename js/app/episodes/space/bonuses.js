
define('app/episodes/space/bonuses', 
[
    
], 
function() {
    return function() {
        return [
            { // 0
                name: '3-balls', 
                color: '#000000',
                score: 5,
                create_rate: 3
            },
            { // 1
                name: 'big-ball', 
                color: '#000000',
                score: 5,
                create_rate: 3
            },
            { // 2
                name: 'die', 
                color: '#000000',
                score: -5,
                create_rate: 15
            },
            { // 3
                name: 'extra-life', 
                color: '#000000',
                create_rate: 12,
                score: 5,
                max_incidence: 1
            },
            { // 4
                name: 'glue-paddle', 
                color: '#000000',
                score: 5,
                create_rate: 3
            },
            { // 5
                name: 'grow-paddle', 
                color: '#000000',
                score: 5,
                create_rate: 2
            },
            { // 6
                name: 'shrink-paddle', 
                color: '#000000',
                score: -5,
                create_rate: 2
            },
            { // 7
                name: 'score', 
                color: '#000000',
                score: 10,
                create_rate: 2
            },
            { // 8
                name: 'score', 
                color: '#000000',
                score: 50,
                create_rate: 3
            },
            { // 9
                name: 'score', 
                color: '#000000',
                score: 100,
                create_rate: 4
            },
            { // 10
                name: 'small-ball', 
                color: '#000000',
                score: -5,
                create_rate: 2
            },
            { // 11
                name: 'steel-ball', 
                color: '#000000',
                score: 5,
                create_rate: 8,
                max_incidence: 2
            },
            { // 12
                name: 'laser', 
                color: '#000000',
                score: 5,
                create_rate: 6,
                max_incidence: 2
            }
        ];
    };
});