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
/* eslint-disable */
// Need to disable because getSettings is used in a different file
function getSettings(callBackFunction) {
/* eslint-enable */
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
function setSettings(values) {
  const newSettings = {
    'timerL': values.timerL,
    'breakL': values.breakL,
    'SULB': values.SULB,
    'longbreakL': values.longbreakL,
  };
  // store in local storage
  chrome.storage.local.set({'timerSetting': newSettings, function() {}});
  // tell background timer new settings
  chrome.runtime.sendMessage(
      {cmd: 'SET_SETTINGS', settings: values},
      (response) => {},
  );
}
