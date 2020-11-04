'use strict';

// executed when button is clicked
function click(e) {
  
  // check that event listener works by changing original popup  
  document.getElementById("hello").innerHTML = "clicked";
  document.body.style.backgroundColor='red';
  
  // make a new tab and a new window
  chrome.tabs.create({url: "http://www.stackoverflow.com"});
  chrome.windows.create({url: "http://www.stackoverflow.com",type:"popup"});
  //window.close();

}

// add click even listener to all 'h2' elements in popup
document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('h2');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});