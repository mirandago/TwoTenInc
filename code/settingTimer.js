'use strict';

function settingAudio() {
  location.href = "settingAudio.html"
}

function settingGroup() {
  location.href = "settingGroup.html"
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("settingGroup").onclick = settingGroup;
  document.getElementById("settingAudio").onclick = settingAudio;

});
