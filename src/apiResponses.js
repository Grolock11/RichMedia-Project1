const characters = {};

// Add a character to storage
const addCharacter = (request, response, data) => {
  const responseJSON = {
    message: 'All fields are required',
  };

  console.log(data);

  if (!data.character || !data.realm) {
    responseJSON.id = 'missingParams';
    response.statusCode = 400;
  } else {
    response.statusCode = 201;
    responseJSON.id = 'Created';
    responseJSON.message = 'Created Successfully';

    if (characters[data.character]) {
      response.statusCode = 204;
    }

    // store the character using name for id
    characters[data.character] = {
      character: data.character,
      realm: data.realm,
      raid: data.raid,
      bossData: data.bossData,
    };
  }

  if (response.statusCode !== 204) {
    response.write(JSON.stringify(responseJSON));
  }

  response.end();
};

// retrieve the data of a single character
const getCharacter = (request, response, queryParams) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  let obj = {};
  // check if data was recieved
  if (!queryParams.character) {
    if (request.method === 'GET') {
      obj.id = 'missingName';
    }

    response.statusCode = 400;
    return response.end();
  }
  // check if character data exists
  if (!characters[queryParams.character]) {
    if (request.method === 'GET') {
      obj.id = 'no data found';
    }

    response.statusCode = 404;
    return response.end();
  }

  if (request.method === 'GET') {
    obj = characters[queryParams.character];
    obj.id = 'Character Retrieved';

    response.write(JSON.stringify(obj));
  }

  return response.end();
};

// get the top 5 characters by number of total kills
const getTop = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });

  // make sure there are characters to pick from
  if (Object.keys(characters).length > 0) {
    if (request.method === 'GET') {
      let charScores = [];

      Object.keys(characters).forEach((key) => {
        const bosses = JSON.parse(characters[key].bossData);
        let score = 0;

        Object.keys(bosses).forEach((key2) => {
          score += bosses[key2].lfrKills;
          score += bosses[key2].normalKills;
          score += bosses[key2].heroicKills;
          score += bosses[key2].mythicKills;
        });

        charScores.push({
          name: key,
          score,
        });
      });

      charScores.sort((a, b) => a.score - b.score);

      console.log(charScores);
      charScores = charScores.slice(0, 5);

      const scoresObj = {};

      // for loop to preserver order after the sort
      for (let i = 0; i < charScores.length; i++) {
        scoresObj[i] = charScores[i];
      }

      console.dir(scoresObj);

      const topFive = {
        top: JSON.stringify(scoresObj),
      };

      // set up return with id
      const obj = topFive;
      obj.id = 'Top Characters Retrieved';
      response.write(JSON.stringify(obj));
    }
  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' });

    if (request.method === 'GET') {
      const obj = {
        id: 'No Characters',
      };

      response.write(JSON.stringify(obj));
    }

    return response.end();
  }

  return response.end();
};

module.exports = {
  addCharacter,
  getCharacter,
  getTop,
};
