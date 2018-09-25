const users = {};

const getUsers = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });

  if (request.method === 'GET') {
    const obj = {
      users,
      id: 'Success',
    };

    response.write(JSON.stringify(obj));
  }

  response.end();
};

const addUser = (request, response, data) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });

  console.dir(data);

  const responseJSON = {
    message: 'All fields are required',
  };

  if (!data.name || !data.age) {
    responseJSON.id = 'missingParams';
    response.statusCode = 400;
  } else {
    // add user here
  }

  response.write(JSON.stringify(responseJSON));

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
