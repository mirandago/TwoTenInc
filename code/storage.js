/** Add a new group
* @param {String} group The color of the group
* @return {Boolean} Whether the group exists
*/
export async function addGroup(group) {
  const existed = await new Promise(function(resolve, reject) {
    chrome.storage.sync.get([group], function(result) {
      if (typeof(result[group]) == 'undefined') {
        const tasks = [];
        chrome.storage.sync.set({[group]: tasks}, function() {
          resolve(true);
          console.log('Group ' + group + ' added');
        });
      } else {
        resolve(false);
        console.log('Group ' + group + ' exists');
      }
    });
  });
  console.log(existed);
  return existed;
}

/** Get all groups
* @return {Array} A list of all groups
*/
export async function getGroups() {
  const groups = await new Promise(function(resolve, reject) {
    chrome.storage.sync.get(null, function(result) {
      resolve(Object.keys(result));
    });
  });
  console.log(groups);
  return groups;
}

/** Add a new task to a specific group
* @param {String} name The name of the task
* @param {Number} session The number of sessions for this task
* @param {String} group The group the task will be assigned to
* @return {Boolean} Whether the task exists
*/
export async function addTask(name, session, group) {
  const d = new Date();
  const date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
  const task = {
    name: name,
    group: group,
    session: session,
    date: date,
    completed: false,
  };

  const existed = await new Promise(function(resolve, reject) {
    chrome.storage.sync.get([group], function(result) {
      const tasks = result[group];
      let e = false;
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].name == name) {
          e = true;
          break;
        }
      }
      if (!e) {
        tasks.push(task);
        chrome.storage.sync.set({[group]: tasks}, function() {
          console.log('Task added');
        });
        resolve(false);
      } else {
        console.log('Task exists');
        resolve(true);
      }
    });
  });
  console.log(existed);
  return existed;
}

/** Get all tasks
* @return {Array} A list of all tasks
*/
export async function getAllTasks() {
  const groups = await getGroups();
  const allTasks = [];
  for (let i = 0; i < groups.length; i++) {
    const tasks = await getTasksByGroup(groups[i]);
    allTasks.push.apply(allTasks, tasks);
  }
  console.log(allTasks);
  return allTasks;
}

/** Get all tasks in a specific group
* @param {String} group The name of the group
* @return {Array} A list of tasks in the group
*/
async function getTasksByGroup(group) {
  const tasks = await new Promise(function(resolve, reject) {
    chrome.storage.sync.get([group], function(result) {
      resolve(result[group]);
    });
  });
  return tasks;
}

/** Delete a task in a group
* @param {String} name The name of the task
* @param {String} group The name of the group
*/
export function deleteTask(name, group) {
  chrome.storage.sync.get([group], function(result) {
    const tasks = result[group];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].name == name) {
        tasks.splice(i, 1);
      }
    }
    chrome.storage.sync.set({[group]: tasks}, function() {
      console.log('Task deleted');
    });
  });
}

/** Complete a task in a group
* @param {String} name The name of the task
* @param {String} group The name of the group
*/
export function completeTask(name, group) {
  chrome.storage.sync.get([group], function(result) {
    const tasks = result[group];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].name == name) {
        tasks[i].completed = true;
      }
    }
    chrome.storage.sync.set({[group]: tasks}, function() {
      console.log('Task Completed');
    });
  });
}

/** Complete one session of a task in a group
* @param {String} name The name of the task
* @param {String} group The name of the group
*/
export function completeSession(name, group) {
  chrome.storage.sync.get([group], function(result) {
    const tasks = result[group];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].name == name) {
        tasks[i].session--;
      }
    }
    chrome.storage.sync.set({[group]: tasks}, function() {
      console.log('Session completed');
    });
  });
}

