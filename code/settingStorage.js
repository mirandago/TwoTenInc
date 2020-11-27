// constants for default settings
const DEFAULT_TIMERL = 25;
const DEFAULT_BREAKL = 5;
const DEFAULT_SULB = 4;
const DEFAULT_LONGBREAKL = 15;

/**
 * Gets the timer settings from the chrome local storage.
 * The format of the value is the following
 * timerSetting : {
 *      timerL:
 *      breakL:
 *      SULB:
 *      longbreakL:
 * }
 * @param {*} callBackFunction function that takes in the results to show in UI
 */
export function getSettings(callBackFunction) {
  chrome.storage.local.get(['timerSetting'], function(result) {
    // settings is undefined, set values to default
    if (result.timerSetting === undefined) {
      console.log('undefined');
      const values = {
        'timerL': DEFAULT_TIMERL,
        'breakL': DEFAULT_BREAKL,
        'SULB': DEFAULT_SULB,
        'longbreakL': DEFAULT_LONGBREAKL,
      };
      setSettings(values);
      callBackFunction(values);
    } else {
      // has the result
      callBackFunction(result.timerSetting);
    }
  });
}

/**
 * Function to set the settings in the chrome storage.
 * These values passed should already have been input validated.
 * value has the following four fields: timerL, breakL, SULB, longbreakL
 * @param {*} values settings values
 */
export function setSettings(values) {
  const newSettings = {
    'timerL': values.timerL,
    'breakL': values.breakL,
    'SULB': values.SULB,
    'longbreakL': values.longbreakL,
  };
  chrome.storage.local.set({'timerSetting': newSettings, function() {
    // should have a way to contact the background storage
    // to update new settings
    console.log('new settings!');
  }});
}
