
define('app/input/_', [
    'app/input/keyboard',
    'app/input/pointer'
], 
function(keyboard, pointer) {

    return {
        keyboard: keyboard,
        pointer: pointer
    };
});