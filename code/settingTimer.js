'use strict';
import {getSettings, setSettings} from './settingStorage.js';
/**
 * Go to the timer settings page
 */
function settingAudio() {
  location.href = 'settingAudio.html';
}

/**
 * Go to the group settings page
 */
function settingGroup() {
  location.href = 'settingGroup.html';
}

/**
 * Go back to the main page
 */
function mainPage() {
  location.href = 'mainPage.html';
}

/**
 * Get the inputs from input fields and saves them to the chrome local
 * storage.
 */
function submitSetting() {
  const values = {};
  const timerL = document.getElementById('timerL').value;
  values.timerL = timerL;

  const breakL = document.getElementById('breakL').value;
  values.breakL = breakL;

  const SULB = document.getElementById('SULB').value;
  values.SULB = SULB;

  const longbreakL = document.getElementById('longbreakL').value;
  values.longbreakL = longbreakL;

  // input validation
  if (checkInputs(values)) {
    setSettings(values);
  }
}

/**
 * Function that does some input validation.
 * Makes sure each value is a number and is not empty/undefined.
 * If validation failed, show error message
 * @param {*} values
 * @return {Bool} Returns true if inputs are valid, else false
 */
function checkInputs(values) {
  let v = values.timerL;
  if (isNaN(v) || v <= 0 || v === '' || v === undefined) {
    showError();
    return false;
  }
  v = values.breakL;
  if (isNaN(v) || v <= 0 || v === '' || v === undefined) {
    showError();
    return false;
  }
  v = values.SULB;
  if (isNaN(v) || v <= 0 || v === '' || v === undefined) {
    showError();
    return false;
  }
  v = values.longbreakL;
  if (isNaN(v) || v <= 0 || v === '' || v === undefined) {
    showError();
    return false;
  }
  // values pass check
  hideError();
  return true;
}

/**
 * function to show the error message for input validation
 */
function showError() {
  document.getElementById('errorMessage').style.visibility = 'visible';
}

/**
 * function to hide the error message
 */
function hideError() {
  document.getElementById('errorMessage').style.visibility = 'hidden';
}

/**
 * Callback function for after getSettings finishes so that the UI elements
 * will show the setting values from the storage
 * @param {*} values
 */
function showSettings(values) {
  document.getElementById('timerL').value = values.timerL;
  document.getElementById('breakL').value = values.breakL;
  document.getElementById('SULB').value = values.SULB;
  document.getElementById('longbreakL').value = values.longbreakL;
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('settingGroup').onclick = settingGroup;
  document.getElementById('settingAudio').onclick = settingAudio;
  document.getElementById('mainPage').onclick = mainPage;
  document.getElementById('submitChanges').onclick = submitSetting;
  // show setting values in UI
  getSettings(showSettings);
});

