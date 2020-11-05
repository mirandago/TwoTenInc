'use strict';

// Doesnt get the stored value at the beginning.
chrome.storage.sync.get(['counter'], function(result) {
  if (!result) {
    document.getElementById("counter").innerText = result.counter;
  }
  else {
    document.getElementById("counter").innerText = "this empty";
  }
  console.log('Value currently is ' + result.counter);
});

// show the current stored value
function buttonClick(e) {
  chrome.storage.sync.get(['counter'], function(result) {
    document.getElementById("counter").innerText = result.counter;
    console.log('Value currently is ' + result.counter);
  });
}

// set stored value to 0
function setClick(e) {
  var theValue = 0;
  chrome.storage.sync.set({'counter': theValue}, function() {
    console.log('Value is set to ' + theValue);
    document.getElementById("counter").innerText = theValue;
  });

}

// increment storage value
function incrementClick(e) {
  chrome.storage.sync.get(['counter'], function(result) {
    if (!result) {
      document.getElementById("counter").innerText = result.counter;
    }
    else {
      var incValue = result.counter + 1;
      chrome.storage.sync.set({'counter': incValue}, function() {
        console.log('Value is set to ' + incValue);
        document.getElementById("counter").innerText = incValue;
      });
    }
  });
}

// Add click event listeners
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("demo").addEventListener("click", buttonClick);
  document.getElementById("set").addEventListener("click", setClick);
  document.getElementById("increment").addEventListener("click", incrementClick);
});