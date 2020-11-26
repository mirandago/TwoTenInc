const DEFAULT_TIMERL = 25;
const DEFAULT_BREAKL = 5;
const DEFAULT_SULB = 4;
const DEFAULT_LONGBREAKL = 15;

function getSettings(callBackFunction) {
    chrome.storage.local.get(['timerSetting'], function(result) {
        // if undefined or empty, set default values
        if (result.timerSetting === undefined) {
            console.log("undefined");
            var values = {
                'timerL': DEFAULT_TIMERL,
                'breakL': DEFAULT_BREAKL,
                'SULB': DEFAULT_SULB,
                'longbreakL': DEFAULT_LONGBREAKL
            }
            setSettings(values);
            callBackFunction(values);
            //return values;
        }
        console.log('value is this ' + result.timerSetting.timerL);
        callBackFunction(result.timerSetting);
        //return result.timerSetting;
    })
}

function setSettings(values) {
    // values should be checked to be a number already
    var newSettings = {
        'timerL': values.timerL,
        'breakL': values.breakL,
        'SULB': values.SULB,
        'longbreakL': values.longbreakL
    }
    chrome.storage.local.set({'timerSetting': newSettings, function() {
        console.log("new settings!");
    }});
}