'use strict';

function settingTimer() {
  location.href = "settingTimer.html"
}

function settingAudio() {
  location.href = "settingAudio.html"
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("settingTimer").onclick = settingTimer;
  document.getElementById("settingAudio").onclick = settingAudio;

});
