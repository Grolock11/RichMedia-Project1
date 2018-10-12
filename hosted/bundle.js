'use strict';

var data = '';

//takes the xhr and the type of data requested
var handleResponse = function handleResponse(xhr, type) {
  console.log(xhr);

  var content = document.querySelector('#content');
  var bossesDiv = document.querySelector('#bosses');
  var contentTitle = document.querySelector('#contentTitle');
  var rankings = document.querySelector('#rankings');
  var postSendButton = document.querySelector('#nameFormSend');
  var topCharacterGetButton = document.querySelector('#serverTopGet');

  var h1 = document.createElement('h1');
  var p = document.createElement('p');

  if (xhr.response) {
    var obj = JSON.parse(xhr.response);

    //disable the save data button
    postSendButton.disabled = true;

    if (xhr.status === 201) {
      //allow top character data to be searched now that data exists
      topCharacterGetButton.disabled = false;

      p.textContent = 'Data has been saved to server';

      contentTitle.innerHTML = '';
      bossesDiv.innerHTML = '';
      rankings.innerHTML = '';
      contentTitle.appendChild(p);
    }
    //successful get
    else if (xhr.status === 200 && obj.id) {
        //successful get on a character
        if (obj.id === 'Character Retrieved') {
          var bossData = JSON.parse(obj.bossData);

          console.dir(bossData);

          h1.textContent = 'Raid: ' + obj.raid;
          p.textContent = 'Kills by ' + obj.character + ':';

          contentTitle.innerHTML = '';
          bossesDiv.innerHTML = '';
          rankings.innerHTML = '';
          contentTitle.appendChild(h1);
          contentTitle.appendChild(p);

          var keys = Object.keys(bossData);
          keys.forEach(function (key) {
            var boss = bossData[key];
            boss.name = key;

            var bossDiv = document.createElement('div');
            var p2 = document.createElement('p');
            var lfr = document.createElement('p');
            var normal = document.createElement('p');
            var heroic = document.createElement('p');
            var mythic = document.createElement('p');

            bossDiv.className = 'bossDiv';

            //create and display the data on the client
            p2.textContent = boss.name + ' kills:';
            lfr.textContent = 'LFR: ' + boss.lfrKills;
            normal.textContent = 'Normal: ' + boss.normalKills;
            heroic.textContent = 'Heroic: ' + boss.heroicKills;
            mythic.textContent = 'Mythic: ' + boss.mythicKills;

            //apply data to container for single boss
            bossDiv.appendChild(p2);
            bossDiv.appendChild(lfr);
            bossDiv.appendChild(normal);
            bossDiv.appendChild(heroic);
            bossDiv.appendChild(mythic);

            //apply boss div to content so the grid displays it correctly
            bossesDiv.appendChild(bossDiv);
          });
        }
        //Show rankings for up to top five characters by kills
        else if (obj.id === 'Top Characters Retrieved') {
            var topFive = JSON.parse(obj.top);

            var _keys = Object.keys(topFive);

            contentTitle.innerHTML = '';
            bossesDiv.innerHTML = '';
            rankings.innerHTML = '';

            var rankTitle = document.createElement('h1');
            rankTitle.innerHTML = "Most Overall Kills In Uldir";
            rankings.appendChild(rankTitle);

            for (var i = 0; i < _keys.length; i++) {
              var rank = document.createElement('p');
              rank.innerHTML = i + 1 + ': ' + topFive[4 - i].name + ', ' + topFive[4 - i].score;
              console.log(i);
              rankings.appendChild(rank);
            }

            console.log(topFive);
          }
      } else if (xhr.status === 404 && obj.id) {
        //failer on load character get
        if (obj.id = 'no data found') {
          h1.textContent = 'Error';
          p.textContent = 'No data stored for that character';
          contentTitle.innerHTML = '';
          bossesDiv.innerHTML = '';
          contentTitle.appendChild(h1);
          contentTitle.appendChild(p);
        }
        //Failure on Top Characters get
        if (obj.id = 'No Characters') {
          h1.textContent = 'Error';
          p.textContent = 'No character data was found. Try saving a character or two and try again';
          contentTitle.innerHTML = '';
          bossesDiv.innerHTML = '';
          contentTitle.appendChild(h1);
          contentTitle.appendChild(p);
        }
      }
      //get came from blizzard
      else {

          //check for blizzard error status message
          if (obj.status !== 'nok') {

            //Will display heroic kills on each boss for Uldir (The current raid).
            //position 21 should always be Uldir, although in case that changes this will be set up to handle any raid data
            var raidData = obj.progression.raids[21];
            console.dir(raidData);

            var _bossData = {};

            h1.textContent = 'Raid: ' + raidData.name;
            p.textContent = 'Kills by ' + obj.name + ':';

            contentTitle.innerHTML = '';
            bossesDiv.innerHTML = '';
            contentTitle.appendChild(h1);
            contentTitle.appendChild(p);

            raidData.bosses.forEach(function (boss) {
              //create data to send to the server
              _bossData[boss.name] = {
                lfrKills: boss.lfrKills,
                normalKills: boss.normalKills,
                heroicKills: boss.heroicKills,
                mythicKills: boss.mythicKills
              };

              var bossDiv = document.createElement('div');
              var p2 = document.createElement('p');
              var lfr = document.createElement('p');
              var normal = document.createElement('p');
              var heroic = document.createElement('p');
              var mythic = document.createElement('p');

              bossDiv.className = 'bossDiv';

              //create and display the data on the client
              p2.textContent = boss.name + ' kills:';
              lfr.textContent = 'LFR: ' + boss.lfrKills;
              normal.textContent = 'Normal: ' + boss.normalKills;
              heroic.textContent = 'Heroic: ' + boss.heroicKills;
              mythic.textContent = 'Mythic: ' + boss.mythicKills;

              //apply data to container for single boss
              bossDiv.appendChild(p2);
              bossDiv.appendChild(lfr);
              bossDiv.appendChild(normal);
              bossDiv.appendChild(heroic);
              bossDiv.appendChild(mythic);

              //apply boss div to content so the grid displays it correctly
              bossesDiv.appendChild(bossDiv);
            });

            data = {
              character: obj.name,
              realm: obj.realm,
              raid: raidData.name,
              bossData: JSON.stringify(_bossData)
            };

            //data has been grabbed, so enable the save data button
            postSendButton.disabled = false;
          }
          //There was an error getting data from blizzard
          else {
              h1.textContent = 'Error';
              p.textContent = 'Data not found for specified character or realm';
              contentTitle.innerHTML = '';
              bossesDiv.innerHTML = '';
              contentTitle.appendChild(h1);
              contentTitle.appendChild(p);
            }
        }
  }
  if (xhr.status === 204) {
    p.textContent = 'Data has been updated on server';

    contentTitle.innerHTML = '';
    bossesDiv.innerHTML = '';
    contentTitle.appendChild(p);
  }
};

