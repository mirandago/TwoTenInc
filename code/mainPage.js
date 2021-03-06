
import {addTask, getAllTasks, getTasksByGroup} from './storage.js';

let data = [];
let prevId = undefined;
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
   * @param {*} completeId
   */
  constructor(timerId, playId, pauseId, stateTextId, completeId) {
    this.timerId = timerId;
    this.playId = playId;
    this.pauseId = pauseId;
    this.stateTextId = stateTextId;
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
  async updateTimerDisplay(timer) {
    document.getElementById(this.timerId).innerText =
        this.formatTime(timer.timeLeft);
    if (timer.isActive) {
      document.getElementById(this.playId).style.display = 'none';
      document.getElementById(this.pauseId).style.display = 'block';
    } else {
      document.getElementById(this.playId).style.display = 'block';
      document.getElementById(this.pauseId).style.display = 'none';
    }
    // show complete task button only if a task is selected
    if (timer.currentTask === '') {
      document.getElementById(this.completeId).style.display = 'none';
    } else {
      document.getElementById(this.completeId).style.display = 'block';
    }
    document.getElementById('session').innerText = await getSessionStr();
    if (timer.isFocus) {
      if (timer.currentTask !== '') {
        document.getElementById(this.stateTextId).innerText = timer.currentTask;
      } else {
        document.getElementById(this.stateTextId).innerText =
          DEFAULT_FOCUS_TEXT;
      }
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

  document.getElementById('complete_img').addEventListener('click', function() {
    chrome.runtime.sendMessage({cmd: 'COMPLETE_TASK'});
    window.location.reload();
  });

  if (window.localStorage.getItem('runtest')) {
    const response = {
      timeLeft: 300,
      isActive: true,
      isFocus: true,
      currentTask: 'testing',
    };
    timerDisplay.updateTimerDisplay(response);
  } else {
    chrome.runtime.sendMessage({cmd: 'GET_TIMER'}, (response) => {
      timerDisplay.updateTimerDisplay(response);
    });
  }
});


// Every 500 millisecond the timer UI will update
setInterval(() => {
  if (window.localStorage.getItem('runtest')) {
    timerDisplay.updateTimerDisplay(JSON
        .parse(window.localStorage.getItem('response')));
  } else {
    chrome.runtime.sendMessage({cmd: 'GET_TIMER'}, (response) => {
      timerDisplay.updateTimerDisplay(response);
    });
  }
}, 500);

const timerDisplay = new TimerDisplay('timer', 'play_img', 'pause_img',
    'timer_state', 'complete_img');

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('viewTasksBtn').onclick = viewTaskList;
  document.getElementById('setting_img').onclick = viewSettings;
  document.getElementById('submitTaskBtn').onclick = submitTask;
  document.getElementById('taskListGroupRed').onclick = () => {
    changeTaskList('Red');
  };
  document.getElementById('taskListGroupGreen').onclick = () => {
    changeTaskList('Green');
  };
  document.getElementById('taskListGroupYellow').onclick = () => {
    changeTaskList('Yellow');
  };
  document.getElementById('taskListGroupBlue').onclick = () => {
    changeTaskList('Blue');
  };
});

/** create new task node
* @param {Object} parent gives parent node
* @param {string} info is description of task
*/
function newNode(parent, info) {
  const td = document.createElement('td');
  const text = document.createTextNode(info);
  td.appendChild(text);
  parent.appendChild(td);
}

/**
 * Adds the task from inputs into storage
 * @return {Boolean} whether adding a task was successful
 */
function submitTask() {
  const name = document.getElementById('inputTask').value.trim();
  const session = document.getElementById('sessionId').value;
  const group = document.getElementById('groups').value;
  if (name == '') {
    alert('Please input a task');
    return false;
  }
  if (session == '') {
    alert('Please input the number of sessions');
    return false;
  }
  addTask(name, session, group);
  return true;
}

/** mark as completed
* @param {string} id is key for storage
*/
function buttonClicked(id) {
  if (typeof prevId !== 'undefined' && document.getElementById(prevId)) {
    document.getElementById(prevId).style = 'opacity: 1; cursor: allowed;';
  }
  document.getElementById(id).style =
      'background-color: orange; cursor: not-allowed;';
  prevId = id;

  const words = id.split('-');
  chrome.runtime.sendMessage({cmd: 'SET_TASK', task: words[1],
    group: words[0]});
}

/** add event listener for task button
* @param {Object} parent gives parent node
* @param {string} info is description of button
* @param {string} id is key for storage
* @param {string} group color for task
* @param {string} taskName name of the task
*/
function newButton(parent, info, id, group, taskName) {
  const td = document.createElement('td');
  const button = document.createElement('button');
  const text = document.createTextNode(info);
  button.type = 'button';
  button.className = ' btn btn-primary btn-sm'; // 'btn-' + group +
  button.id = id + '-button';
  button.appendChild(text);
  td.appendChild(button);
  parent.appendChild(td);
  document.getElementById(button.id).addEventListener('click', function() {
    buttonClicked(button.id);
  });
}

/** load uncompleted task onto html page
* @param {Array} data gives all tasks
* @param {element} tbody gives HTML element for table
*/
function loadCurRow(data, tbody) {
  const tr = document.createElement('tr');
  tr.id = data.group + '-' + data.name;
  tr.className = 'success';
  tbody.appendChild(tr);
  newButton(tr, 'focus on me!', data.group + '-' + data.name, data.group,
      data.name);
  newNode(tr, data.name);
  newNode(tr, data.date);
}

/** load all uncompleted tasks onto html page
 * @param {string} group color for task
*/
function loadCurData(group) {
  const tbody = document.getElementById(
      'task-table').getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';
  for (let i = 0; i < data.length; i++) {
    if (data[i].completed) continue;
    if (data[i].group == group) {
      loadCurRow(data[i], tbody);
    }
  }

  if (typeof prevId !== 'undefined' && document.getElementById(prevId)) {
    document.getElementById(prevId).style='opacity: 0.6; cursor: not-allowed;';
  }
}

/** Changes task list based on group
 * @param {string} groupColor represents color for task
*/
function changeTaskList(groupColor) {
  loadCurData(groupColor);
  document.getElementById('taskListGroupRed').disabled = false;
  document.getElementById('taskListGroupGreen').disabled = false;
  document.getElementById('taskListGroupYellow').disabled = false;
  document.getElementById('taskListGroupBlue').disabled = false;
  document.getElementById('taskListGroup' + groupColor).disabled = true;
}

/** Get the current session status
 * @return {String} A string for session status
*/
async function getSessionStr() {
  if (typeof prevId === 'undefined') {
    return 'Session 0/0';
  }
  const words = prevId.split('-');
  const group = words[0];
  const name = words[1];
  let sessionStr = 'Session ';
  const tasks = await getTasksByGroup(group);
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].name === name) {
      sessionStr = sessionStr + tasks[i].sessionCompleted +
      '/' + tasks[i].session;
    }
  }
  return sessionStr;
}

window.onload=async function() {
  data = await getAllTasks();
  document.getElementById('taskListGroupRed').disabled = true;
  loadCurData('Red');
};

/* eslint-disable */
/**
 * function to call in the console to skip time to 5 seconds
 */
function skipTime() {
  chrome.runtime.sendMessage({cmd: 'SET_TIME', timeLeft: '5'});
};
/* eslint-enable */
