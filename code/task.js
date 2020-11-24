data = [
        {name: "task1", group: "group1", date: "2020-11-09", completed: true},
        {name: "task2", group: "group2", date: "2020-11-10", completed: false},
        {name: "task3", group: "group3", date: "2020-11-11", completed: false},
        {name: "task4", group: "group3", date: "2020-11-12", completed: false},
        {name: "task5", group: "group3", date: "2020-11-12", completed: true}
]

var loaded = false;

function newNode(parent, info) {
    var td = document.createElement('td');
    var text = document.createTextNode(info);
    td.appendChild(text);
    parent.appendChild(td);
}

function buttonClicked(id){
    var words = id.split('-');
    var trId = words[1] + '-' + words[2];
    var tr = document.getElementById(trId);
    var parent = tr.parentElement;
    parent.removeChild(tr);
    if(words[0] === 'complete') {
        for(var i = 0; i < data.length; i++){
            if(data[i].name === words[2] && data[i].group === words[1]) {
                console.log('got!!');
                data[i].completed = true;
                if(loaded) {
                    loadCompleteRow(data[i]);
                }
                break;
            }
        }
    }
    //TODO: Delete or complete data in storage and add them to completed
}

function newButton(parent, info, id, op) {
    var td = document.createElement('td');
    var button = document.createElement('button');
    var text = document.createTextNode(info);
    button.type = 'button';
    if(op) {
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

function newBadge(parent){
    var td = document.createElement('td');
    var badge = document.createElement('span');
    badge.className = "badge badge-success";
    var text = document.createTextNode('Completed');
    badge.appendChild(text);
    td.appendChild(badge);
    parent.appendChild(td);
}

function loadCurRow(data) {
    var tbody = document.getElementById('task-table').getElementsByTagName('tbody')[0];
    var tr = document.createElement('tr');
    tr.id = data.group + '-' + data.name;
    tr.className = 'success';
    tbody.appendChild(tr);
    newButton(tr, 'complete', 'complete-' + data.group + '-' + data.name, true);
    newNode(tr, data.name);
    newNode(tr, data.group);
    newNode(tr, data.date);
    newButton(tr, 'delete', 'delete-' + data.group + '-' + data.name, false);
}

function loadCurData() {
    for(var i = 0; i < data.length; i++){
        if(data[i].completed) continue;
        loadCurRow(data[i]);
    }
}

function loadCompleteRow(data) {
    var tbody = document.getElementById('task-table').getElementsByTagName('tbody')[0];
    var tr = document.createElement('tr');
    tr.id = data.group + '-' + data.name;
    tr.className = 'warning';
    tbody.appendChild(tr);
    newBadge(tr);
    newNode(tr, data.name);
    newNode(tr, data.group);
    newNode(tr, data.date);
    newButton(tr, 'delete', 'delete-' + data.group + '-' + data.name);
}

function loadCompletedData() {
    for(var i = 0; i < data.length; i++){
        if(!data[i].completed) continue;
        loadCompleteRow(data[i]);
    }
}


document.getElementById('show-completed').addEventListener('click', function() {
    if(!loaded) {
        loadCompletedData();
        loaded = true;
    }
});
loadCurData();

