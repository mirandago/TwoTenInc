'use strict';

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

function submitSetting() {
  var values = {};
  // do some checking here
  var timerL = document.getElementById('timerL').value;
  console.log('timer value ' + timerL);
  values.timerL = timerL;

  var breakL = document.getElementById('breakL').value;
  console.log('break value ' + breakL);
  values.breakL = breakL;

  var SULB = document.getElementById('SULB').value;
  console.log('sessions value ' + SULB);
  values.SULB = SULB;

  var longbreakL = document.getElementById('longbreakL').value;
  console.log('long break value ' + longbreakL);
  values.longbreakL = longbreakL;

  if (checkInputs(values)) {
    console.log("passed!");
    setSettings(values);
    // submit here
  } 
}

function checkInputs(values) {
  var v = values.timerL
  if (isNaN(v) || v === '' || v === undefined) {
    showError();
    return false;
  } 
  v = values.breakL
  if (isNaN(v) || v === '' || v === undefined) {
    showError();
    return false;
  } 
  v = values.SULB
  if (isNaN(v) || v === '' || v === undefined) {
    showError();
    return false;
  } 
  v = values.longbreakL
  if (isNaN(v) || v === '' || v === undefined) {
    showError();
    return false;
  } 
  // values pass check
  hideError();
  return true;
}

function showError() {
  document.getElementById('errorMessage').style.visibility = 'visible';
}

function hideError() {
  document.getElementById('errorMessage').style.visibility = 'hidden';
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('settingGroup').onclick = settingGroup;
  document.getElementById('settingAudio').onclick = settingAudio;
  document.getElementById('submitChanges').onclick = submitSetting;
  getSettings(showSettings);
  //console.log("what is obj" + obj);
  // display the values 
});

function showSettings(values) {
  document.getElementById('timerL').value = values.timerL;
  document.getElementById('breakL').value = values.breakL;
  document.getElementById('SULB').value = values.SULB;
  document.getElementById('longbreakL').value = values.longbreakL;
}
