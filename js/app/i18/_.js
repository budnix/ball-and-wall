
define('app/i18/_', [
    'app/i18/languages/en-us',
    'app/i18/languages/pl',
    'app/i18/i18'
], 
function(enUs, pl, i18) {

    return {
        _: i18._,
        setLanguage: i18.setLanguage,
        getLanguageCode: i18.getLanguageCode,
        getLanguageName: i18.getLanguageName,
        exists: i18.exists
    };
});