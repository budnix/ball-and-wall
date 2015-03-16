
define('app/core/helper/font', 
[
    'app/core/helper/browser'
], 
function(helperBrowser) {
    return {
        /**
         * @method injectDefault
         */
        injectDefault: function() {
            var fontsCss = 'fonts.css',
                link = document.createElement('link');

            if ( helperBrowser.platform.name == 'win' && helperBrowser.name == 'chrome' ) {
               fontsCss = 'fonts-chrome.css';
            }
            link.rel = 'stylesheet';

            link.href = SS + (ENV == 'prod' ? 'dist/' : 'css/') + fontsCss + REVISION;
            link.type = 'text/css';
            link.media = 'screen';
            $(document.head).append(link);
        }
    };
});