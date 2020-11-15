// Keeps running in the background

// timer variables to keep track off
var timeLeft;
var runningCall;
var isFocus;
var isActive;
var currentTask;

// constants
var DEFAULT_FOCUS_TIME = 10;
var DEFAULT_BREAK_TIME = 5;
var DEFAULT_FOCUS = true;
var DEFAULT_ACTIVE = false;

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
        if(isFocus) {
            var myAudio = new Audio(chrome.runtime.getURL("audio/break.mp3"));
            myAudio.play();
        } else {
            var myAudio = new Audio(chrome.runtime.getURL("audio/focus.mp3"));
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
  } 

  // pause timer
  else if (request.cmd === 'PAUSE_TIMER') {
    isActive = false;
    clearInterval(this.runningCall);
  }

  // reset timer and the states
  else if (request.cmd === 'RESET_TIMER') {
    timeLeft = DEFAULT_FOCUS_TIME;
    isFocus = DEFAULT_FOCUS;
    isActive = DEFAULT_ACTIVE;
    clearInterval(this.runningCall);
  }

  // set time
  else if (request.cmd === 'SET_TIME') {
    timeLeft = request.timeLeft;
  }

  // get time
  else if (request.cmd === 'GET_TIME') {
    sendResponse({ timeLeft: this.timeLeft});
  }

  // get the timer back including time and state
  else if (request.cmd === 'GET_TIMER') {
    if (timeLeft === undefined) {
      timeLeft = DEFAULT_FOCUS_TIME;
      isFocus = DEFAULT_FOCUS;
      isActive = DEFAULT_ACTIVE;
    }
    sendResponse({ 
      timeLeft: this.timeLeft,
      isActive: this.isActive,
      isFocus: this.isFocus,
      //currentTask: this.currentTask
    });
  }

  return true;
}); 