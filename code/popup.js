'use strict';

/**
 * Execute when button is clicked
 */
function click() {
  // check that event listener works by changing original popup
  document.getElementById('hello').innerHTML = 'clicked';
  document.body.style.backgroundColor='red';

  // make a new window
  chrome.windows.create({url: 'settings.html', type: 'popup'});
}


// add click even listener to all 'h2' and 'button' elements in popup
document.addEventListener('DOMContentLoaded', function() {
  const divs = document.querySelectorAll('h2');
  for (let i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
  const divs2 = document.querySelectorAll('button');
  for (let i = 0; i < divs2.length; i++) {
    divs2[i].addEventListener('click', click);
  }
});

