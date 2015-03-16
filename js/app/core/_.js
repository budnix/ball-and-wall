
define('app/core/_', [
    'app/core/helper/ads',
    'app/core/helper/app',
    'app/core/helper/browser',
    'app/core/helper/font',
    'app/core/helper/fullscreen',
    'app/core/helper/share',
    'app/core/storage/global',
    'app/core/storage/local',
    'app/core/utils/number',
    'app/core/utils/string',
    'app/core/builder',
    'app/core/fast-click',
    'app/core/event-emitter',
    'app/core/math',
    'app/core/mediator',
    'app/core/tab'
], 
function(helperAds, helperApp, helperBrowser, helperFont, helperFullscreen, helperShare, storageGlobal,
         StorageLocal, utilsNumber, utilsString, Builder, fastClick, EventEmitter, math, mediator, Tab) {

    return {
        helperAds: helperAds,
        helperApp: helperApp,
        helperBrowser: helperBrowser,
        helperFont: helperFont,
        helperFullscreen: helperFullscreen,
        helperShare: helperShare,
        storageGlobal: storageGlobal,
        StorageLocal: StorageLocal,
        utilsNumber: utilsNumber,
        utilsString: utilsString,
        Builder: Builder,
        fastClick: fastClick,
        EventEmitter: EventEmitter,
        math: math,
        mediator: mediator,
        Tab: Tab
    };
});