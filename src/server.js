const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const apiHandler = require('./apiResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  console.log(request.url);
  const parsedUrl = url.parse(request.url);
  const body = [];
  //there are some changes being made you shoud restart

  switch (parsedUrl.pathname) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/style.css':
      htmlHandler.getCss(request, response);
      break;
    case '/bundle.js':
      htmlHandler.getJS(request, response);
      break;
    case '/getData': 
      apiHandler.getUsers(request, response);
      break;
    case '/notReal':
      apiHandler.notFound(request, response);
      break;
    case '/addUser':
      request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
      });

      request.on('data', (chunk) => {
        body.push(chunk);
      });

      request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const bodyParams = query.parse(bodyString);
        apiHandler.addUser(request, response, bodyParams);
      });

      break;
    default:
      apiHandler.notFound(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
