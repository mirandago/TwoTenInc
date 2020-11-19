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
   */
  constructor(timerId, playId, pauseId, stateTextId, stateContainerId) {
    this.timerId = timerId;
    this.playId = playId;
    this.pauseId = pauseId;
    this.stateTextId = stateTextId;
    this.stateContainerId = stateContainerId;
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
      document.getElementById(this.stateContainerId).style.backgroundColor =
        'blue';
    } else {
      document.getElementById(this.stateTextId).innerText = DEFAULT_BREAK_TEXT;
      document.getElementById(this.stateContainerId).style.backgroundColor =
        'green';
    }
  }
}

// timer dsiplay variable
const timerDisplay = new TimerDisplay('timer', 'play_img', 'pause_img',
    'timer_state', 'rcorners');

// Every 200 millisecond the timer UI will update
getTimer = setInterval(() => {
  chrome.runtime.sendMessage({cmd: 'GET_TIMER'}, (response) => {
    timerDisplay.updateTimerDisplay(response);
  });
}, 200);

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

document.getElementById('setting_img').addEventListener('click', function() {
  window.self.close();
  chrome.windows.create({url: 'settings.html', type: 'popup', height: 500,
    width: 500});
});


