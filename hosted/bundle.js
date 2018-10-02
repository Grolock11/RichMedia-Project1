'use strict';

var data = '';

//takes the xhr and the type of data requested
var handleResponse = function handleResponse(xhr, type) {
  console.log(xhr);

  var content = document.querySelector('#content');

  var h1 = document.createElement('h1');
  var p = document.createElement('p');

  if (xhr.response) {
    var obj = JSON.parse(xhr.response);

    //check for blizzard error status message
    if (obj.status !== 'nok') {
      //Displays number of mounts collected and first alphabetical mount (just to grab some data about an idividual mount)
      if (type === 'mounts') {

        data = {
          character: obj.name,
          realm: obj.realm,
          mounts: obj.mounts.numCollected,
          first: obj.mounts.collected[0].name
        };

        h1.textContent = 'Total Mounts: ' + obj.mounts.numCollected;
        p.textContent = 'First Alphabetically: ' + obj.mounts.collected[0].name;
      }

      //Will display heroic kills on each boss.
      if (type === 'progression') {}
      //NYI


      //take lastModified for use later
      data.lastModified = obj.lastModified;
    }
  }

  content.innerHTML = '';
  content.appendChild(h1);
  content.appendChild(p);
};

var sendGet = function sendGet(e) {
  var xhr = new XMLHttpRequest();
  e.preventDefault();

  //make request for data about specified character from specified US server
  var type = document.querySelector('#typeField').value;
  var character = document.querySelector('#characterField').value;
  var realm = document.querySelector('#realmField').value;

  xhr.open('GET', 'https://us.api.battle.net/wow/character/' + realm + '/' + character + '?fields=' + type + '&locale=en_US&apikey=8ne7tyy8dchsywnvqaptkt824drdqa54');
  xhr.onload = function () {
    return handleResponse(xhr, type);
  };
  xhr.send();

  return false;
};

var sendPost = function sendPost(e) {
  var xhr = new XMLHttpRequest();

  //set up the form data to include whatver data has in it
  var formData = '';
  var keys = Object.keys(data);
  keys.forEach(function (key) {
    formData += key + '=' + data[key] + '&';
  });

  console.log(formData);

  xhr.open('POST', '/addUser');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    return handleResponse(xhr);
  };
  xhr.send(formData);

  e.preventDefault();
  return false;
};

var setup = function setup() {
  var sendButton = document.querySelector('#userFormSend');
  var postSendButton = document.querySelector('#nameFormSend');

  sendButton.addEventListener('click', sendGet);
  postSendButton.addEventListener('click', sendPost);
};

window.onload = setup;
