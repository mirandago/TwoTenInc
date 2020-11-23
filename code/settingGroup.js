'use strict';

/**
 * Go to the timer settings page
 */
function settingTimer() {
  location.href = 'settingTimer.html';
}

/**
 * Go to the audio settings page
 */
function settingAudio() {
  location.href = 'settingAudio.html';
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('settingTimer').onclick = settingTimer;
  document.getElementById('settingAudio').onclick = settingAudio;
});
