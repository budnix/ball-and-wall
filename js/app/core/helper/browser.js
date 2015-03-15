
define('app/core/helper/browser', 
[
    
], 
function() {
    
    var d = document, 
        ua = navigator.userAgent.toLowerCase(),
        platform = navigator.platform.toLowerCase(),
        UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0],
        mode = UA[1] == 'ie' && d.documentMode,
        browser;

    browser = {
        name: (UA[1] == 'version') ? UA[3] : UA[1],
        version: mode || parseFloat((UA[1] == 'opera' && UA[4]) ? UA[4] : UA[2], 10),
        platform: {
            name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0],
            iosDevice: ua.match(/ip(?:ad|od|hone)/) ? ua.match(/ip(?:ad|od|hone)/)[0] : null,
            version: {}
        }
    };
    browser.isMobile = ['mac', 'linux', 'win'].indexOf(browser.platform.name) === -1;
    
    if ( browser.platform.name == 'other' && ua.match(/(?:macintosh)/) ) {
        browser.platform.name = 'mac';
    }
    if ( ua.match(/iemobile/) || ua.match(/mobile/i) || ua.match(/NintendoBrowser/i) ) {
        browser.isMobile = true;
    }
    if (ua.match(/msapphost/) ) {
        browser.isMobile = false;
    }
    if ( browser.platform.name == 'android' ) {
        var v = ua.match(/android (\d+)\.(\d+)\.(\d+)/i);
        
        if ( v && v.length == 4 ) {
            browser.platform.version = {
                major: v[1] >> 0,
                minor: v[2] >> 0,
                revision: v[3] >> 0 
            };
        }
    }
    
    return browser;
});