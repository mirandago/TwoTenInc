'use strict';

/**
 * execute when bell icon is clicked
 */
function click() {
  document.body.style.backgroundColor='pink';
}

// add click event listener to bell icon
// add change event listener to checkboxes and set notification 'status'
document.addEventListener('DOMContentLoaded', function() {
  const divs = document.querySelectorAll('button');
  for (let i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
  const _selector1 = document.querySelector('input[type=checkbox]#timer');
  _selector1.addEventListener('change', function (event) {
    if (_selector1.checked) {
        document.body.style.backgroundColor='red';
    } else {
	    document.body.style.backgroundColor='green';
    }
  });
  const _selector2 = document.querySelector('input[type=checkbox]#break');
  _selector2.addEventListener('change', function (event) {
    if (_selector2.checked) {
	    document.body.style.backgroundColor='blue';
    } else {
		document.body.style.backgroundColor='orange';
    }
  });
});