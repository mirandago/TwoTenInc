export let testTask;

/** Add a new group
* @param {String} group The color of the group
* @return {Boolean} Whether the group exists
*/
/* eslint-disable */
export async function addGroup(group) {
/* eslint-enable */
  if (window.localStorage.getItem('runtest')) {
    // for cypress test
    window.localStorage.setItem(group, 'addTask works');
  }
  const existed = await new Promise(function(resolve, reject) {
    if (window.localStorage.getItem('mochatest')) {
      if (window.localStorage.getItem(group)==null) {
        const tasks = [];
        window.localStorage.setItem(group, JSON.stringify(tasks));
        resolve(false);
        console.log('\tGroup "' + group + '" added');
      } else {
        resolve(true);
        console.log('\tGroup "' + group + '" exists');
      }
    } else {
      chrome.storage.sync.get([group], function(result) {
        if (typeof(result[group]) == 'undefined') {
          const tasks = [];
          chrome.storage.sync.set({[group]: tasks}, function() {
            resolve(false);
            console.log('Group "' + group + '" added');
          });
        } else {
          resolve(true);
          console.log('Group "' + group + '" exists');
        }
      });
    }
  });
  //console.log(existed);
  return existed;
}

/** Get all groups
* @return {Array} A list of all groups
*/
/* eslint-disable */
export async function getGroups() {
/* eslint-enable */
  const groups = await new Promise(function(resolve, reject) {
    if (window.localStorage.getItem('mochatest')) {
      resolve(Object.keys(window.localStorage));
    } else {
      chrome.storage.sync.get(null, function(result) {
        resolve(Object.keys(result));
      });
    }
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
/* eslint-disable */
export async function addTask(name, session, group) {
/* eslint-enable */
  const d = new Date();
  const date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
  const task = {
    name: name,
    group: group,
    session: session,
    sessionCompleted: 0,
    date: date,
    completed: false,
  };
  testTask = task; // for testing
  await addGroup(group);
  console.log(window.localStorage.getItem(group));
  const existed = await new Promise(function(resolve, reject) {
    if (window.localStorage.getItem('mochatest')) {
      const tasks = JSON.parse(window.localStorage.getItem(group));
      let e = false;
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i].name == name) {
            e = true;
            break;
          }
        }
        if (!e) {
          tasks.push(task);
          window.localStorage.setItem(group, JSON.stringify(tasks));
          console.log('\tTask added');
          resolve(false);
        } else {
          console.log('\tTask exists');
          resolve(true);
        }      
    } else {
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
    }
  });
  console.log(existed);
  return existed;
}

/** Get all tasks
* @return {Array} A list of all tasks
*/
/* eslint-disable */
export async function getAllTasks() {
/* eslint-enable */
  const groups = await getGroups();
  const allTasks = [];
  for (let i = 0; i < groups.length; i++) {
    const tasks = await getTasksByGroup(groups[i]);
    if (typeof tasks !== 'undefined') {
      allTasks.push(...tasks);
    }
  }
  console.log(allTasks);
  return allTasks;
}

/** Get all tasks in a specific group
* @param {String} group The name of the group
* @return {Array} A list of tasks in the group
*/
/* eslint-disable */
export async function getTasksByGroup(group) {
/* eslint-enable */
  const tasks = await new Promise(function(resolve, reject) {
    if (window.localStorage.getItem('mochatest')) {
      resolve(JSON.parse(window.localStorage.getItem(group)));
    } else {
      chrome.storage.sync.get([group], function(result) {
        resolve(result[group]);
      });
    }
  });
  return tasks;
}

/** Delete a task in a group
* @param {String} name The name of the task
* @param {String} group The name of the group
*/
/* eslint-disable */
export function deleteTask(name, group) {
/* eslint-enable */
  if (window.localStorage.getItem('mochatest')) {
    const tasks = JSON.parse(window.localStorage.getItem(group));
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].name == name) {
        tasks.splice(i, 1);
      }
    }
    window.localStorage.setItem(group, JSON.stringify(tasks));
    console.log('Task deleted');
  } else {
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
    chrome.runtime.sendMessage({cmd: 'FINISH_TASK', task: name, group: group});
  }
}

/** Complete a task in a group
* @param {String} name The name of the task
* @param {String} group The name of the group
*/
/* eslint-disable */
export function completeTask(name, group) {
/* eslint-enable */
  if (window.localStorage.getItem('mochatest')) {
    const tasks = JSON.parse(window.localStorage.getItem(group));
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].name == name) {
        tasks[i].completed = true;
      }
    }
    window.localStorage.setItem(group, JSON.stringify(tasks));
    console.log('Task Completed');
  } else {
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
    chrome.runtime.sendMessage({cmd: 'FINISH_TASK', task: name, group: group});
  }
}

/** Complete one session of a task in a group
* @param {String} name The name of the task
* @param {String} group The name of the group
*/
/* eslint-disable */
export function completeSession(name, group) {
/* eslint-enable */
  if (window.localStorage.getItem('mochatest')) {
    const tasks = JSON.parse(window.localStorage.getItem(group));
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].name == name) {
        tasks[i].sessionCompleted++;
      }
    }
    window.localStorage.setItem(group, JSON.stringify(tasks));
    console.log('Session completed');
  } else {    
    chrome.storage.sync.get([group], function(result) {
      const tasks = result[group];
      if (typeof tasks !== 'undefined') {
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i].name == name) {
            tasks[i].sessionCompleted++;
          }
        }
        chrome.storage.sync.set({[group]: tasks}, function() {
          console.log('Session completed');
        });
      }
    });
  }
}
