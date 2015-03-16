
define('app/episodes/pegasus/bonuses', 
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
                create_rate: 18
            },
            { // 3
                name: 'extra-life', 
                color: '#000000',
                create_rate: 15,
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
                name: 'gun', 
                color: '#000000',
                score: 5,
                create_rate: 10,
                max_incidence: 2
            },
            { // 12
                name: 'earthquake', 
                color: '#000000',
                score: -5,
                create_rate: 10
            },
            { // 13
                name: 'turbulent-ball', 
                color: '#000000',
                score: -5,
                create_rate: 6
            },
            { // 14
                name: 'clouds', 
                color: '#000000',
                score: -5,
                create_rate: 6
            },
            { // 15
                name: 'cpu-paddle', 
                color: '#000000',
                score: 5,
                create_rate: 5
            }
        ];
    };
});