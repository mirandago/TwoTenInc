'use strict';

/**
 * execute when bell icon is clicked
 */
function click() {
  document.body.style.backgroundColor='pink';
}

// add click event listener to bell icon
// add change event listener to checkboxes and set notification 'status'
document.addEventListener('DOMContentLoaded', function() {
  const divs = document.querySelectorAll('button');
  for (let i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
  const _selector1 = document.querySelector('input[type=checkbox]#timer');

  chrome.storage.sync.get(['focus_audio'], function(result) {
    if (result.focus_audio === 'on' || result.focus_audio === undefined) {
      _selector1.checked = true;
    }
    console.log('focus_audio is currently is ' + result.focus_audio);
  });

  _selector1.addEventListener('change', function(event) {
    if (_selector1.checked) {
      chrome.storage.sync.set({'focus_audio': 'on'});
      document.body.style.backgroundColor='red';
    } else {
      chrome.storage.sync.set({'focus_audio': 'off'});
      document.body.style.backgroundColor='green';
    }
  });

  const _selector2 = document.querySelector('input[type=checkbox]#break');

  chrome.storage.sync.get(['break_audio'], function(result) {
    if (result.break_audio === 'on' || result.focus_audio === undefined) {
      _selector2.checked = true;
    }
    console.log('break_audio is currently is ' + result.break_audio);
  });

  _selector2.addEventListener('change', function(event) {
    if (_selector2.checked) {
      chrome.storage.sync.set({'break_audio': 'on'});
      document.body.style.backgroundColor='blue';
    } else {
      chrome.storage.sync.set({'break_audio': 'off'});
      document.body.style.backgroundColor='orange';
    }
  });
});
