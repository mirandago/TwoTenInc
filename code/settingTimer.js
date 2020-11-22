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

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('settingGroup').onclick = settingGroup;
  document.getElementById('settingAudio').onclick = settingAudio;
});
