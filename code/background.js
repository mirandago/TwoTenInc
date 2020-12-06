// Keeps running in the background
export const bg = {};

import {getSettings, setSettings} from './settingStorage.js';
// import the setting storage to use the get settings function
//const imported = document.createElement('script');
//imported.src = './settingStorage.js';
//document.head.appendChild(imported);

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

export let isFocus;
export let isActive;
export const breakAudio = new Audio(chrome.runtime.getURL('audio/break.mp3'));
export const focusAudio = new Audio(chrome.runtime.getURL('audio/focus.mp3'));
// let currentTask;

// constants
export const DEFAULT_FOCUS = true;
export const DEFAULT_ACTIVE = false;

export let audioPlayed = 'none'; // for testing

// 2 cases: timer hits 0, decrement counter
bg.setRunningCall = () => {
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
      audioPlayed = 'break'; // for testing
      console.log('\t break notification played');
    } else {
      chrome.storage.local.get(['focus_audio'], function(result) {
        if (result.focus_audio === undefined) {
          focusAudio.play();
          chrome.storage.local.set({'focus_audio': 'on'});
        } else if (result.focus_audio === 'on') {
          focusAudio.play();
        }
      });
      audioPlayed = 'focus'; // for testing
      console.log('\t focus notification played');
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
  return true;
};

bg.start_timer = function() {
  isActive = true;
  if (timeLeft === undefined) {
    timeLeft = timerL;
    isFocus = DEFAULT_FOCUS;
  }
  // don't know how to test setInterval at the moment
  // runs every second
  runningCall = setInterval(bg.setRunningCall, 1000);
  return true;
};

bg.pause_timer = function() {
  isActive = false;
  clearInterval(runningCall);
  runningCall = false; // for testing
  return true;
};

bg.reset_timer = function() {
  sessionNum = 0;
  timeLeft = timerL;
  isFocus = DEFAULT_FOCUS;
  isActive = DEFAULT_ACTIVE;
  clearInterval(runningCall);
  runningCall = false; // for testing
  return true;
};

bg.set_time = function(request) {
  timeLeft = request.timeLeft;
  return true;
};

bg.get_time = function(request) { 
  return {timeLeft: timeLeft};
}

bg.get_timer = function() {
   // if it is undefined, call the storage and get back stuff
  if (timeLeft === undefined) {
    // may be a bit delayed until we get the settings back
    getSettings(setupStorageSettings);
    timeLeft = 0;
    isFocus = DEFAULT_FOCUS;
    isActive = DEFAULT_ACTIVE;
  }
  return {
    timeLeft: timeLeft,
    isActive: isActive,
    isFocus: isFocus,
    // currentTask: currentTask
  };
};

bg.set_settings = function(request) {
  sessionNum = 0;
  console.log('what is timeL ' + request.settings.timerL);
  timerL = request.settings.timerL;
  breakL = request.settings.breakL;
  sulb = request.settings.SULB;
  longbreakL = request.settings.longbreakL;
  return true;
}
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
    bg.set_time();
  } else if (request.cmd === 'GET_TIME') {
    // get time
    sendResponse(bg.get_time());
  } else if (request.cmd === 'GET_TIMER') {
    // get the timer back including time and state
    sendResponse(bg.get_timer());
  } else if (request.cmd === 'SET_SETTINGS') {
    bg.set_settings(request);
  }
  return true;
});

/**
 * Fresh start, does this as soon as storage returns
 * @param {Object} value
 */
export function setupStorageSettings(value) {
  timerL = value.timerL;
  breakL = value.breakL;
  sulb = value.SULB;
  longbreakL = value.longbreakL;
  timeLeft = value.timerL;
  return true;
}

/**
 * sets all variables to allow for independent
 * testing of functions
 */
export function set_var_for_testing(settings) {
  timeLeft = settings.timeLeft;
  sessionNum = settings.sessionNum;
  runningCall = settings.runningCall;
  sulb = settings.sulb;
  timerL = settings.timerL;
  breakL = settings.breakL;
  longbreakL = settings.longbreakL;
  isFocus = settings.isFocus;
  isActive = settings.isActive;
  audioPlayed = settings.audioPlayed;
  return true;
}
