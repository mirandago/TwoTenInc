// Keeps running in the background
export const bg = {};
import {getSettings} from './settingStorage.js';
import {completeSession, completeTask} from './storage.js';

// timer variables to keep track off
// time left in seconds
export let timeLeft;
// sessions counter
export let sessionNum = 0;
// timeout function that is called every second
export let runningCall;
// number of sessions until long break;
export let sulb;
// length of focus timer
export let timerL;
// length of break
export let breakL;
// length of long break
export let longbreakL;
// current task name
export let task;
export let group;

export let isFocus;
export let isActive;
export const breakAudio = new Audio(chrome.runtime.getURL('audio/break.mp3'));
export const focusAudio = new Audio(chrome.runtime.getURL('audio/focus.mp3'));

// constants
export const DEFAULT_FOCUS = true;
export const DEFAULT_ACTIVE = false;

export let audioPlayed = 'none'; // for testing

/**
 * called by 'START_TIMER' to keep timer running in background
 * 2 cases: timer hits 0, and decrement counter
 * @return {Boolean} for testing
 */
bg.setRunningCall = function() {
  // time hits 0, play sound and update state
  if (timeLeft == 0) {
    if (isFocus) {
      chrome.storage.local.get(['break_audio'], function(result) {
        if (result.break_audio === undefined) {
          breakAudio.play();
          chrome.storage.local.set({'break_audio': 'on'});
          chrome.notifications.clear('focus_end');
          chrome.notifications.create('focus_end', {
            title: 'Your focus session is over',
            message: 'Time to take a break!',
            iconUrl: chrome.extension.getURL('img/logo.jpg'),
            type: 'basic',
          });
        } else if (result.break_audio === 'on') {
          breakAudio.play();
          chrome.notifications.clear('focus_end');
          chrome.notifications.create('focus_end', {
            title: 'Your focus session is over',
            message: 'Time to take a break!',
            iconUrl: chrome.extension.getURL('img/logo.jpg'),
            type: 'basic',
          });
          chrome.notifications.clear('break_end');
        }
      });
      audioPlayed = 'break'; // for testing
    } else {
      chrome.storage.local.get(['focus_audio'], function(result) {
        if (result.focus_audio === undefined) {
          focusAudio.play();
          chrome.notifications.clear('break_end');
          chrome.storage.local.set({'focus_audio': 'on'});
          chrome.notifications.create('break_end', {
            title: 'Your break is over',
            message: 'Time to get back to work!',
            iconUrl: chrome.extension.getURL('img/logo.jpg'),
            type: 'basic',
          });
        } else if (result.focus_audio === 'on') {
          focusAudio.play();
          chrome.notifications.clear('break_end');
          chrome.notifications.create('break_end', {
            title: 'Your break is over',
            message: 'Time to get back to work!',
            iconUrl: chrome.extension.getURL('img/logo.jpg'),
            type: 'basic',
          });
        }
      });
      audioPlayed = 'focus'; // for testing
    }
    if (isFocus) {
      // complete task if working on something
      if (task !== '') {
        completeSession(task, group);
      }
      sessionNum++;
      if (sessionNum % sulb === 0) {
        timeLeft = longbreakL * 60;
      } else {
        timeLeft = breakL * 60;
      }
      isFocus = false;
    } else {
      timeLeft = timerL * 60;
      isFocus = true;
    }
  } else { // decrement counter
    timeLeft--;
  }
  return true;
};

/**
 * initializes variables and starts timer
 * @return {Boolean} for testing
 */
bg.start_timer = function() {
  isActive = true;
  if (timeLeft === undefined) {
    timeLeft = timerL * 60;
    isFocus = DEFAULT_FOCUS;
  }
  // runs every second
  runningCall = setInterval(bg.setRunningCall, 1000);
  return true;
};

/**
 * changes state and pause timer
 * @return {Boolean} for testing
 */
bg.pause_timer = function() {
  isActive = false;
  clearInterval(runningCall);
  runningCall = false; // for testing
  return true;
};

/**
 * reset states and pause+reset timer
 * @return {Boolean} for testing
 */
bg.reset_timer = function() {
  sessionNum = 0;
  timeLeft = timerL * 60;
  isFocus = DEFAULT_FOCUS;
  isActive = DEFAULT_ACTIVE;
  clearInterval(runningCall);
  runningCall = false; // for testing
  return true;
};

