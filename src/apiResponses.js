let users = {};

const getUsers = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });

  if (request.method === 'GET') {
    const obj = {
      users: users
    };

    response.write(JSON.stringify(obj));
  }

  response.end();
};

const addUser = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'app;ocation/json' });

  const body = [];
  
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });
  
  request.on('data', (chunk) => {
    body.push(chunk);
  });
  
  let data = '';
  
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    data = query.parse(bodyString);
  });
  
  const responseJSON = {
    message: 'All fields are required',
  };
  
  if(!data.name || !data.age) {
    responseJSON.id = 'missingParams'
    responseJSON.statusCode = 400;
    response.end()
  }

  response.write(JSON.stringify(obj));

  response.end();
};

const notFound = (request, response, acceptType) => {
  response.writeHead(404, { 'Content-Type': 'application/json' });

  const obj = {
    message: 'The page you are looking for was not found',
    id: 'Resource Not Found',
  };

  response.write(JSON.stringify(obj));
  response.end();
};

module.exports = {
  getUsers,
  addUser,
  notFound,
};
