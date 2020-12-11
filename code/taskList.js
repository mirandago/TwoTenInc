let data = [];
let loaded = false;
let hidden = true;


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

/** mark as completed
* @param {string} id is key for storage
*/
function buttonClicked(id) {
  const words = id.split('-');
  const trId = words[1] + '-' + words[2];
  const tr = document.getElementById(trId);
  const parent = tr.parentElement;
  parent.removeChild(tr);


  for (let i = 0; i < data.length; i++) {
    if (data[i].name === words[2] && data[i].group === words[1]) {
      console.log('got!!');
      if (words[0] === 'complete') {
        data[i].completed = true;
        completeTask(words[2], words[1]);
        if (loaded) {
          loadCompleteRow(data[i], document.getElementById(
              'completed-table').getElementsByTagName('tbody')[0]);
        }
      }
      if (words[0] === 'delete') {
        data.splice(i, 1);
        deleteTask(words[2], words[1]);
      }
      break;
    }
  }
  // TODO: Delete or complete data in storage and add them to completed
}

/** add event listener for task button
* @param {Object} parent gives parent node
* @param {string} info is description of task
* @param {string} id is key for storage
* @param {boolean} op is true if this is 'completed' button
*/
function newButton(parent, info, id, op) {
  const td = document.createElement('td');
  const button = document.createElement('button');
  const text = document.createTextNode(info);
  button.type = 'button';
  if (op) {
    button.className = 'btn btn-primary';
  } else {
    button.className = 'btn btn-danger';
  }
  button.id = id;
  button.appendChild(text);
  td.appendChild(button);
  parent.appendChild(td);
  document.getElementById(id).addEventListener('click', function() {
    buttonClicked(id);
  });
}

/** badge for completed task
* @param {Object} parent gives parent node
*/
function newBadge(parent) {
  const td = document.createElement('td');
  const badge = document.createElement('span');
  badge.className = 'badge badge-success';
  const text = document.createTextNode('Completed');
  badge.appendChild(text);
  td.appendChild(badge);
  parent.appendChild(td);
}

/** load a completed task onto html page
* @param {element} thead gives HTML element for header
*/
function loadHeader(thead) {
  const tr = document.createElement('tr');
  thead.appendChild(tr);
  const header = ['Complete', 'Name', 'Group', 'Date', 'Delete'];
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
  newButton(tr, 'complete', 'complete-' + data.group + '-' + data.name, true);
  newNode(tr, data.name);
  newNode(tr, data.group);
  newNode(tr, data.date);
  newButton(tr, 'delete', 'delete-' + data.group + '-' + data.name, false);
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
  newBadge(tr);
  newNode(tr, data.name);
  newNode(tr, data.group);
  newNode(tr, data.date);
  newButton(tr, 'delete', 'delete-' + data.group + '-' + data.name);
}

/** load all completed tasks onto html page
*/
function loadCompletedData() {
  const thead = document.getElementById(
      'completed-table').getElementsByTagName('thead')[0];
  const tbody = document.getElementById(
      'completed-table').getElementsByTagName('tbody')[0];
  loadHeader(thead);
  for (let i = 0; i < data.length; i++) {
    if (!data[i].completed) continue;
    loadCompleteRow(data[i], tbody);
  }
}

/** hide completed tasks
*/
function hideCompletedData() {
  document.getElementById('completed-table').style.display = 'none';
}

/** reveal completed tasks
*/
function revealCompletedData() {
  document.getElementById('completed-table').style.display = 'table';
}

/**
 * Go to the main app interface page
 */
function mainPage() {
  location.href = 'mainPage.html';
}

window.onload=async function() {
  data = await getAllTasks();
  document.getElementById('back blackIcon').onclick = mainPage;
  const showHide = document.getElementById('show-completed');
  showHide.addEventListener('click', function() {
    if (!loaded) { // need to show completed
      showHide.innerHTML = 'Hide Completed';
      loadCompletedData();
      loaded = true;
      hidden = false;
    } else if (hidden) {
      showHide.innerHTML = 'Hide Completed';
      revealCompletedData();
      hidden = false;
    } else { // want to hide completed
      showHide.innerHTML = 'Show Completed';
      hideCompletedData();
      hidden = true;
    }
  });
  loadCurData();
};