/**
 * set time on timer
 * @param {Object} request with any values needed
 * @return {Boolean} for testing
 */
bg.set_time = function(request) {
  timeLeft = request.timeLeft;
  return true;
};

/**
 * return time left
 * @param {Object} request with any values needed
 * @return {Boolean} for testing
 */
bg.get_time = function(request) {
  return {timeLeft: timeLeft};
};

/**
 * initialize and return timer variables
 * @return {Boolean} for testing
 */
bg.get_timer = function() {
  // if it is undefined, call the storage and get back stuff
  if (timeLeft === undefined) {
    // may be a bit delayed until we get the settings back
    getSettings(setupStorageSettings);
    timeLeft = 0;
    isFocus = DEFAULT_FOCUS;
    isActive = DEFAULT_ACTIVE;
    task = '';
  }
  return {
    timeLeft: timeLeft,
    isActive: isActive,
    isFocus: isFocus,
    currentTask: task,
  };
};

/**
 * customize focus and break
 * @param {Object} request with any values needed
 * @return {Boolean} for testing
 */
bg.set_settings = function(request) {
  sessionNum = 0;
  timerL = request.settings.timerL;
  breakL = request.settings.breakL;
  sulb = request.settings.SULB;
  longbreakL = request.settings.longbreakL;
  return true;
};

/**
 * change current task
 * @param {Object} request with any values needed
 * @return {Boolean} for testing
 */
bg.set_task = function(request) {
  task = request.task;
  group = request.group;
  return true;
};

/**
 * finish current task if match request
 * @param {Object} request with any values needed
 * @return {Boolean} for testing
 */
bg.finish_task = function(request) {
  if (request.task === task && request.group == group) {
    task = '';
    group = '';
  }
  return true;
};

/**
 * finish and mark current task as completed
 * @param {Object} request with any values needed
 * @return {Boolean} for testing
 */
bg.complete_task = function(request) {
  completeTask(task, group);
  task = '';
  group = '';
  return true;
};

// listener for run time messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // start timer or continue
  if (request.cmd === 'START_TIMER') {
    bg.start_timer();
  } else if (request.cmd === 'PAUSE_TIMER') {
    // pause timer
    bg.pause_timer();
  } else if (request.cmd === 'RESET_TIMER') {
    // reset timer and the states
    bg.reset_timer();
  } else if (request.cmd === 'SET_TIME') {
    // set time
    bg.set_time(request);
  } else if (request.cmd === 'GET_TIME') {
    // get time
    sendResponse(bg.get_time());
  } else if (request.cmd === 'GET_TIMER') {
    // get the timer back including time and state
    sendResponse(bg.get_timer());
  } else if (request.cmd === 'SET_SETTINGS') {
    bg.set_settings(request);
  } else if (request.cmd === 'SET_TASK') {
    // change current task
    bg.set_task(request);
  } else if (request.cmd === 'FINISH_TASK') {
    // finish current task if match request
    bg.finish_task(request);
  } else if (request.cmd === 'COMPLETE_TASK') {
    // finish and mark current task as completed
    bg.complete_task(request);
  }
  sendResponse('request was completed');
  return true;
});

/**
 * Fresh start, does this as soon as storage returns
 * @param {Object} value
 * @return {Boolean} for passing testing
 */
export function setupStorageSettings(value) {
  timerL = value.timerL;
  breakL = value.breakL;
  sulb = value.SULB;
  longbreakL = value.longbreakL;
  timeLeft = value.timerL * 60;
  return true;
}

/**
 * sets all variables to allow for independent
 * testing of functions
 * @param {Object} settings to set variables for testing
 * @return {Boolean} for passing testing
 */
export function setVarForTesting(settings) {
  timeLeft = settings.timeLeft;
  sessionNum = settings.sessionNum;
  runningCall = settings.runningCall;
  sulb = settings.sulb;
  timerL = settings.timerL;
  breakL = settings.breakL;
  longbreakL = settings.longbreakL;
  task = settings.task;
  group = settings.group;
  isFocus = settings.isFocus;
  isActive = settings.isActive;
  audioPlayed = settings.audioPlayed;
  return true;
}
