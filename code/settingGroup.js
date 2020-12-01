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

/**
 * Go back to the main page
 */
function mainPage() {
  location.href = 'mainPage.html';
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('settingTimer').onclick = settingTimer;
  document.getElementById('settingAudio').onclick = settingAudio;
  document.getElementById('mainPage').onclick = mainPage;
});
