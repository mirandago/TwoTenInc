data = [
  {name: 'task1', group: 'group1', date: '2020-11-09', completed: true},
  {name: 'task2', group: 'group2', date: '2020-11-10', completed: false},
  {name: 'task3', group: 'group3', date: '2020-11-11', completed: false},
  {name: 'task4', group: 'group3', date: '2020-11-12', completed: false},
  {name: 'task5', group: 'group3', date: '2020-11-12', completed: true},
];

let loaded = false;

/**create new task node
*/
function newNode(parent, info) {
  let td = document.createElement('td');
  let text = document.createTextNode(info);
  td.appendChild(text);
  parent.appendChild(td);
}

/** mark as completed
*/
function buttonClicked(id){
  let words = id.split('-');
  let trId = words[1] + '-' + words[2];
  let tr = document.getElementById(trId);
  let parent = tr.parentElement;
  parent.removeChild(tr);
  if (words[0] === 'complete') {
    for(let i = 0; i < data.length; i++){
      if (data[i].name === words[2] && data[i].group === words[1]) {
        console.log('got!!');
        data[i].completed = true;
        if (loaded) {
          loadCompleteRow(data[i]);
        }
        break;
      }
    }
  }
    //TODO: Delete or complete data in storage and add them to completed
}

/** add event listener for task button
*/
function newButton(parent, info, id, op) {
  let td = document.createElement('td');
  let button = document.createElement('button');
  let text = document.createTextNode(info);
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
*/
function newBadge(parent){
  let td = document.createElement('td');
  let badge = document.createElement('span');
  badge.className = 'badge badge-success';
  let text = document.createTextNode('Completed');
  badge.appendChild(text);
  td.appendChild(badge);
  parent.appendChild(td);
}

/** load uncompleted task onto html page
*/
function loadCurRow(data) {
  let tbody = document.getElementById('task-table').getElementsByTagName('tbody')[0];
  let tr = document.createElement('tr');
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
  for(let i = 0; i < data.length; i++){
    if (data[i].completed) continue;
    loadCurRow(data[i]);
  }
}

/** load a completed task onto html page
*/
function loadCompleteRow(data) {
  let tbody = document.getElementById('task-table').getElementsByTagName('tbody')[0];
  let tr = document.createElement('tr');
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
  for(let i = 0; i < data.length; i++){
    if (!data[i].completed) continue;
    loadCompleteRow(data[i]);
  }
}


document.getElementById('show-completed').addEventListener('click', function() {
  if (!loaded) {
    loadCompletedData();
    loaded = true;
  }
});
loadCurData();

