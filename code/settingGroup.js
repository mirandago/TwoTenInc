//'use strict';

/**
 * Go to the timer settings page
 */
function settingTimer() {
  location.href = 'settingTimer.html';
}

/**
 * Go to the audio settings page
 */
function settingAudio() {
  location.href = 'settingAudio.html';
}

/**
 * clears task list storage
 */
function eraseAllTasks() {
  chrome.storage.sync.clear();
  document.getElementById(
      'task-table').getElementsByTagName('tbody')[0].innerHTML = '';
}

/**
 * Go back to the main page
 */
function mainPage() {
  location.href = 'mainPage.html';
}

function newNode(parent, info) {
  const td = document.createElement('td');
  const text = document.createTextNode(info);
  td.appendChild(text);
  parent.appendChild(td);
}

/** load a completed task onto html page
* @param {element} thead gives HTML element for header
*/
function loadHeader(thead) {
  const tr = document.createElement('tr');
  thead.appendChild(tr);
  const header = ['Complete', 'Name', 'Group', 'Date'];
  for (let i = 0; i< header.length; i++) {
    const th = document.createElement('th');
    th.id = header[i];
    th.innerHTML = header[i];
    tr.appendChild(th);
  }
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
  newNode(tr, 'not completed');
  newNode(tr, data.name);
  newNode(tr, data.group);
  newNode(tr, data.date);
}

/** load all uncompleted tasks onto html page
*/
function loadCurData() {
  const thead = document.getElementById(
      'task-table').getElementsByTagName('thead')[0];
  const tbody = document.getElementById(
      'task-table').getElementsByTagName('tbody')[0];
  loadHeader(thead);
  for (let i = 0; i < data.length; i++) {
    if (data[i].completed) continue;
    loadCurRow(data[i], tbody);
  }
}

/** load a completed task onto html page
* @param {Array} data gives all tasks
* @param {element} tbody gives HTML element for table
*/
function loadCompleteRow(data, tbody) {
  const tr = document.createElement('tr');
  tr.id = data.group + '-' + data.name;
  tr.className = 'warning';
  tbody.appendChild(tr);
  newNode(tr, 'completed');
  newNode(tr, data.name);
  newNode(tr, data.group);
  newNode(tr, data.date);
}

/** load all completed tasks onto html page
*/
function loadCompletedData() {
  const tbody = document.getElementById(
      'task-table').getElementsByTagName('tbody')[0];
  for (let i = 0; i < data.length; i++) {
    if (!data[i].completed) continue;
    loadCompleteRow(data[i], tbody);
  }
}



document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('settingTimer').onclick = settingTimer;
  document.getElementById('settingAudio').onclick = settingAudio;
  document.getElementById('mainPage').onclick = mainPage;
  document.getElementById('clearAll').onclick = eraseAllTasks;
});

window.onload=async function() {
  data = await getAllTasks();
  await loadCurData();
  await loadCompletedData();
};
