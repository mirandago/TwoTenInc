/**
 * Go to task list page
 */
function viewTaskList() {
  location.href = 'taskList.html';
}

/**
 * Go to settings page
 */
function viewSettings() {
  location.href = 'settingTimer.html';
}

const DEFAULT_FOCUS_TEXT = 'Focus';
const DEFAULT_BREAK_TEXT = 'Break';

/**
 * Displays and updates the UI of the main page
 */
class TimerDisplay {
  /**
   * Constructor for Timer Display. Saves the id for individual UI
   * elements
   * @param {*} timerId
   * @param {*} playId
   * @param {*} pauseId
   * @param {*} stateTextId
   */
  constructor(timerId, playId, pauseId, stateTextId) {
    this.timerId = timerId;
    this.playId = playId;
    this.pauseId = pauseId;
    this.stateTextId = stateTextId;
  }


  /**
   * Update timer display based on the timer argument passed in
   * @param {*} timer
   */
  updateTimerDisplay(timer) {
    document.getElementById(this.timerId).innerText = timer.timeLeft;
    if (timer.isActive) {
      document.getElementById(this.playId).style.display = 'none';
      document.getElementById(this.pauseId).style.display = 'block';
    } else {
      document.getElementById(this.playId).style.display = 'block';
      document.getElementById(this.pauseId).style.display = 'none';
    }
    if (timer.isFocus) {
      document.getElementById(this.stateTextId).innerText = DEFAULT_FOCUS_TEXT;
    } else {
      document.getElementById(this.stateTextId).innerText = DEFAULT_BREAK_TEXT;
    }
  }
}

// Load the state of the timer as soon as the Dom loads
window.addEventListener('DOMContentLoaded', (event) => {
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

  chrome.runtime.sendMessage({cmd: 'GET_TIMER'}, (response) => {
    timerDisplay.updateTimerDisplay(response);
  });
});


// Every 500 millisecond the timer UI will update
getTimer = setInterval(() => {
  chrome.runtime.sendMessage({cmd: 'GET_TIMER'}, (response) => {
    timerDisplay.updateTimerDisplay(response);
  });
}, 500);

const timerDisplay = new TimerDisplay('timer', 'play_img', 'pause_img',
    'timer_state');

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('viewTasksBtn').onclick = viewTaskList;
  document.getElementById('setting_img').onclick = viewSettings;
});
