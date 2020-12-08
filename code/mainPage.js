data = [];
prev = undefined;
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

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('viewTasksBtn').onclick = viewTaskList;
  document.getElementById('setting_img').onclick = viewSettings;
  document.getElementById('submitTaskBtn').onclick = submitTask;
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
 * Adds the task into storage
 */
function submitTask() {
  const name = document.getElementById('inputTask').value;
  const session = document.getElementById('sessionId').value;
  const group = document.getElementById('groups').value;
  addTask(name, session, group);
}

/** load a completed task onto html page
* @param {element} thead gives HTML element for header
*/
// function loadHeader(thead) {
//   const tr = document.createElement('tr');
//   thead.appendChild(tr);
//   const header = ['Complete', 'Name', 'Group', 'Date', 'Delete'];
//   for (let i = 0; i< header.length; i++) {
//     const th = document.createElement('th');
//     th.innerHTML = header[i];
//     tr.appendChild(th);
//   }
// }

/** mark as completed
* @param {string} id is key for storage
*/
function buttonClicked(id) {
  //update current task name!
  console.log(id); 
  if (typeof prev !== "undefined"){
    prev.style = 'opacity: 1; cursor: allowed;';
  }
  //grey out button (inactive)
  document.getElementById(id).style = 'opacity: 0.6; cursor: not-allowed;';
  prev = document.getElementById(id);
  //grey out button (inactive)
}

/** add event listener for task button
* @param {Object} parent gives parent node
* @param {string} info is description of button
* @param {string} id is key for storage
*/
function newButton(parent, info, id) {
  const td = document.createElement('td');
  const button = document.createElement('button');
  const text = document.createTextNode(info);
  button.type = 'button';
  button.className = 'btn btn-primary btn-sm';
  button.id = id;
  button.appendChild(text);
  td.appendChild(button);
  parent.appendChild(td);
  document.getElementById(id).addEventListener('click', function() {
    buttonClicked(id);
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
  newButton(tr, 'focus on me!', data.group + '-' + data.name);
  newNode(tr, data.name);
  // newNode(tr, data.group);
  newNode(tr, data.date);
}

/** load all uncompleted tasks onto html page
*/
function loadCurData() {
  const thead = document.getElementById(
      'task-table').getElementsByTagName('thead')[0];
  const tbody = document.getElementById(
      'task-table').getElementsByTagName('tbody')[0];
  for (let i = 0; i < data.length; i++) {
    if (data[i].completed) continue;
    loadCurRow(data[i], tbody);
  }
}
window.onload=async function() {
  data = await getAllTasks();
  loadCurData();
};
