const characters = {};

const getUsers = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });

  if (request.method === 'GET') {
    const obj = {
      characters,
      id: 'Success',
    };

    response.write(JSON.stringify(obj));
  }

  response.end();
};

const addUser = (request, response, data) => {
  const responseJSON = {
    message: 'All fields are required',
  };
  
  console.log(data);

  if (!data.character || !data.realm) {
    responseJSON.id = 'missingParams';
    response.statusCode = 400;
  } else {
    response.stratusCode = 201;
    responseJSON.id = 'Created';
    responseJSON.message = 'Created Successfully';

    if (characters[data.name]) {
      response.statusCode = 204;
    }

    //store the character using latModified as a pseudo id number
    characters[data.lastModified] = {
      character: data.character,
      realm: data.realm,
      mounts: data.mounts,
      first: data.first
    };
  }

  if (response.statusCode !== 204) {
    response.write(JSON.stringify(responseJSON));
  }

  response.end();
};

const notFound = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'application/json' });

  if (request.method === 'GET') {
    const obj = {
      message: 'The page you are looking for was not found',
      id: 'notFound',
    };

    response.write(JSON.stringify(obj));
  }

  response.end();
};

module.exports = {
  getUsers,
  addUser,
  notFound,
};
