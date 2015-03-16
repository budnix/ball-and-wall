
define('app/core/helper/share', 
[
    'app/core/utils/string'
], 
function(utilsString) {
    
    var
        /**
         * @property _share
         * @type {Object}
         * @static
         * @protected
         */
        _share = {
            facebook: {
                url: 'http://www.facebook.com/sharer.php?s=100&p[title]={title}' + 
                        '&p[summary]={desc}&p[url]={url}&p[images][0]=' + 
                        'http://static.ballandwall.com/images/icons/icon_128.png', 
                opt: 'width=675,height=400'
            },
            google: {
                url: 'https://plus.google.com/share?url={url}', 
                opt: 'width=600,height=500'
            },
            twitter: {
                url: 'http://twitter.com/intent/tweet?source=sharethiscom&text={title}&url={url}', 
                opt: 'width=600,height=400'
            }
        },
        share;
                    
    share = {
        open: function(target, params) {
            var url, opt;
            
            url = utilsString.substitute(_share[target].url, params);
            opt = _share[target].opt;
            window.open(url, 'Share', 'resizable=yes,scrollbars=no,status=no,' + opt);
        }
    };
    
    return share;
});