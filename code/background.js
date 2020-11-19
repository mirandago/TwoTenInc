// Keeps running in the background

// timer variables to keep track off
let timeLeft;
let runningCall;
let isFocus;
let isActive;
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
      timeLeft = DEFAULT_FOCUS_TIME;
      isFocus = DEFAULT_FOCUS;
    }

    // runs every second
    // 2 cases: timer hits 0, decrement counter
    runningCall = setInterval(() => {
      // time hits 0, play sound and update state
      if (timeLeft == 0) {
        if (isFocus) {
          const myAudio = new Audio(chrome.runtime.getURL('audio/break.mp3'));
          myAudio.play();
        } else {
          const myAudio = new Audio(chrome.runtime.getURL('audio/focus.mp3'));
          myAudio.play();
        }
        if (isFocus) {
          isFocus = false;
          timeLeft = DEFAULT_BREAK_TIME;
        } else {
          isFocus = true;
          timeLeft = DEFAULT_FOCUS_TIME;
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
    timeLeft = DEFAULT_FOCUS_TIME;
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
    if (timeLeft === undefined) {
      timeLeft = DEFAULT_FOCUS_TIME;
      isFocus = DEFAULT_FOCUS;
      isActive = DEFAULT_ACTIVE;
    }
    sendResponse({
      timeLeft: timeLeft,
      isActive: isActive,
      isFocus: isFocus,
      // currentTask: currentTask
    });
  }
  return true;
});
