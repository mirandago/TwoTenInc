'use strict';

/**
 * Go to the timer settings page
 */
function settingTimer() {
  location.href = 'settingTimer.html';
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
  chrome.windows.getLastFocused(
    function(currentWindow) {
        chrome.windows.update(currentWindow.id, { height: 775, width: 800 });
  });
}

// add click event listener to bell icon
// add change event listener to checkboxes and set notification 'status'
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('settingTimer').onclick = settingTimer;
  document.getElementById('settingGroup').onclick = settingGroup;
  document.getElementById('mainPage').onclick = mainPage;

  const _selector1 = document.querySelector('input[type=checkbox]#timer');

  chrome.storage.local.get(['focus_audio'], function(result) {
    if (result.focus_audio === 'on' || result.focus_audio === undefined) {
      _selector1.checked = true;
    }
    // console.log('focus_audio is currently is ' + result.focus_audio);
  });

  _selector1.addEventListener('change', function(event) {
    if (_selector1.checked) {
      chrome.storage.local.set({'focus_audio': 'on'});
    } else {
      chrome.storage.local.set({'focus_audio': 'off'});
    }
  });

  const _selector2 = document.querySelector('input[type=checkbox]#break');

  chrome.storage.local.get(['break_audio'], function(result) {
    if (result.break_audio === 'on' || result.break_audio === undefined) {
      _selector2.checked = true;
    }
    // console.log('break_audio is currently is ' + result.break_audio);
  });

  _selector2.addEventListener('change', function(event) {
    if (_selector2.checked) {
      chrome.storage.local.set({'break_audio': 'on'});
    } else {
      chrome.storage.local.set({'break_audio': 'off'});
    }
  });
});
