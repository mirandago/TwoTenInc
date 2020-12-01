// Keeps running in the background

// import the setting storage to use the get settings function
var imported = document.createElement('script');
imported.src = './settingStorage.js';
document.head.appendChild(imported);

// timer variables to keep track off

// time left in seconds
let timeLeft;
// sessions counter
let sessionNum = 0;
// timeout function that is called every second
let runningCall;
// number of sessions until long break;
let sulb;
// length of focus timer
let timerL;
// length of break
let breakL;
// length of long break
let longbreakL;

let isFocus;
let isActive;
const breakAudio = new Audio(chrome.runtime.getURL('audio/break.mp3'));
const focusAudio = new Audio(chrome.runtime.getURL('audio/focus.mp3'));
// let currentTask;

// constants
const DEFAULT_FOCUS_TIME = 10;
const DEFAULT_BREAK_TIME = 5;
const DEFAULT_FOCUS = true;
const DEFAULT_ACTIVE = false;

// listener for run time messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // start timer or continue
  if (request.cmd === 'START_TIMER') {
    isActive = true;
    if (timeLeft === undefined) {
      timeLeft = timerL;
      isFocus = DEFAULT_FOCUS;
    }

    // runs every second
    // 2 cases: timer hits 0, decrement counter
    runningCall = setInterval(() => {
      // time hits 0, play sound and update state
      if (timeLeft == 0) {
        if (isFocus) {
          chrome.storage.local.get(['break_audio'], function(result) {
            if (result.break_audio === undefined) {
              breakAudio.play();
              chrome.storage.local.set({'break_audio': 'on'});
            } else if (result.break_audio === 'on') {
              breakAudio.play();
            }
          });
        } else {
          chrome.storage.local.get(['focus_audio'], function(result) {
            if (result.focus_audio === undefined) {
              focusAudio.play();
              chrome.storage.local.set({'focus_audio': 'on'});
            } else if (result.focus_audio === 'on') {
              focusAudio.play();
            }
          });
        }
        if (isFocus) {
          sessionNum++;
          if (sessionNum % sulb === 0) {
            timeLeft = longbreakL;
          } else {
            timeLeft = breakL;
          }
          isFocus = false;
        } else {
          timeLeft = timerL;
          isFocus = true;
        }
      } else {
        timeLeft--;
      }
    }, 1000);
  } else if (request.cmd === 'PAUSE_TIMER') {
    // pause timer
    isActive = false;
    clearInterval(runningCall);
  } else if (request.cmd === 'RESET_TIMER') {
    // reset timer and the states
    sessionNum = 0;
    timeLeft = timerL;
    isFocus = DEFAULT_FOCUS;
    isActive = DEFAULT_ACTIVE;
    clearInterval(runningCall);
  } else if (request.cmd === 'SET_TIME') {
    // set time
    timeLeft = request.timeLeft;
  } else if (request.cmd === 'GET_TIME') {
    // get time
    sendResponse({timeLeft: timeLeft});
  } else if (request.cmd === 'GET_TIMER') {
    // get the timer back including time and state
    // if it is undefined, call the storage and get back stuff
    if (timeLeft === undefined) {
      // may be a bit delayed until we get the settings back
      getSettings(setupStorageSettings);
      timeLeft = 0;
      isFocus = DEFAULT_FOCUS;
      isActive = DEFAULT_ACTIVE;
    }
    sendResponse({
      timeLeft: timeLeft,
      isActive: isActive,
      isFocus: isFocus,
      // currentTask: currentTask
    });
  } else if (request.cmd === 'SET_SETTINGS') {
    sessionNum = 0;
    console.log("what is timeL " + request.settings.timerL);
    timerL = request.settings.timerL;
    breakL = request.settings.breakL;
    sulb = request.settings.SULB;
    longbreakL = request.settings.longbreakL;
  }
  return true;
});

/**
 * Fresh start, does this as soon as storage returns
 * @param {Object} value 
 */
function setupStorageSettings(value) {
  timerL = value.timerL;
  breakL = value.breakL;
  sulb = value.SULB;
  longbreakL = value.longbreakL;
  timeLeft = value.timerL;
}