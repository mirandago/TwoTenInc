const DEFAULT_FOCUS_TEXT = 'Focus';
const DEFAULT_BREAK_TEXT = 'Break';

/**
 * Displays and updates the UI of the popup page
 */
class TimerDisplay {
  /**
   * Constructor for Timer Display. Saves the id for individual UI
   * elements
   * @param {*} timerId
   * @param {*} playId
   * @param {*} pauseId
   * @param {*} stateTextId
   * @param {*} stateContainerId
   * @param {*} completeId
   */
  constructor(timerId, playId, pauseId, stateTextId, stateContainerId,
      completeId) {
    this.timerId = timerId;
    this.playId = playId;
    this.pauseId = pauseId;
    this.stateTextId = stateTextId;
    this.stateContainerId = stateContainerId;
    this.completeId = completeId;
  }

  /**
   * Convert seconds left to timer format
   * @param {String} seconds
   * @return {String} formated time string
   */
  formatTime(seconds) {
    const mins = Math.trunc(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + ('0' + secs).slice(-2);
  }

  /**
   * Update timer display based on the timer argument passed in
   * @param {*} timer
   */
  updateTimerDisplay(timer) {
    document.getElementById(this.timerId).innerText =
        this.formatTime(timer.timeLeft);
    if (timer.isActive) {
      document.getElementById(this.playId).style.display = 'none';
      document.getElementById(this.pauseId).style.display = 'block';
    } else {
      document.getElementById(this.playId).style.display = 'block';
      document.getElementById(this.pauseId).style.display = 'none';
    }
    if (timer.currentTask === '') {
      document.getElementById(this.completeId).style.display = 'none';
    } else {
      document.getElementById(this.completeId).style.display = 'block';
    }
    if (timer.isFocus) {
      if (timer.currentTask !== '') {
        document.getElementById(this.stateTextId).innerText = timer.currentTask;
      } else {
        document.getElementById(this.stateTextId).innerText =
          DEFAULT_FOCUS_TEXT;
      }
      document.getElementById(this.stateContainerId).style.backgroundColor =
        'powderblue';
    } else {
      document.getElementById(this.stateTextId).innerText = DEFAULT_BREAK_TEXT;
      document.getElementById(this.stateContainerId).style.backgroundColor =
        'lightGreen';
    }
  }
}

// timer dsiplay variable
const timerDisplay = new TimerDisplay('timer', 'play_img', 'pause_img',
    'timer_state', 'roundCorners', 'complete_img');

// Every 500 millisecond the timer UI will update
getTimer = setInterval(() => {
  chrome.runtime.sendMessage({cmd: 'GET_TIMER'}, (response) => {
    timerDisplay.updateTimerDisplay(response);
  });
}, 500);

// Load the state of the timer as soon as the Dom loads
window.addEventListener('DOMContentLoaded', (event) => {
  chrome.runtime.sendMessage({cmd: 'GET_TIMER'}, (response) => {
    timerDisplay.updateTimerDisplay(response);
  });
});

// Button click event listeners
document.getElementById('play_img').addEventListener('click', function() {
  chrome.runtime.sendMessage({cmd: 'START_TIMER'});
});

document.getElementById('pause_img').addEventListener('click', function() {
  chrome.runtime.sendMessage({cmd: 'PAUSE_TIMER'});
});

document.getElementById('reset_img').addEventListener('click', function() {
  chrome.runtime.sendMessage({cmd: 'RESET_TIMER'});
});

document.getElementById('complete_img').addEventListener('click', function() {
  chrome.runtime.sendMessage({cmd: 'COMPLETE_TASK'});
});

document.getElementById('expand_img').addEventListener('click', function() {
  window.self.close();
  chrome.windows.create({url: 'mainPage.html', type: 'popup', height: 500,
    width: 500});
});

/* eslint-disable */
/**
 * function to call in the console to skip time to 5 seconds
 */
function skipTime() {
  chrome.runtime.sendMessage({cmd: 'SET_TIME', timeLeft: '5'});
};
/* eslint-enable */
