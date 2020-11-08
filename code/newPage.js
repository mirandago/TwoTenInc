'use strict';

// Doesnt get the stored value at the beginning.
// chrome.storage.sync.get(['counter'], function(result) {
//   if (!result) {
//     document.getElementById("counter").innerText = result.counter;
//   }
//   else {
//     document.getElementById("counter").innerText = "this empty";
//   }
//   console.log('Value currently is ' + result.counter);
// });

/**
 * Shows the current stored value
 */
function buttonClick() {
  if (window.localStorage.getItem('runTest')) {
    const testCounter = window.localStorage.getItem('testCounter');
    document.getElementById('counter').innerText = testCounter;
  } else {
    chrome.storage.sync.get(['counter'], function(result) {
      document.getElementById('counter').innerText = result.counter;
      console.log('Value currently is ' + result.counter);
    });
  }
}

/**
 * Sets the stored value to 0
 */
function setClick() {
  const theValue = 0;
  if (window.localStorage.getItem('runTest')) {
    document.getElementById('counter').innerText = theValue;
  } else {
    chrome.storage.sync.set({'counter': theValue}, function() {
      console.log('Value is set to ' + theValue);
      document.getElementById('counter').innerText = theValue;
    });
  }
}

/**
 * Increments the stored value
 */
function incrementClick() {
  if (window.localStorage.getItem('runTest')) {
    const incValue = 1 + parseInt(window.localStorage.getItem('testCounter'));
    document.getElementById('counter').innerText = incValue;
    window.localStorage.setItem('testCounter', incValue);
  } else {
    chrome.storage.sync.get(['counter'], function(result) {
      if (!result) {
        document.getElementById('counter').innerText = result.counter;
      } else {
        const incValue = result.counter + 1;
        chrome.storage.sync.set({'counter': incValue}, function() {
          console.log('Value is set to ' + incValue);
          document.getElementById('counter').innerText = incValue;
        });
      }
    });
  }
}

// Add click event listeners
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('demo').addEventListener('click', buttonClick);
  document.getElementById('set').addEventListener('click', setClick);
  document.getElementById('increment').
      addEventListener('click', incrementClick);
});
