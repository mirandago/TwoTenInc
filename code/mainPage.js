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

/**
 * Adds the task into storage
 */
function submitTask() {
  const name = document.getElementById('inputTask').value;
  const session = document.getElementById('sessionId').value;
  const group = document.getElementById('groups').value;
  addTask(name, session, group);
}