//Send a get request to the blizzard API
var sendBlizzardGet = function sendBlizzardGet(e) {
  var xhr = new XMLHttpRequest();
  e.preventDefault();

  //make request for progression data about specified character from specified US server
  var character = document.querySelector('#characterField').value;
  var realm = document.querySelector('#realmField').value;

  xhr.open('GET', 'https://us.api.battle.net/wow/character/' + realm + '/' + character + '?fields=progression&locale=en_US&apikey=8ne7tyy8dchsywnvqaptkt824drdqa54');
  xhr.onload = function () {
    return handleResponse(xhr);
  };
  xhr.send();

  return false;
};

//send a get request to get a single character's data back
var sendGet = function sendGet(e) {
  var xhr = new XMLHttpRequest();
  e.preventDefault();

  //request the saved data for a certain character
  var character = document.querySelector('#characterServerField').value;

  xhr.open('GET', '/getCharacterData?character=' + character);
  xhr.onload = function () {
    return handleResponse(xhr);
  };
  xhr.send();

  return false;
};

//send a get request to see the top 5 players by kills
var sendTopGet = function sendTopGet(e) {
  var xhr = new XMLHttpRequest();
  e.preventDefault();

  //request the saved data for a certain character
  xhr.open('GET', '/getTopData');
  xhr.onload = function () {
    return handleResponse(xhr);
  };
  xhr.send();

  return false;
};

//Send a post request to store the last loaded character's data
var sendPost = function sendPost(e) {
  var xhr = new XMLHttpRequest();

  //set up the form data to include whatver data has in it
  var formData = '';
  var keys = Object.keys(data);
  keys.forEach(function (key) {
    formData += key + '=' + data[key] + '&';
  });

  xhr.open('POST', '/addCharacter');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    return handleResponse(xhr);
  };
  xhr.send(formData);

  e.preventDefault();
  return false;
};

//Set up buttons to do things
var setup = function setup() {
  var sendButton = document.querySelector('#userFormSend');
  var postSendButton = document.querySelector('#nameFormSend');
  var serverGetButton = document.querySelector('#serverDataGet');
  var serverGetTopButton = document.querySelector('#serverTopGet');

  sendButton.addEventListener('click', sendBlizzardGet);
  postSendButton.addEventListener('click', sendPost);
  serverGetButton.addEventListener('click', sendGet);
  serverGetTopButton.addEventListener('click', sendTopGet);
};

window.onload = setup;
