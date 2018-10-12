let data = '';

//takes the xhr and the type of data requested
const handleResponse = (xhr, type) => {
  console.log(xhr)
    
  const content = document.querySelector('#content');
  const bossesDiv = document.querySelector('#bosses');
  const contentTitle = document.querySelector('#contentTitle');
  const rankings = document.querySelector('#rankings');
  const postSendButton = document.querySelector('#nameFormSend');
  const topCharacterGetButton = document.querySelector('#serverTopGet');
   
  const h1 = document.createElement('h1');
  const p = document.createElement('p');
    
    
  if(xhr.response) {
    const obj = JSON.parse(xhr.response);
      
      //disable the save data button
      postSendButton.disabled = true;
    
      if (xhr.status === 201) {
        //allow top character data to be searched now that data exists
        topCharacterGetButton.disabled = false;
        
        p.textContent = `Data has been saved to server`;

        contentTitle.innerHTML = '';
        bossesDiv.innerHTML = '';
        rankings.innerHTML = '';
        contentTitle.appendChild(p);
      }
      //successful get
      else if(xhr.status === 200 && obj.id) {
        //successful get on a character
        if(obj.id === 'Character Retrieved') {
          let bossData = JSON.parse(obj.bossData);
          
          console.dir(bossData);
          
          h1.textContent = `Raid: ${obj.raid}`;
          p.textContent = `Kills by ${obj.character}:`;

          contentTitle.innerHTML = '';
          bossesDiv.innerHTML = '';
          rankings.innerHTML = '';
          contentTitle.appendChild(h1);
          contentTitle.appendChild(p);

          let keys = Object.keys(bossData);
          keys.forEach((key) => {
            let boss = bossData[key];
            boss.name = key;
            
            let bossDiv = document.createElement('div');
            let p2 = document.createElement('p');
            let lfr = document.createElement('p');
            let normal = document.createElement('p');
            let heroic = document.createElement('p');
            let mythic = document.createElement('p');

            bossDiv.className = 'bossDiv';

            //create and display the data on the client
            p2.textContent = `${boss.name} kills:`
            lfr.textContent = `LFR: ${boss.lfrKills}`
            normal.textContent = `Normal: ${boss.normalKills}`
            heroic.textContent = `Heroic: ${boss.heroicKills}`
            mythic.textContent = `Mythic: ${boss.mythicKills}`

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
        else if(obj.id === 'Top Characters Retrieved') {
          let topFive = JSON.parse(obj.top);
          
          let keys = Object.keys(topFive);
          
          contentTitle.innerHTML = '';
          bossesDiv.innerHTML = '';
          rankings.innerHTML = '';
          
                    
          let rankTitle = document.createElement('h1');
          rankTitle.innerHTML = "Most Overall Kills In Uldir"
          rankings.appendChild(rankTitle);
          
          for(let i = 0; i < keys.length; i++) {
            let rank = document.createElement('p');
            rank.innerHTML = `${i + 1}: ${topFive[4 - i].name}, ${topFive[4 - i].score}`
            console.log(i)
            rankings.appendChild(rank);
          }
          
          console.log(topFive);
        }
      }
    else if(xhr.status === 404 && obj.id) {
      //failer on load character get
      if(obj.id = 'no data found') {
        h1.textContent = 'Error';
        p.textContent = 'No data stored for that character';
        contentTitle.innerHTML = '';
        bossesDiv.innerHTML = '';
        contentTitle.appendChild(h1);
        contentTitle.appendChild(p);
      }
      //Failure on Top Characters get
      if(obj.id = 'No Characters') {
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
        let raidData = obj.progression.raids[21];
        console.dir(raidData);

        let bossData = {}

        h1.textContent = `Raid: ${raidData.name}`;
        p.textContent = `Kills by ${obj.name}:`;

        contentTitle.innerHTML = '';
        bossesDiv.innerHTML = '';
        contentTitle.appendChild(h1);
        contentTitle.appendChild(p);

        raidData.bosses.forEach((boss) => {
          //create data to send to the server
          bossData[boss.name] = {
            lfrKills: boss.lfrKills,
            normalKills: boss.normalKills,
            heroicKills: boss.heroicKills,
            mythicKills: boss.mythicKills,
          }

          let bossDiv = document.createElement('div');
          let p2 = document.createElement('p');
          let lfr = document.createElement('p');
          let normal = document.createElement('p');
          let heroic = document.createElement('p');
          let mythic = document.createElement('p');

          bossDiv.className = 'bossDiv';

          //create and display the data on the client
          p2.textContent = `${boss.name} kills:`
          lfr.textContent = `LFR: ${boss.lfrKills}`
          normal.textContent = `Normal: ${boss.normalKills}`
          heroic.textContent = `Heroic: ${boss.heroicKills}`
          mythic.textContent = `Mythic: ${boss.mythicKills}`

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
          bossData: JSON.stringify(bossData),
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
    p.textContent = `Data has been updated on server`;

    contentTitle.innerHTML = '';
    bossesDiv.innerHTML = '';
    contentTitle.appendChild(p);
  }
  
};	

//Send a get request to the blizzard API
const sendBlizzardGet = (e) => {
  const xhr = new XMLHttpRequest();
  e.preventDefault();
  
  //make request for progression data about specified character from specified US server
  const character = document.querySelector('#characterField').value;
  const realm = document.querySelector('#realmField').value;
  
  xhr.open('GET', 'https://us.api.battle.net/wow/character/' + realm + '/' + character + '?fields=progression&locale=en_US&apikey=8ne7tyy8dchsywnvqaptkt824drdqa54');
  xhr.onload = () => handleResponse(xhr);		
  xhr.send();
    

  return false;
};

//send a get request to get a single character's data back
const sendGet = (e) => {
  const xhr = new XMLHttpRequest();
  e.preventDefault();
  
  //request the saved data for a certain character
  const character = document.querySelector('#characterServerField').value;

  xhr.open('GET', `/getCharacterData?character=${character}`);
  xhr.onload = () => handleResponse(xhr);		
  xhr.send();
    

  return false;
};

//send a get request to see the top 5 players by kills
const sendTopGet = (e) => {
  const xhr = new XMLHttpRequest();
  e.preventDefault();
  
  //request the saved data for a certain character
  xhr.open('GET', '/getTopData');
  xhr.onload = () => handleResponse(xhr);		
  xhr.send();
    

  return false;
};
 
//Send a post request to store the last loaded character's data
const sendPost = (e) => {
  const xhr = new XMLHttpRequest();
  
  //set up the form data to include whatver data has in it
  let formData = ``;
  let keys = Object.keys(data);
  keys.forEach((key) => {
    formData += `${key}=${data[key]}&`
  });
  
  xhr.open('POST', '/addCharacter');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onload = () => handleResponse(xhr);		
  xhr.send(formData);
   
  e.preventDefault();
  return false;
}

//Set up buttons to do things
const setup = () => {
  const sendButton = document.querySelector('#userFormSend');
  const postSendButton = document.querySelector('#nameFormSend');
  const serverGetButton = document.querySelector('#serverDataGet');
  const serverGetTopButton = document.querySelector('#serverTopGet');

  sendButton.addEventListener('click', sendBlizzardGet)
  postSendButton.addEventListener('click', sendPost)
  serverGetButton.addEventListener('click', sendGet)
  serverGetTopButton.addEventListener('click', sendTopGet)
};

window.onload = setup;
