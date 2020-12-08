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

function submitTask() {
	var name = document.getElementById('inputTask').value;
	var session = document.getElementById('sessionId').value;
	var group = document.getElementById('groups').value;
	var result2 = addGroup(group);
	console.log(result2);
	console.log(group);
	var result =  addTask(name, session, group);
	console.log(result);

	
}
